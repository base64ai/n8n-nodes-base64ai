import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	type IDataObject,
	type IExecuteFunctions,
	type ILoadOptionsFunctions,
	type IHttpRequestOptions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';
import { scanDescription } from './resources/scan';
import { asyncDescription } from './resources/async';
import { signatureDescription } from './resources/signature';
import { faceDescription } from './resources/face';
import { flowDescription } from './resources/flow';
import { resultDescription } from './resources/result';

const BASE_URL = 'https://api.base64.ai';
const DEFAULT_HEADERS = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
};

type OperationPayloadBuilder = (
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
) => Promise<{ body: IDataObject; headers: Record<string, string> }>;

type OperationHandler = (
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
) => Promise<IHttpRequestOptions>;

export class Base64ai implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Base64.ai',
		name: 'base64ai',
		icon: { light: 'file:base64ai.svg', dark: 'file:base64ai.dark.svg' },
		group: ['transform'],
		defaultVersion: 1,
		version: [1],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Base64.ai API',
		defaults: {
			name: 'Base64ai',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'base64aiApi', required: true }],
		requestDefaults: {
			baseURL: BASE_URL,
			headers: DEFAULT_HEADERS,
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Async',
						value: 'async',
					},
					{
						name: 'Face',
						value: 'face',
					},
					{
						name: 'Flow',
						value: 'flow',
					},
					{
						name: 'Result',
						value: 'result',
					},
					{
						name: 'Scan',
						value: 'scan',
					},
					{
						name: 'Signature',
						value: 'signature',
					},
				],
				default: 'scan',
			},
			...scanDescription,
			...asyncDescription,
			...signatureDescription,
			...faceDescription,
			...flowDescription,
			...resultDescription,
		],
	};

	methods = {
		loadOptions: {
			async getFlows(this: ILoadOptionsFunctions) {
				const requestOptions: IHttpRequestOptions = {
					method: 'GET',
					url: '/flow',
					json: true,
					baseURL: BASE_URL,
					headers: { ...DEFAULT_HEADERS },
					qs: {
						accessLevel: 'owner,administrator,uploader',
					},
				};

				const flowsResponse = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'base64aiApi',
					requestOptions,
				)) as Array<{ flowID: string; name?: string }>;

				if (!Array.isArray(flowsResponse)) {
					return [];
				}

				return flowsResponse
					.filter((flow) => typeof flow?.flowID === 'string')
					.map((flow) => ({
						name: flow.name ?? flow.flowID,
						value: flow.flowID,
					}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const handlerKey = `${resource}:${operation}`;
				const handler = operationHandlers[handlerKey];

				if (!handler) {
					throw new NodeOperationError(
						this.getNode(),
						`The combination of resource "${resource}" and operation "${operation}" is not supported.`,
						{ itemIndex: i },
					);
				}

				const requestOptions = await handler(this, items, i);
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'base64aiApi',
					requestOptions,
				);

				returnData.push({ json: response as IDataObject });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}

				if (error instanceof NodeApiError || error instanceof NodeOperationError) {
					throw error;
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

function getFlowIdParameter(
	context: IExecuteFunctions,
	itemIndex: number,
	selectionName: string,
	listFieldName: string,
	manualFieldName: string,
): string | undefined {
	const flowSelection = context.getNodeParameter(selectionName, itemIndex, 'list') as 'list' | 'manual';
	const flowIdParam =
		flowSelection === 'manual'
			? (context.getNodeParameter(manualFieldName, itemIndex, '') as string)
			: (context.getNodeParameter(listFieldName, itemIndex, '') as string);
	const flowId = flowIdParam?.toString().trim();

	return flowId || undefined;
}

function resolveFlowIdParameter(
	context: IExecuteFunctions,
	itemIndex: number,
	selectionName: string,
	listFieldName: string,
	manualFieldName: string,
): string {
	const flowId = getFlowIdParameter(context, itemIndex, selectionName, listFieldName, manualFieldName);

	if (!flowId) {
		throw new NodeOperationError(context.getNode(), 'Flow ID is required to retrieve results.', {
			itemIndex,
		});
	}

	return flowId;
}

async function buildScanRequestPayload(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<{ body: IDataObject; headers: Record<string, string> }> {
	const inputSource = context.getNodeParameter('inputSource', itemIndex) as 'url' | 'binary';
	const flowId = getFlowIdParameter(context, itemIndex, 'flowSelection', 'flowId', 'flowIdManual');
	const body: IDataObject = {};

	if (inputSource === 'url') {
		body.url = context.getNodeParameter('documentUrl', itemIndex);
	} else {
		const binaryPropertyName = context.getNodeParameter('binaryPropertyName', itemIndex) as string;
		body.document = await getBinaryDataAsDataUri(context, items, itemIndex, binaryPropertyName);
	}

	const headers: Record<string, string> = { ...DEFAULT_HEADERS };

	if (flowId) {
		headers['base64ai-flow-id'] = flowId;
	}

	return { body, headers };
}

async function buildSignatureRecognitionPayload(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<{ body: IDataObject; headers: Record<string, string> }> {
	const inputSource = context.getNodeParameter('signatureInputSource', itemIndex) as 'url' | 'binary';
	const body: IDataObject = {};

	if (inputSource === 'url') {
		body.url = context.getNodeParameter('signatureDocumentUrl', itemIndex);
	} else {
		const binaryPropertyName = context.getNodeParameter('signatureBinaryPropertyName', itemIndex) as string;
		body.document = await getBinaryDataAsDataUri(context, items, itemIndex, binaryPropertyName);
	}

	return { body, headers: { ...DEFAULT_HEADERS } };
}

async function buildSignatureVerificationPayload(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<{ body: IDataObject; headers: Record<string, string> }> {
	const inputSource = context.getNodeParameter('signatureVerificationInputSource', itemIndex) as
		| 'url'
		| 'binary';
	const body: IDataObject = {};

	if (inputSource === 'url') {
		body.url = context.getNodeParameter('signatureVerificationDocumentUrl', itemIndex);
		body.queryUrl = context.getNodeParameter('signatureVerificationQueryUrl', itemIndex);
	} else {
		const documentBinaryProperty = context.getNodeParameter(
			'signatureVerificationBinaryPropertyName',
			itemIndex,
		) as string;
		const queryBinaryProperty = context.getNodeParameter(
			'signatureVerificationQueryBinaryPropertyName',
			itemIndex,
		) as string;

		body.document = await getBinaryDataAsDataUri(context, items, itemIndex, documentBinaryProperty);
		body.queryDocument = await getBinaryDataAsDataUri(context, items, itemIndex, queryBinaryProperty);
	}

	return { body, headers: { ...DEFAULT_HEADERS } };
}

async function getBinaryDataAsDataUri(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
	binaryPropertyName: string,
): Promise<string> {
	const itemBinary = items[itemIndex].binary?.[binaryPropertyName];

	if (!itemBinary) {
		throw new NodeOperationError(
			context.getNode(),
			`Binary property "${binaryPropertyName}" is missing from input item.`,
			{ itemIndex },
		);
	}

	const binaryBuffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
	const mimeType = itemBinary.mimeType ?? 'application/octet-stream';
	const base64Payload = binaryBuffer.toString('base64');
	return `data:${mimeType};base64,${base64Payload}`;
}

async function buildFaceDetectionPayload(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<{ body: IDataObject; headers: Record<string, string> }> {
	const inputSource = context.getNodeParameter('faceInputSource', itemIndex) as 'url' | 'binary';
	const body: IDataObject = {};

	if (inputSource === 'url') {
		body.url = context.getNodeParameter('faceDocumentUrl', itemIndex);
	} else {
		const binaryPropertyName = context.getNodeParameter('faceBinaryPropertyName', itemIndex) as string;
		body.document = await getBinaryDataAsDataUri(context, items, itemIndex, binaryPropertyName);
	}

	return { body, headers: { ...DEFAULT_HEADERS } };
}

async function buildFaceRecognitionPayload(
	context: IExecuteFunctions,
	items: INodeExecutionData[],
	itemIndex: number,
): Promise<{ body: IDataObject; headers: Record<string, string> }> {
	const inputSource = context.getNodeParameter('faceRecognitionInputSource', itemIndex) as 'url' | 'binary';
	const body: IDataObject = {};

	if (inputSource === 'url') {
		body.url = context.getNodeParameter('faceRecognitionDocumentUrl', itemIndex);
		body.queryUrl = context.getNodeParameter('faceRecognitionQueryUrl', itemIndex);
	} else {
		const documentBinaryProperty = context.getNodeParameter(
			'faceRecognitionBinaryPropertyName',
			itemIndex,
		) as string;
		const queryBinaryProperty = context.getNodeParameter(
			'faceRecognitionQueryBinaryPropertyName',
			itemIndex,
		) as string;

		body.document = await getBinaryDataAsDataUri(context, items, itemIndex, documentBinaryProperty);
		body.queryDocument = await getBinaryDataAsDataUri(context, items, itemIndex, queryBinaryProperty);
	}

	return { body, headers: { ...DEFAULT_HEADERS } };
}

const createPostHandler =
	(urlPath: string, payloadBuilder: OperationPayloadBuilder): OperationHandler =>
	async (context, items, itemIndex) => {
		const { body, headers } = await payloadBuilder(context, items, itemIndex);
		return {
			method: 'POST',
			url: urlPath,
			body,
			json: true,
			baseURL: BASE_URL,
			headers,
		};
	};

const getAsyncScanResultHandler: OperationHandler = async (context, _items, itemIndex) => {
	const asyncFileUuid = context.getNodeParameter('asyncFileUuid', itemIndex) as string;
	return {
		method: 'GET',
		url: `/scan/async/${encodeURIComponent(asyncFileUuid)}`,
		json: true,
		baseURL: BASE_URL,
		headers: { ...DEFAULT_HEADERS },
	};
};

const listFlowsHandler: OperationHandler = async () => ({
	method: 'GET',
	url: '/flow',
	json: true,
	baseURL: BASE_URL,
	headers: { ...DEFAULT_HEADERS },
});

const getFlowResultsHandler: OperationHandler = async (context, _items, itemIndex) => {
	const flowId = resolveFlowIdParameter(
		context,
		itemIndex,
		'resultFlowSelection',
		'resultFlowId',
		'resultFlowIdManual',
	);
	const filters = (context.getNodeParameter('resultFilters', itemIndex, {}) as IDataObject) ?? {};
	const { limit, qPreviousTimestamp, qNextTimestamp, filter } = filters as {
		limit?: number;
		qPreviousTimestamp?: string;
		qNextTimestamp?: string;
		filter?: string;
	};

	const qs: IDataObject = { flowID: flowId };

	if (typeof limit === 'number' && Number.isFinite(limit)) {
		qs.limit = limit;
	}

	if (typeof qPreviousTimestamp === 'string' && qPreviousTimestamp.trim().length > 0) {
		qs.qPreviousTimestamp = qPreviousTimestamp.trim();
	}

	if (typeof qNextTimestamp === 'string' && qNextTimestamp.trim().length > 0) {
		qs.qNextTimestamp = qNextTimestamp.trim();
	}

	if (typeof filter === 'string' && filter.trim().length > 0) {
		qs.filter = filter.trim();
	}

	return {
		method: 'GET',
		url: '/result',
		json: true,
		baseURL: BASE_URL,
		headers: { ...DEFAULT_HEADERS },
		qs,
	};
};

const getResultByUuidHandler: OperationHandler = async (context, _items, itemIndex) => {
	const resultUuid = context.getNodeParameter('resultUuid', itemIndex) as string;
	const trimmedUuid = resultUuid?.toString().trim();

	if (!trimmedUuid) {
		throw new NodeOperationError(context.getNode(), 'Result UUID is required.', { itemIndex });
	}

	return {
		method: 'GET',
		url: `/result/${encodeURIComponent(trimmedUuid)}`,
		json: true,
		baseURL: BASE_URL,
		headers: { ...DEFAULT_HEADERS },
	};
};

const operationHandlers: Record<string, OperationHandler> = {
	'scan:scanDocument': createPostHandler('/scan', buildScanRequestPayload),
	'async:createAsyncScan': createPostHandler('/scan/async', buildScanRequestPayload),
	'async:getAsyncScanResult': getAsyncScanResultHandler,
	'signature:recognizeSignature': createPostHandler('/signature', buildSignatureRecognitionPayload),
	'signature:verifySignature': createPostHandler('/signature', buildSignatureVerificationPayload),
	'face:detectFace': createPostHandler('/face', buildFaceDetectionPayload),
	'face:recognizeFace': createPostHandler('/face', buildFaceRecognitionPayload),
	'flow:listFlows': listFlowsHandler,
	'result:getFlowResults': getFlowResultsHandler,
	'result:getResultByUuid': getResultByUuidHandler,
};

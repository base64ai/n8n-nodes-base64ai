import type { INodeProperties } from 'n8n-workflow';
import { scanDocumentDescription } from './scanDocument';
import { createScanInputProperties } from '../shared/scanInputs';

const showOnlyForDocument = {
	resource: ['document'],
};

const createAsyncScanDescription = createScanInputProperties('document', 'recognizeDocumentAsync');

const getAsyncScanResultDescription: INodeProperties[] = [
	{
		displayName: 'Async File UUID',
		name: 'asyncFileUuid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getAsyncScanResult'],
			},
		},
		description:
			'UUID returned from the async scan creation request. Used to poll for completion or fetch the result.',
	},
];

export const scanDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForDocument,
		},
		options: [
			{
				name: 'Recognize Document',
				value: 'recognizeDocument',
				action: 'Recognize a document',
				description: 'Recognize a document by URL or binary data',
			},
			{
				name: 'Recognize Document Async',
				value: 'recognizeDocumentAsync',
				action: 'Recognize a document asynchronously',
				description:
					'Start an asynchronous document recognition job by uploading a document or URL',
			},
			{
				name: 'Get Async Scan Result',
				value: 'getAsyncScanResult',
				action: 'Get async scan result',
				description: 'Fetch the status or result of a previously created async scan job',
			},
		],
		default: 'recognizeDocument',
	},
	...scanDocumentDescription,
	...createAsyncScanDescription,
	...getAsyncScanResultDescription,
];

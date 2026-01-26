import type { INodeProperties } from 'n8n-workflow';
import { recognizeDocumentDescription } from './recognizeDocument';
import { createDocumentInputProperties } from '../shared';

const showOnlyForDocument = {
	resource: ['document'],
};

const createAsyncScanDescription = createDocumentInputProperties(
	'document',
	'recognizeDocumentAsync',
);

const getAsyncScanResultDescription: INodeProperties[] = [
	{
		displayName: 'Async File UUID',
		name: 'asyncFileUuid',
		type: 'string',
		required: true,
		placeholder: 'e.g. 2fa8fca0-b41d-3280-8b6e-0c47ddd22673',
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
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getAsyncScanResult'],
				'@version': [2],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];

export const documentDescription: INodeProperties[] = [
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
	...recognizeDocumentDescription,
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['recognizeDocument'],
				'@version': [2],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
	...createAsyncScanDescription,
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['recognizeDocumentAsync'],
				'@version': [2],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
	...getAsyncScanResultDescription,
];

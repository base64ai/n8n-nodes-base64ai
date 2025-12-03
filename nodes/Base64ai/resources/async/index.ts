import type { INodeProperties } from 'n8n-workflow';
import { createScanInputProperties } from '../shared/scanInputs';

const showOnlyForAsync = {
	resource: ['async'],
};

const createAsyncScanDescription = createScanInputProperties('async', 'createAsyncScan');

const getAsyncScanResultDescription: INodeProperties[] = [
	{
		displayName: 'Async File UUID',
		name: 'asyncFileUuid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['async'],
				operation: ['getAsyncScanResult'],
			},
		},
		description:
			'UUID returned from the async scan creation request. Used to poll for completion or fetch the result.',
	},
];

export const asyncDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAsync,
		},
		options: [
			{
				name: 'Create Scan Task',
				value: 'createAsyncScan',
				action: 'Create async scan task',
				description: 'Start an asynchronous scan job by uploading a document or URL',
			},
			{
				name: 'Get Scan Result',
				value: 'getAsyncScanResult',
				action: 'Get async scan result',
				description: 'Fetch the status or result of a previously created async scan job',
			},
		],
		default: 'createAsyncScan',
	},
	...createAsyncScanDescription,
	...getAsyncScanResultDescription,
];


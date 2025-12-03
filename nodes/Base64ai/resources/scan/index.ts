import type { INodeProperties } from 'n8n-workflow';
import { scanDocumentDescription } from './scanDocument';

const showOnlyForScan = {
	resource: ['scan'],
};

export const scanDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForScan,
		},
		options: [
			{
				name: 'Scan Document',
				value: 'scanDocument',
				action: 'Scan a document',
				description: 'Scan a document by URL or binary data',
			},
		],
		default: 'scanDocument',
	},
	...scanDocumentDescription,
];

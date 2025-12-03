import type { INodeProperties } from 'n8n-workflow';

const showOnlyForFlow = {
	resource: ['flow'],
};

export const flowDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForFlow,
		},
		options: [
			{
				name: 'List Flows',
				value: 'listFlows',
				action: 'List flows',
				description: 'Retrieve all flows configured in your Base64.ai account',
			},
		],
		default: 'listFlows',
	},
];


import type { INodeProperties } from 'n8n-workflow';

const showOnlyForResult = {
	resource: ['result'],
};

const showOnlyForFlowResults = {
	resource: ['result'],
	operation: ['getFlowResults'],
};

const showOnlyForResultUuid = {
	resource: ['result'],
	operation: ['getResultByUuid'],
};

export const resultDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForResult,
		},
		options: [
			{
				name: 'Get Flow Results',
				value: 'getFlowResults',
				action: 'Get flow results',
				description: 'Retrieve results created by the specified flow',
			},
			{
				name: 'Get Result by UUID',
				value: 'getResultByUuid',
				action: 'Get result by UUID',
				description: 'Fetch a single result using its UUID',
			},
		],
		default: 'getFlowResults',
	},
	{
		displayName: 'Flow Selection',
		name: 'resultFlowSelection',
		type: 'options',
		options: [
			{
				name: 'Choose From List',
				value: 'list',
			},
			{
				name: 'Enter Flow ID',
				value: 'manual',
			},
		],
		default: 'list',
		displayOptions: {
			show: showOnlyForFlowResults,
		},
		description: 'Choose whether to select a flow from the dropdown or enter the ID manually',
	},
	{
		displayName: 'Flow Name or ID',
		name: 'resultFlowId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getFlows',
		},
		required: true,
		default: '',
		noDataExpression: true,
		displayOptions: {
			show: {
				...showOnlyForFlowResults,
				resultFlowSelection: ['list'],
			},
		},
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: 'Flow ID',
		name: 'resultFlowIdManual',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...showOnlyForFlowResults,
				resultFlowSelection: ['manual'],
			},
		},
		description: 'Specify the Base64.ai flow ID manually (for example: 2fa8fca0-b41d-3280-8b6e-0c47ddd22673)',
	},
	{
		displayName: 'Result Filters',
		name: 'resultFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: showOnlyForFlowResults,
		},
		description: 'Optional query parameters to further narrow the returned results',
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Previous Timestamp',
				name: 'qPreviousTimestamp',
				type: 'string',
				default: '',
				description:
					'Only return results created before this timestamp (in milliseconds). Maps to qPreviousTimestamp.',
			},
			{
				displayName: 'Next Timestamp',
				name: 'qNextTimestamp',
				type: 'string',
				default: '',
				description:
					'Only return results created after this timestamp (in milliseconds). Maps to qNextTimestamp.',
			},
			{
				displayName: 'Status Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of statuses to include (for example: approved,autoApproved). Maps to filter.',
			},
		],
	},
	{
		displayName: 'Result UUID',
		name: 'resultUuid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyForResultUuid,
		},
		description: 'UUID of the specific result you want to fetch',
	},
];


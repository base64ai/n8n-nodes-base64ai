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
		displayName: 'Flow',
		name: 'resultFlow',
		type: 'resourceLocator',
		default: { __rl: true, mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				...showOnlyForFlowResults,
				'@version': [2],
			},
		},
		description: 'Choose a Base64.ai flow to retrieve results from',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a flow...',
				typeOptions: {
					searchListMethod: 'getFlows',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 2fa8fca0-b41d-3280-8b6e-0c47ddd22673',
				validation: [
					{
						type: 'regex',
						properties: {
							regex:
								'[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
							errorMessage: 'Enter a valid Flow ID in UUID format',
						},
					},
				],
			},
		],
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
			show: {
				...showOnlyForFlowResults,
				'@version': [1],
			},
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
				'@version': [1],
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
		placeholder: 'e.g. 2fa8fca0-b41d-3280-8b6e-0c47ddd22673',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForFlowResults,
				resultFlowSelection: ['manual'],
				'@version': [1],
			},
		},
		description: 'Specify the Base64.ai flow ID manually (for example: 2fa8fca0-b41d-3280-8b6e-0c47ddd22673)',
	},
	{
		displayName: 'Options',
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
					maxValue: 100,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Previous Timestamp',
				name: 'qPreviousTimestamp',
				type: 'string',
				placeholder: 'e.g. 1735689600000',
				default: '',
				description:
					'Only return results created before this timestamp (in milliseconds). Maps to qPreviousTimestamp.',
			},
			{
				displayName: 'Next Timestamp',
				name: 'qNextTimestamp',
				type: 'string',
				placeholder: 'e.g. 1735689600000',
				default: '',
				description:
					'Only return results created after this timestamp (in milliseconds). Maps to qNextTimestamp.',
			},
			{
				displayName: 'Status Filter',
				name: 'filter',
				type: 'string',
				placeholder: 'e.g. approved,autoApproved',
				default: '',
				description:
					'Comma-separated list of statuses to include (for example: approved,autoApproved). Maps to filter.',
			},
		],
	},
	{
		displayName: 'Sorting',
		name: 'resultSorting',
		type: 'collection',
		placeholder: 'Add Sort',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForFlowResults,
				'@version': [2],
			},
		},
		description: 'Return results in newest-first order for the selected field',
		options: [
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'options',
				options: [
					{
						name: 'Updated At',
						value: 'updatedAt',
					},
					{
						name: 'Created At',
						value: 'createdAt',
					},
				],
				default: 'updatedAt',
				description: 'Field to use for sorting',
			},
		],
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyForFlowResults,
				'@version': [2],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
	{
		displayName: 'Result UUID',
		name: 'resultUuid',
		type: 'string',
		required: true,
		placeholder: 'e.g. 2fa8fca0-b41d-3280-8b6e-0c47ddd22673',
		default: '',
		displayOptions: {
			show: showOnlyForResultUuid,
		},
		description: 'UUID of the specific result you want to fetch',
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyForResultUuid,
				'@version': [2],
			},
		},
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
];


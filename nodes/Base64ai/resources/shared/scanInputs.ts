import type { INodeProperties } from 'n8n-workflow';

const createDisplayOptions = (resource: string, operation: string) => ({
	operation: [operation],
	resource: [resource],
});

export const createScanInputProperties = (
	resource: string,
	operation: string,
): INodeProperties[] => {
	const showOnly = createDisplayOptions(resource, operation);

	return [
		{
			displayName: 'Input Source',
			name: 'documentInputSource',
			type: 'options',
			options: [
				{
					name: 'URL',
					value: 'url',
					description: 'Provide a publicly accessible URL',
				},
				{
					name: 'Binary Data',
					value: 'binary',
					description: 'Use binary data from a previous node',
				},
			],
			default: 'url',
			displayOptions: {
				show: showOnly,
			},
			description: 'Select how to supply the document to Base64.ai',
		},
		{
			displayName: 'Document URL',
			name: 'documentUrl',
			type: 'string',
			required: true,
			placeholder: 'e.g. https://example.com/document.pdf',
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					documentInputSource: ['url'],
				},
			},
			description: 'Public URL of the document you want Base64.ai to scan',
		},
		{
			displayName: 'Binary Property',
			name: 'documentBinaryPropertyName',
			type: 'string',
			required: true,
			default: 'data',
			displayOptions: {
				show: {
					...showOnly,
					documentInputSource: ['binary'],
				},
			},
			description: 'Name of the binary property that contains the file data from a previous node',
		},
		{
			displayName: 'Flow',
			name: 'documentFlow',
			type: 'resourceLocator',
			default: { __rl: true, mode: 'list', value: '' },
			displayOptions: {
				show: {
					...showOnly,
					'@version': [2],
				},
			},
			description: 'Choose a Base64.ai flow to apply to the document',
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
			name: 'documentFlowSelection',
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
					...showOnly,
					'@version': [1],
				},
			},
			description: 'Decide whether to pick a Base64.ai flow from the list or enter an ID manually',
		},
		{
			displayName: 'Flow Name or ID',
			name: 'documentFlowId',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getFlows',
			},
			placeholder: 'Default flow',
			default: '',
			noDataExpression: true,
			displayOptions: {
				show: {
					...showOnly,
					documentFlowSelection: ['list'],
					'@version': [1],
				},
			},
			description:
				'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		},
		{
			displayName: 'Flow ID',
			name: 'documentFlowIdManual',
			type: 'string',
			placeholder: 'e.g. 2fa8fca0-b41d-3280-8b6e-0c47ddd22673',
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					documentFlowSelection: ['manual'],
					'@version': [1],
				},
			},
			description: 'Enter a Base64.ai flow ID such as b013f15e-be16-4438-918d-bd4ea115abe8',
		},
	];
};

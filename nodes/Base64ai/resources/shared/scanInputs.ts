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
				show: showOnly,
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
				},
			},
			description:
				'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		},
		{
			displayName: 'Flow ID',
			name: 'documentFlowIdManual',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					documentFlowSelection: ['manual'],
				},
			},
			description: 'Enter a Base64.ai flow ID such as b013f15e-be16-4438-918d-bd4ea115abe8',
		},
	];
};

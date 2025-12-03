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
			name: 'inputSource',
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
			displayName: 'Flow Selection',
			name: 'flowSelection',
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
			description:
				'Decide whether to pick a Base64.ai flow from the list or enter an ID manually',
		},
		{
			displayName: 'Flow Name or ID',
			name: 'flowId',
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
					flowSelection: ['list'],
				},
			},
			description:
				'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		},
		{
			displayName: 'Flow ID',
			name: 'flowIdManual',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					flowSelection: ['manual'],
				},
			},
			description: 'Enter a Base64.ai flow ID such as b013f15e-be16-4438-918d-bd4ea115abe8',
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
					inputSource: ['url'],
				},
			},
			description: 'Public URL of the document you want Base64.ai to scan',
		},
		{
			displayName: 'Binary Property',
			name: 'binaryPropertyName',
			type: 'string',
			required: true,
			default: 'data',
			displayOptions: {
				show: {
					...showOnly,
					inputSource: ['binary'],
				},
			},
			description:
				'Name of the binary property that contains the file data from a previous node',
		},
	];
};




import type { INodeProperties } from 'n8n-workflow';

const createDisplayOptions = (operation: string) => ({
	resource: ['signature'],
	operation: [operation],
});

const inputSourceOptions = [
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
];

const signatureRecognitionProperties: INodeProperties[] = [
	{
		displayName: 'Input Source',
		name: 'signatureInputSource',
		type: 'options',
		options: inputSourceOptions,
		default: 'url',
		displayOptions: {
			show: createDisplayOptions('recognizeSignature'),
		},
		description: 'Select how to supply the signature image to Base64.ai',
	},
	{
		displayName: 'Signature URL',
		name: 'signatureDocumentUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...createDisplayOptions('recognizeSignature'),
				signatureInputSource: ['url'],
			},
		},
		description: 'Public URL of the signature image to process',
	},
	{
		displayName: 'Binary Property',
		name: 'signatureBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: {
				...createDisplayOptions('recognizeSignature'),
				signatureInputSource: ['binary'],
			},
		},
		description: 'Binary property that contains the signature image',
	},
];

const signatureVerificationProperties: INodeProperties[] = [
	{
		displayName: 'Input Source',
		name: 'signatureVerificationInputSource',
		type: 'options',
		options: inputSourceOptions,
		default: 'url',
		displayOptions: {
			show: createDisplayOptions('verifySignature'),
		},
		description: 'Select how to supply the signature pair to Base64.ai',
	},
	{
		displayName: 'Signature URL',
		name: 'signatureVerificationDocumentUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...createDisplayOptions('verifySignature'),
				signatureVerificationInputSource: ['url'],
			},
		},
		description: 'URL for the signature being verified',
	},
	{
		displayName: 'Reference Signature URL',
		name: 'signatureVerificationQueryUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...createDisplayOptions('verifySignature'),
				signatureVerificationInputSource: ['url'],
			},
		},
		description: 'URL for the reference signature to compare against',
	},
	{
		displayName: 'Signature Binary Property',
		name: 'signatureVerificationBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'signatureDocument',
		displayOptions: {
			show: {
				...createDisplayOptions('verifySignature'),
				signatureVerificationInputSource: ['binary'],
			},
		},
		description: 'Binary property that contains the signature being verified',
	},
	{
		displayName: 'Reference Binary Property',
		name: 'signatureVerificationQueryBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'referenceDocument',
		displayOptions: {
			show: {
				...createDisplayOptions('verifySignature'),
				signatureVerificationInputSource: ['binary'],
			},
		},
		description: 'Binary property that contains the reference signature',
	},
];

export const signatureDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['signature'],
			},
		},
		options: [
			{
				name: 'Recognize Signature',
				value: 'recognizeSignature',
				action: 'Recognize a signature',
				description: 'Extract signature information from an image or document',
			},
			{
				name: 'Verify Signature',
				value: 'verifySignature',
				action: 'Verify a signature',
				description: 'Compare a signature against a reference sample',
			},
		],
		default: 'recognizeSignature',
	},
	...signatureRecognitionProperties,
	...signatureVerificationProperties,
];




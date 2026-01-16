import type { INodeProperties } from 'n8n-workflow';

const createDisplayOptions = (operation: string) => ({
	resource: ['face'],
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

const faceRecognitionProperties: INodeProperties[] = [
	{
		displayName: 'Input Source',
		name: 'faceRecognitionInputSource',
		type: 'options',
		options: inputSourceOptions,
		default: 'url',
		displayOptions: {
			show: createDisplayOptions('recognizeFace'),
		},
		description: 'Select how to supply the face image to Base64.ai',
	},
	{
		displayName: 'Face URL',
		name: 'faceRecognitionDocumentUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...createDisplayOptions('recognizeFace'),
				faceRecognitionInputSource: ['url'],
			},
		},
		description: 'URL of the face image to recognize',
	},
	{
		displayName: 'Binary Property',
		name: 'faceRecognitionBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: {
				...createDisplayOptions('recognizeFace'),
				faceRecognitionInputSource: ['binary'],
			},
		},
		description: 'Binary property that contains the face image',
	},
];

const faceVerificationProperties: INodeProperties[] = [
	{
		displayName: 'Input Source',
		name: 'faceVerificationInputSource',
		type: 'options',
		options: inputSourceOptions,
		default: 'url',
		displayOptions: {
			show: createDisplayOptions('verifyFace'),
		},
		description: 'Select how to supply the face pair to Base64.ai',
	},
	{
		displayName: 'Face URL',
		name: 'faceVerificationDocumentUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...createDisplayOptions('verifyFace'),
				faceVerificationInputSource: ['url'],
			},
		},
		description: 'URL of the face you want to verify',
	},
	{
		displayName: 'Reference Face URL',
		name: 'faceVerificationQueryUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...createDisplayOptions('verifyFace'),
				faceVerificationInputSource: ['url'],
			},
		},
		description: 'URL of the reference face to compare against',
	},
	{
		displayName: 'Face Binary Property',
		name: 'faceVerificationBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'faceDocument',
		displayOptions: {
			show: {
				...createDisplayOptions('verifyFace'),
				faceVerificationInputSource: ['binary'],
			},
		},
		description: 'Binary property containing the face being verified',
	},
	{
		displayName: 'Reference Binary Property',
		name: 'faceVerificationQueryBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'referenceFace',
		displayOptions: {
			show: {
				...createDisplayOptions('verifyFace'),
				faceVerificationInputSource: ['binary'],
			},
		},
		description: 'Binary property containing the reference face',
	},
];

export const faceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['face'],
			},
		},
		options: [
			{
				name: 'Recognize Face',
				value: 'recognizeFace',
				action: 'Recognize a face',
				description: 'Recognize a face from a single image',
			},
			{
				name: 'Verify Face',
				value: 'verifyFace',
				action: 'Verify a face',
				description: 'Verify a face by comparing two images',
			},
		],
		default: 'recognizeFace',
	},
	...faceRecognitionProperties,
	...faceVerificationProperties,
];

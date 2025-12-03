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

const faceDetectionProperties: INodeProperties[] = [
	{
		displayName: 'Input Source',
		name: 'faceInputSource',
		type: 'options',
		options: inputSourceOptions,
		default: 'url',
		displayOptions: {
			show: createDisplayOptions('detectFace'),
		},
		description: 'Select how to supply the face image to Base64.ai',
	},
	{
		displayName: 'Face URL',
		name: 'faceDocumentUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...createDisplayOptions('detectFace'),
				faceInputSource: ['url'],
			},
		},
		description: 'URL of the image that contains the face to detect',
	},
	{
		displayName: 'Binary Property',
		name: 'faceBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: {
				...createDisplayOptions('detectFace'),
				faceInputSource: ['binary'],
			},
		},
		description: 'Binary property that contains the image to analyze',
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
		description: 'Select how to provide the target and reference face images',
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
		description: 'URL of the face you want to recognize',
	},
	{
		displayName: 'Reference Face URL',
		name: 'faceRecognitionQueryUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...createDisplayOptions('recognizeFace'),
				faceRecognitionInputSource: ['url'],
			},
		},
		description: 'URL of the reference face to compare against',
	},
	{
		displayName: 'Face Binary Property',
		name: 'faceRecognitionBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'faceDocument',
		displayOptions: {
			show: {
				...createDisplayOptions('recognizeFace'),
				faceRecognitionInputSource: ['binary'],
			},
		},
		description: 'Binary property containing the face being recognized',
	},
	{
		displayName: 'Reference Binary Property',
		name: 'faceRecognitionQueryBinaryPropertyName',
		type: 'string',
		required: true,
		default: 'referenceFace',
		displayOptions: {
			show: {
				...createDisplayOptions('recognizeFace'),
				faceRecognitionInputSource: ['binary'],
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
				name: 'Detect Face',
				value: 'detectFace',
				action: 'Detect face',
				description: 'Detect faces from an image',
			},
			{
				name: 'Recognize Face',
				value: 'recognizeFace',
				action: 'Recognize face',
				description: 'Match a face against a reference sample',
			},
		],
		default: 'detectFace',
	},
	...faceDetectionProperties,
	...faceRecognitionProperties,
];




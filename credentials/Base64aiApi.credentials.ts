import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Base64aiApi implements ICredentialType {
	name = 'base64aiApi';
	icon: Icon = { light: 'file:base64ai.svg', dark: 'file:base64ai.dark.svg' };

	displayName = 'Base64.ai API';

	// Link to your community node's README
	documentationUrl = 'https://github.com/Base64ai/n8n-nodes-base64ai#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			required: true,
			default: '',
		}
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=ApiKey {{$credentials.email}}:{{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.base64.ai',
			url: '/auth/user',
		},
	};
}

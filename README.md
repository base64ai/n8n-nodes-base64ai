# Base64.ai n8n Community Node

Use [Base64.ai](https://base64.ai) directly from your n8n workflows to automate document processing, identity verification, and biometric checks without writing glue code. This package exposes the public Base64.ai API as an installable community node.

> [n8n](https://n8n.io) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

1. Open your n8n instance and go to **Settings → Community Nodes**.
2. Click **Install**, enter `@base64ai/n8n-nodes-base64ai`, and confirm the warning.
3. Restart n8n if prompted.

Alternatively, install via command line inside your n8n deployment directory:

```bash
npm install @base64ai/n8n-nodes-base64ai
```

## Authentication

The node authenticates with your Base64.ai **email** and **API key**.

1. Sign in at [Base64.ai Console](https://app.base64.ai) and create an API key under **Settings → API Keys**.
2. Copy the email associated with your workspace (usually the same email you use to log in).
3. In n8n, create new credentials of type **Base64.ai API** and paste both values.

Credentials are transported over HTTPS and stored by n8n according to your instance configuration.

## Operations

| Resource | Operations | Description |
| --- | --- | --- |
| Document | Recognize Document, Recognize Document Async, Get Async Scan Result | Upload or link to a document and run a selected Base64.ai flow, either sync or async. |
| Signature | Recognize Signature, Verify Signature | Detect signatures on a single document or compare two signatures for verification. |
| Face | Recognize Face, Verify Face | Run biometric detection or compare two faces. |
| Flow | List Flows | Enumerate flows available to the authenticated workspace (used to populate dropdowns). |
| Result | Get Flow Results, Get Result By UUID | Fetch processed results in bulk or by UUID for downstream systems. |

Every operation returns the raw Base64.ai API payload so you can post-process it with native n8n nodes.

## Usage Notes

- **Input Source** – You can provide publicly accessible URLs or binary data from earlier nodes. When using binaries, ensure the previous node sets `data` (or customize the property name) and the binary data is not too large for your n8n instance.
- **Flows** – The Document and Result resources support selecting a flow from the Base64.ai API or entering an ID manually. Use manual entry for dynamic expressions or when the flow is newly created.
- **Asynchronous workloads** – Use **Document → Recognize Document Async** for multi-page or high-volume documents; store the returned UUID and poll with **Document → Get Async Scan Result** until the status becomes `done`.
- **Headers** – When you provide a Flow ID the node automatically adds the `base64ai-flow-id` header required by the API.

## Example Workflow

**Goal:** Recognize a document from a public URL and extract fields.

1. Add a **Manual Trigger** node.
2. Add **Base64 Document AI** and set:
   - **Resource**: Document
   - **Operation**: Recognize Document
   - **Input Source**: URL
   - **Document URL**: `https://example.com/sample-invoice.pdf`
   - **Flow**: Select a flow from the list (or enter a Flow ID manually)
3. Add a **Set** node to pick the fields you need from the response, for example:
   - `{{$json.fields.invoice_number.value}}`
   - `{{$json.fields.total.value}}`

This workflow will return the raw Base64.ai response and let you extract the fields you care about using native n8n nodes.

## Compatibility

- Tested with n8n `>= 1.60.0` running on Node.js `>= 18.17`.
- The codebase targets the latest n8n Node CLI (`@n8n/node-cli` v1) and TypeScript 5.9.
- All requests are made against the public `https://base64.ai/api` endpoint.

## Resources

- [Base64.ai](https://base64.ai/)
- [Base64.ai API Reference](https://apidoc.base64.ai/)
- [n8n Community Nodes guide](https://docs.n8n.io/integrations/community-nodes/installation/)
- Support: [support@base64.ai](mailto:support@base64.ai)

## Version History

- **1.0.0** – Current stable release. See [CHANGELOG.md](CHANGELOG.md) for full history.

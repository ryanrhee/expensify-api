import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import * as t from "io-ts";
import { BaseResponse } from './client';

export const CredentialsCoder = t.exact(t.type({
    partnerUserID: t.string,
    partnerUserSecret: t.string,
    email: t.string,
}));

export type Credentials = t.TypeOf<typeof CredentialsCoder>

const integrationURL: string =
    'https://integrations.expensify.com' +
    '/Integration-Server/ExpensifyIntegrations';

export class APIRequest<TReq, TResp extends BaseResponse> {
    credentials: Credentials;
    type: string;
    inputSettings: TReq;

    constructor(credentials: Credentials, type: string, inputSettings: TReq) {
        this.credentials = credentials;
        this.type = type;
        this.inputSettings = inputSettings;
    }

    async execute(): Promise<TResp> {
        const body = {
            type: this.type,
            credentials: this.credentials,
            inputSettings: this.inputSettings,
        };
        const requestBody = new URLSearchParams();
        requestBody.append('requestJobDescription', JSON.stringify(body));
        console.info('Request:');
        console.dir(body, { depth: null, colors: true });
        const response = await fetch(integrationURL, {
            method: 'POST',
            body: requestBody
        });

        if (!response.ok) {
            throw new Error(
                'HTTP status ' + response.status + ': ' + response.statusText);
        }
        // consider runtime-checking the JSON for conformance
        return await response.json() as TResp;
    }
}
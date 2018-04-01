// @flow strict

import fetch from 'node-fetch';

export type Credentials = {
    partnerUserID: string,
    partnerUserSecret: string
};

const url: string =
    'https://integrations.expensify.com' +
    '/Integration-Server/ExpensifyIntegrations';

class APIRequest<TReq, TResp> {
    credentials: Credentials;
    type: string;
    inputSettings: TReq;

    constructor(credentials: Credentials, type: string, inputSettings: TReq) {
        this.credentials = credentials;
        this.type = type;
        this.inputSettings = inputSettings;
    }

    async execute(): Promise<TResp> {
        const body = JSON.stringify({
            type: this.type,
            credentials: this.credentials,
            inputSettings: this.inputSettings,
        });

        const response = await fetch(url, {
            method: 'POST',
            body: 'requestJobDescription=' + body
        });

        if (!response.ok) {
            throw new Error(
                'HTTP status ' + response.status + ': ' + response.statusText);
        }
        let rawResponse = await response.json();
        return this.sanitizeResponse(rawResponse);
    }

    // This sanitization could be better.
    // If only we could utilize the flow types at runtime to validate ...
    sanitizeResponse(rawResponse: any): TResp {
        let responseObject: Object = rawResponse;
        const responseCode: number|typeof undefined
            = responseObject.responseCode;
        if (responseCode === undefined) {
            throw new Error('JSON response is missing key "responseCode"');
        } else {
            responseObject.isSuccess = responseCode === 200;
        }
        return (responseObject: any);
    }
}

export default APIRequest;
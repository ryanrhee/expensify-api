// @flow strict

import fetch from 'node-fetch';

export type Credentials = {
    partnerUserID: string,
    partnerUserSecret: string
};

const url: string =
    'https://integrations.expensify.com' +
    '/Integration-Server/ExpensifyIntegrations';

class APIClient {
    credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async _request<T>(type: string, inputSettings: Object): Promise<T> {
        const body = JSON.stringify({
            type: type,
            credentials: this.credentials,
            inputSettings: inputSettings,
        });

        return await fetch(url, {
            method: 'POST',
            body: 'requestJobDescription=' + body
        });
    }
}

module.exports = APIClient;
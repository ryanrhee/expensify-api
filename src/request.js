// @flow strict

import fetch from 'node-fetch';
import type {
    CreateReportRequest,
    CreateReportResponse,
    CreateReportFailure,
    CreateReportSuccess
} from './create-report-request';

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
        let rawResponse: Object = await response.json();
        const responseCode: number|typeof undefined = rawResponse.responseCode;
        if (responseCode === undefined) {
            throw new Error('JSON response is missing key "responseCode"');
        } else {
            rawResponse.isSuccess = responseCode === 200;
        }
        return (rawResponse: any);
    }
}

class APIClient {
    credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async createReport(title: string, email: string) {
        const requestBody: CreateReportRequest = {
            type: 'report',
            employeeEmail: email,
            report: {
                title: title,
            },
            expenses: [],
            policyID: '_REPLACE_',
        };
        const request: APIRequest<CreateReportRequest, CreateReportResponse> =
            new APIRequest(this.credentials, 'create', requestBody);
        const response = await request.execute();
        if (response.isSuccess) {
            return response.reportID;
        } else {
            throw new Error(
                'error code ' + response.responseCode + '; ' +
                response.responseMessage);
        }
    }
}

export default APIClient;
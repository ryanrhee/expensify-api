// @flow strict

import type { Credentials } from './request';
import APIRequest from './request';
import type {
    CreateReportRequest,
    CreateReportResponse,
    CreateReportFailure,
    CreateReportSuccess
} from './create-report-request';


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
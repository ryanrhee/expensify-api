import { Credentials } from './request';
import APIRequest from './request';
import {
    CreateReportRequest,
    CreateReportResponse,
    CreateReportFailure,
    CreateReportSuccess,
    isCreateReportSuccess
} from './types/create-report-types';
import {
    GetPolicyListRequest,
    GetPolicyListResponse,
    isGetPolicyListSuccess
} from './types/get-policy-list-types';


class APIClient {
    credentials: Credentials;
    policyID: string | undefined;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }

    async createReport(title: string, email: string): Promise<string> {
        const policyID = await this.getPolicyID();
        const requestBody: CreateReportRequest = {
            type: 'report',
            employeeEmail: email,
            report: {
                title: title,
            },
            expenses: [],
            policyID: policyID,
        };
        const request: APIRequest<CreateReportRequest, CreateReportResponse> =
            new APIRequest(this.credentials, 'create', requestBody);
        const response = await request.execute();
        if (isCreateReportSuccess(response)) {
            return response.reportID;
        } else {
            throw new Error(
                'error code ' + response.responseCode + '; ' +
                response.responseMessage);
        }
    }

    // Just get any policy ID and fill it in, I guess?
    async getPolicyID(): Promise<string> {
        if (this.policyID) {
            return this.policyID;
        }
        const requestBody: GetPolicyListRequest = {
            type: 'policyList',
        };
        const request: APIRequest<GetPolicyListRequest, GetPolicyListResponse> =
            new APIRequest(this.credentials, 'get', requestBody);
        const response = await request.execute();
        if (!isGetPolicyListSuccess(response)) {
            throw new Error(
                'error code ' + response.responseCode + '; ' +
                response.responseMessage);
        }
        const policies = response.policyList;
        if (policies.length <= 0) {
            throw new Error('There are no policies on the account');
        }

        console.info('there are ' + policies.length + ' policies');
        this.policyID = policies[0].id;
        return this.policyID;
    }
}

export default APIClient;
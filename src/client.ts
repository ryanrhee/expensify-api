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
    policyID: string;

    // typescript doesn't support `this` as a type on static functions.
    // https://github.com/Microsoft/TypeScript/issues/5863
    static async newClient(credentials: Credentials): Promise<APIClient> {
        const policyID = await this.getPolicyID(credentials);
        return new APIClient(credentials, policyID);
    }

    private constructor(credentials: Credentials, policyID: string) {
        this.credentials = credentials;
        this.policyID = policyID;
    }

    async createReport(title: string, email: string): Promise<string> {
        const requestBody: CreateReportRequest = {
            type: 'report',
            employeeEmail: email,
            report: {
                title: title,
            },
            expenses: [],
            policyID: this.policyID,
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
    private static async getPolicyID(
        credentials: Credentials,
    ): Promise<string> {
        const requestBody: GetPolicyListRequest = {
            type: 'policyList',
        };
        const request: APIRequest<GetPolicyListRequest, GetPolicyListResponse> =
            new APIRequest(credentials, 'get', requestBody);
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

        if (policies.length > 1) {
            console.warn(
                'there are ' + policies.length + ' policies. defaulting to ' +
                'the first one');
        }
        return policies[0].id;
    }
}

export default APIClient;
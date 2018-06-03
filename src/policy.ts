import { APIRequest, Credentials } from './request'
import { BaseCreateRequest, BaseResponse, FailureResponse } from './client'

interface GetPolicyListRequest {
    type: 'policyList';
    adminOnly?: boolean;
    userEmail?: string;
};

interface Policy {
    // 3 char
    outputCurrency: string;

    // email
    owner: string;

    // e.g. 'user', 'auditor', 'admin'
    role: string;

    // policy name
    name: string;

    // policy ID
    id: string;

    // e.g. 'corporate'
    type: string;
}

interface GetPolicyListSuccess extends BaseResponse {
    policyList: Array<Policy>;
    responseCode: 200;
};

type GetPolicyListResponse = GetPolicyListSuccess | FailureResponse;

function isGetPolicyListSuccess(
    response: GetPolicyListResponse,
): response is GetPolicyListSuccess {
    return response.responseCode == 200;
}

export async function getPolicyID(
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
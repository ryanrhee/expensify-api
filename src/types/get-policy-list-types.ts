export interface GetPolicyListRequest {
    type: 'policyList';
    adminOnly?: boolean;
    userEmail?: string;
};

export interface Policy {
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

export interface GetPolicyListSuccess extends BaseResponse {
    policyList: Array<Policy>;
    responseCode: 200;
};

export interface GetPolicyListFailure extends BaseResponse {
    responseMessage: string;
    responseCode: number;
};

export type GetPolicyListResponse = GetPolicyListSuccess | GetPolicyListFailure;

export function isGetPolicyListSuccess(
    response: GetPolicyListResponse,
): response is GetPolicyListSuccess {
    return (<GetPolicyListSuccess>response).responseCode === 200;
}
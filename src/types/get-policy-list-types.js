// @flow strict

export type GetPolicyListRequest = {
    type: 'policyList';
    adminOnly?: boolean;
    userEmail?: string;
};

type Policy = {
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

type GetPolicyListSuccess = {
    policyList: Array<Policy>;
    responseCode: 200;
    isSuccess: true;
};

type GetPolicyListFailure = {
    responseMessage: string;
    responseCode: number;
    isSuccess: false;
};

export type GetPolicyListResponse = GetPolicyListSuccess | GetPolicyListFailure;
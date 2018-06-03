import { APIRequest, Credentials } from './request';
import { Report } from './report';
import { getPolicyID } from './policy';


export interface BaseCreateRequest {
    type: string;
    employeeEmail: string;
}

export interface BaseResponse {
    responseCode: number;
}

export interface FailureResponse extends BaseResponse {
    responseMessage: string;
}

export class APIClient {
    credentials: Credentials;
    policyID: string;
    baseCreateRequest: BaseCreateRequest;

    // typescript doesn't support `this` as a type on static functions.
    // https://github.com/Microsoft/TypeScript/issues/5863
    static async newClient(
        credentials: Credentials,
    ): Promise<APIClient> {
        const policyID = await getPolicyID(credentials);
        return new APIClient(credentials, policyID);
    }

    private constructor(
        credentials: Credentials,
        policyID: string,
    ) {
        this.credentials = credentials;
        this.policyID = policyID;
        this.baseCreateRequest = {
            type: '<unknown>',
            employeeEmail: credentials.email,
        };
    }

    async createReport(title: string): Promise<Report> {
        return await Report.create(title, this);
    }
}
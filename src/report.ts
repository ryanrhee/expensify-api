import { basename } from 'path';
import { APIRequest } from './request';
import {
    APIClient,
    BaseCreateRequest,
    BaseResponse,
    FailureResponse,
} from './client';

interface ReportIn {
    title: string;

    // Values for custom fields on the specified policyID.
    //
    // A series of JSON objects whose key is the name of the report field to
    // modify, and the value is the value to set. The key needs to have all
    // non-alphanumerical characters replaced with underscores (_).
    fields?: {[key: string]: string};
};

interface ReportInExpense {
    merchant: string;

    // The currency in which the transaction was made.
    //
    //	Three-letter currency code of the transaction.
    currency: string;

    // The date the expense was made.
    //
    // yyyy-mm-dd formatted date
    date: Date;

    // The amount of the transaction, in cents.
    //
    // "Integer"
    amount: number;
};

interface CreateReportRequest extends BaseCreateRequest {
    type: 'report';
    report: ReportIn;
    expenses: ReportInExpense[];
    policyID: string;
};

interface CreateReportSuccess extends BaseResponse {
    responseCode: 200;
    reportName: string;
    reportID: string;
}

type CreateReportResponse = CreateReportSuccess | FailureResponse

function isCreateReportSuccess(
    response: CreateReportResponse
): response is CreateReportSuccess {
    return response.responseCode === 200;
}

export class Report {
    title: string;
    id: string;

    private constructor(req: CreateReportRequest, res: CreateReportSuccess) {
        this.title = req.report.title;
        this.id = res.reportID;
    }

    static async create(
        title: string,
        client: APIClient,
    ): Promise<Report> {
        const requestBody: CreateReportRequest = {
            ...client.baseCreateRequest,
            type: 'report',
            report: {
                title: title,
            },
            expenses: [],
            policyID: client.policyID,
        };
        const request: APIRequest<CreateReportRequest, CreateReportResponse> =
            new APIRequest(client.credentials, 'create', requestBody);
        const response = await request.execute();
        if (!isCreateReportSuccess(response)) {
            throw new Error(
                'error code ' + response.responseCode + '; ' +
                response.responseMessage);
        }
    
        return new Report(requestBody, response);
    }
}
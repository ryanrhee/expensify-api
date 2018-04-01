// @flow strict

type Report = {
    title: string;

    // Values for custom fields on the specified policyID.
    //
    // A series of JSON objects whose key is the name of the report field to
    // modify, and the value is the value to set. The key needs to have all
    // non-alphanumerical characters replaced with underscores (_).
    fields?: {[string]: string};
};

type Expense = {
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

export type CreateReportRequest = {
    type: 'report';
    employeeEmail: string;
    report: Report;
    expenses: Array<Expense>;
    policyID: string;
};

export type CreateReportSuccess = {
    isSuccess: true,
    responseCode: 200,
    reportName: string,
    reportID: string,
}

export type CreateReportFailure = {
    isSuccess: false,
    responseCode: number,
    responseMessage: string,
}

export type CreateReportResponse = CreateReportSuccess | CreateReportFailure;
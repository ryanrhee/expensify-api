import * as t from "io-ts";
import puppeteer from 'puppeteer';
import { APIRequest } from './request';
import { Report } from './report';
import { getPolicyID } from './policy';
import { createExpense, ExpenseMetadata } from './expense';


export const CredentialsCoder = t.exact(t.type({
    partnerUserID: t.string,
    partnerUserSecret: t.string,
    email: t.string,
    password: t.string,
}));

export type Credentials = t.TypeOf<typeof CredentialsCoder>

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
    browser: puppeteer.Browser;
    page: puppeteer.Page;

    // typescript doesn't support `this` as a type on static functions.
    // https://github.com/Microsoft/TypeScript/issues/5863
    static async newClient(
        credentials: Credentials,
        options: { headless: boolean },
    ): Promise<APIClient> {
        const policyID = await getPolicyID(credentials);
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        return new APIClient(credentials, policyID, browser, page);
    }

    private constructor(
        credentials: Credentials,
        policyID: string,
        browser: puppeteer.Browser,
        page: puppeteer.Page,    
    ) {
        this.credentials = credentials;
        this.policyID = policyID;
        this.baseCreateRequest = {
            type: '<unknown>',
            employeeEmail: credentials.email,
        };
        this.browser = browser;
        this.page = page;
    }

    async createReport(title: string): Promise<Report> {
        return await Report.create(title, this);
    }

    async createExpense(
        report: Report,
        metadata: ExpenseMetadata,
    ): Promise<void> {
        return await createExpense(report, metadata, this);
    }

    async submitReport(report: Report): Promise<void> {
        return await report.submit(this);
    }

    // TODO: try to avoid this
    sleep(sec: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }
}
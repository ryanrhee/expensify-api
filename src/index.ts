import { Credentials } from './request';
import ExpensifyReport from './report';
import APIClient from './client';

class Expensify {
    client: APIClient;
    credentials: Credentials;

    constructor(credentials: Credentials) {
        this.client = new APIClient(credentials);
        this.credentials = credentials;
    }

    async createReport(
        title: string,
        emailOverride?: string,
    ): Promise<ExpensifyReport> {
        const email = emailOverride || this.credentials.email;
        const id = await this.client.createReport(title, email);
        return new ExpensifyReport({
            id: id,
            title: title,
            email: email,
        })
    }

    // Used only for testing
    async getPolicyID(): Promise<string> {
        return await this.client.getPolicyID();
    }
}

export default Expensify;
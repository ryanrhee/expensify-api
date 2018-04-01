// @flow strict

type ExpensifyReportInit = {
    title: string;
    email: string;
    id: string;
}

class ExpensifyReport {
    title: string;
    email: string;
    id: string;

    constructor(params: ExpensifyReportInit) {
        this.id = params.id;
        this.title = params.title;
        this.email = params.email;
    }
}

export default ExpensifyReport;
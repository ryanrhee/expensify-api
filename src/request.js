// @flow strict

export type Credentials = {
    partnerUserID: string,
    partnerUserSecret: string
};

const endpoint: string =
    'https://integrations.expensify.com' +
    '/Integration-Server/ExpensifyIntegrations';

class Request {
    type: string;
    credentials: Credentials;
    inputSettings: Object;

    constructor(type: string, credentials: Credentials, inputSettings: Object) {
        this.type = type;
        this.credentials = credentials;
        this.inputSettings = inputSettings;
    }
}

module.exports = Request;
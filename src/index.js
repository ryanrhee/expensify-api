// @flow

const fetch = require("node-fetch");

type Credentials = {
    partnerUserID: string,
    partnerUserSecret: string
};

class Expensify {
    credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }
}

module.exports = Expensify;
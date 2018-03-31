// @flow strict

import type Credentials from 'request';

class Expensify {
    credentials: Credentials;

    constructor(credentials: Credentials) {
        this.credentials = credentials;
    }
}

module.exports = Expensify;
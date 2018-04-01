// @flow strict

import type { Credentials } from './request';
import APIClient from './client';

class Expensify {
    client: APIClient;

    constructor(credentials: Credentials) {
        this.client = new APIClient(credentials);
    }
}

module.exports = Expensify;
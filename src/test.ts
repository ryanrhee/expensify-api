// This is not a unit test or an integration test.
// It just executes the code path and prints results.
// Modifications will work without warning.

import Expensify from './index';

import fs from 'mz/fs';
import path from 'path';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { Credentials, CredentialsCoder } from './request';

const getEmail = () => {
    const key = 'EXPENSIFY_EMAIL';
    if (!(key in process.env)) {
        throw new Error('Missing env var ' + key);
    }

    return process.env[key];
}

(async () => {
    const credentials = CredentialsCoder.decode(
        {
            email: getEmail(),
            ...JSON.parse(
                await fs.readFile(
                    path.join(__dirname, '../credentials.json'),
                    "utf-8",
                )
            )
        }
    );
    if (!CredentialsCoder.is(credentials.value)) {
        throw PathReporter.report(credentials).join("\n");
    }
    const e = await Expensify.newClient(credentials.value);
    const policyID = await e.policyID;
    console.info('policy ID: ' + policyID);
})()
.then(() => {
    console.info('done');
})
.catch((e) => {
    console.error('Error: ' + e);
});
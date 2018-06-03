// This is not a unit test or an integration test.
// It just executes the code path and prints results.
// Modifications will work without warning.

import Expensify from './index';

import fs from 'mz/fs';
import path from 'path';
import { Credentials } from './request';

(async () => {
    const credentials = JSON.parse(
        await fs.readFile(path.join(__dirname, '../credentials.json'), "utf-8")
    ) as Credentials;
    const e = await Expensify.newClient(credentials);
    const policyID = await e.policyID;
    console.info('policy ID: ' + policyID);
})()
.then(() => {
    console.info('done');
})
.catch((e) => {
    console.error(e);
});
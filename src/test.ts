// This is not a unit test or an integration test.
// It just executes the code path and prints results.
// Modifications will work without warning.

import Expensify from './index';

import fs from 'mz/fs';
import path from 'path';

(async () => {
    const credentials = JSON.parse(
        await fs.readFile(path.join(__dirname, '../credentials.json'), "utf-8")
    );
    const e = new Expensify(credentials);
    const policyID = await e.getPolicyID();
    console.info('policy ID: ' + policyID);
})()
.then(() => {
    console.info('done');
})
.catch((e) => {
    console.error(e);
});
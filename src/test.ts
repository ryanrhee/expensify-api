// This is not a unit test or an integration test.
// It just executes the code path and prints results.
// Modifications will work without warning.

import Expensify from './index';

import fs from 'mz/fs';
import path from 'path';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { CredentialsCoder } from './client';

(async () => {
    const credentials = CredentialsCoder.decode(
        JSON.parse(
            await fs.readFile(
                path.join(__dirname, '../credentials.json'),
                "utf-8",
            )
        )
    );
    if (!CredentialsCoder.is(credentials.value)) {
        throw PathReporter.report(credentials).join("\n");
    }
    const c = await Expensify.newClient(credentials.value, { headless: false });
    const r = await c.createReport('Test Report');
    await c.createExpense(r, {
        'merchant': 'test merchant',
        'amount': 15,
        'date': '2018-06-01',
        'receiptPath': './sample_receipt.png',
        'category': 'Cell Phone',
        'department': 'Engineering',
        'comment': 'test comment',
    });
    await c.submitReport(r);
})()
.then(() => {
    console.info('done');
})
.catch((e) => {
    console.error('Error: ' + e);
});
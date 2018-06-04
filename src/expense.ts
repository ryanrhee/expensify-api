import puppeteer from 'puppeteer';
import fs from 'mz/fs';
import { URLSearchParams, URL } from 'url';
import { Credentials, APIClient } from './client';
import { Report } from './report';

const expensifyCookiesFile = __dirname + '/../expensifyCookies.json';

export interface ExpenseMetadata {
    merchant: string;
    amount: number;
    date: string; // yyyy-mm-dd
    receiptPath: string;
    category: string;
    department: string;
    comment: string;
}

export const createExpense = async (
    report: Report,
    metadata: ExpenseMetadata,
    client: APIClient,
): Promise<void> => {
    if (await fs.exists(expensifyCookiesFile)) {
        const cookiesJSON = await fs.readFile(expensifyCookiesFile, 'utf-8');
        client.page.setCookie(...JSON.parse(cookiesJSON));
    }
    await createExpenseImpl(
        report,
        metadata,
        client,
    );
}

const createExpenseImpl = async (
    report: Report,
    metadata: ExpenseMetadata,
    client: APIClient,
) => {
    const page = client.page;
    const credentials = client.credentials;

    await page.goto(report.url().toString(), {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    });

    if (isLoginPage(page)) {
        await login(page, credentials);
    }
    
    await addExpense(metadata, client);
};

const isLoginPage = (page: puppeteer.Page): boolean => {
    const url = new URL(page.url());
    return url.pathname === '/signin'
};

const query = async (
    page: puppeteer.Page,
    selector: string,
): Promise<puppeteer.ElementHandle> => {
    const result = await page.$(selector);
    if (!result) {
        throw new Error('Failed to find element for selector ' + selector);
    }

    return result;
}

const login = async (
    page: puppeteer.Page,
    credentials: Credentials,
): Promise<void> => {
    const emailField = await query(page, '#signinemail');
    const email = await page.evaluate(((elem) => elem.value), emailField);
    if (!email) {
        await emailField.type(credentials.email);
    }

    const passwordField = await query(page, '#signinpassword');
    await passwordField.type(credentials.password);

    await page.click('#signinbutton');
    await page.waitForNavigation({
        'waitUntil': ['domcontentloaded', 'networkidle0']
    });

    const cookies = await page.cookies();
    await fs.writeFile(expensifyCookiesFile, JSON.stringify(cookies));
}

const clearElement = async (
    page: puppeteer.Page,
    elem: puppeteer.ElementHandle,
): Promise<void> => {
    await page.evaluate((elem) => elem.value = '', elem);
}

const addExpense = async (
    metadata: ExpenseMetadata,
    client: APIClient,
): Promise<void> => {
    const page = client.page;
    page.click('.button_addExpenses');
    const buttonSelector = '.modal-dialog .btn-success-outline';
    await page.waitForSelector(buttonSelector);
    page.click(buttonSelector);

    const selectorForName = (name: string) => {
        return '#newExpense3_expenseForm ' + name
    };

    // TDOO: use mutation observer and wait until X secs pass with no mutations
    await client.sleep(1);

    const setField = async (
        name: string,
        value: string,
        options?: { autoComplete?: boolean }
    ): Promise<void> => {
        const field = await query(page, selectorForName(name));
        await clearElement(page, field);
        await field.type(value);
        if (options && options.autoComplete) {
            field.press('Enter');
        }
    }

    await setField('input[name="merchant"]', metadata.merchant);
    await setField('input[name="created"]', metadata.date);
    await setField(
        '#newExpense3_oneExpense_amount',
        metadata.amount.toString(),
    );
    await setField(
        'select[name="category"] + * input',
        metadata.category,
        { autoComplete: true },
    );
    await setField(
        'select[name="tag"] + * input',
        metadata.department,
        { autoComplete: true },
    );
    await setField('input[name="comment"]', metadata.comment);

    await page.click('#newExpense3_panes .receiptContainer');
    // TODO: find better signal
    await client.sleep(2);
    const uploadButton = await query(
        page,
        'input[type="file"][name="expense_attach"]',
    );
    uploadButton.uploadFile(metadata.receiptPath);

    // wait for upload to finish
    await page.waitForXPath(
        '//div[contains(@class, "jGrowl-message") and ' +
        'text()[contains(., "1 receipt uploaded")]]');

    // TODO: find better signal
    await client.sleep(5);

    await page.click('.js_save.expenseFormSave');

    // TODO: find better signal
    await client.sleep(5);
    console.log('navigation finished');
}
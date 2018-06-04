import puppeteer from 'puppeteer';
import fs from 'mz/fs';
import { URLSearchParams, URL } from 'url';
import { Credentials } from './client';

// only for debugging
function sleep(sec: number) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

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
    reportID: string,
    metadata: ExpenseMetadata,
    credentials: Credentials,
): Promise<void> => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    if (await fs.exists(expensifyCookiesFile)) {
        const cookiesJSON = await fs.readFile(expensifyCookiesFile, 'utf-8');
        page.setCookie(...JSON.parse(cookiesJSON));
    }
    try {
        await createExpenseImpl(reportID, metadata, page, credentials);
    } finally {
        await sleep(300);
        page.close();
        browser.close();
    }
}

const createExpenseImpl = async (
    reportID: string,
    metadata: ExpenseMetadata,
    page: puppeteer.Page,
    credentials: Credentials,
) => {
    let url = new URL('https://www.expensify.com/report');
    url.search = new URLSearchParams({
        'param': JSON.stringify({
            'pageReportID': reportID,
            'keepCollection': 'true', // not sure what this is
        }),
    }).toString();
    await page.goto(url.toString(), {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    });

    if (isLoginPage(page)) {
        await login(page, credentials);
    }
    
    await addExpense(metadata, page);
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
    page: puppeteer.Page,
): Promise<void> => {
    page.click('.button_addExpenses');
    const buttonSelector = '.modal-dialog .btn-success-outline';
    await page.waitForSelector(buttonSelector);
    page.click(buttonSelector);

    const selectorForName = (name: string) => {
        return '#newExpense3_expenseForm ' + name
    };

    // TDOO: use mutation observer and wait until X secs pass with no mutations
    await sleep(1);

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
    await sleep(2);
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
    await sleep(5);

    await page.click('.js_save.expenseFormSave');
}
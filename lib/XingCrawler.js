const puppeteer = require('puppeteer');

module.exports = class XingCrawler {
    constructor() {
        this.browser = puppeteer.launch({ headless: false });
        this.page = this.browser.then(browser => browser.newPage());
    }

    async signIn() {
        console.log('Signing in...');
        await this.page.then(page => page.goto('https://www.xing.com'));
        const userInputSelector = 'input[name="login_form[username]"]';
        const passInputSelector = 'input[name="login_form[password]"]';
        await this.page.then(page => page.waitForSelector(passInputSelector));
        await this.page.then(page => page.type(userInputSelector, process.env.USER_EMAIL));
        const passwordField = await this.page.then(page => page.$(passInputSelector));
        await passwordField.type(process.env.USER_PASSWORD);
        await passwordField.press('Enter');
        console.log('Signed In');
    }

    visitRequestsPage() {
        return this.page;
    }

    acceptPendingRequests() {
        return this.page;
    }

    finish() {
        return this.browser.then(browser => browser.close());
    }
};

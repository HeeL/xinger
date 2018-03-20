const puppeteer = require('puppeteer');

module.exports = class XingCrawler {
    async init() {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
    }

    async signIn() {
        console.log('Signing in...');
        await this.page.goto('https://www.xing.com');
        const userInputSelector = 'input[name="login_form[username]"]';
        const passInputSelector = 'input[name="login_form[password]"]';
        await this.page.waitForSelector(passInputSelector);
        await this.page.type(userInputSelector, process.env.USER_EMAIL);
        const passwordField = await this.page.$(passInputSelector);
        await passwordField.type(process.env.USER_PASSWORD);
        await passwordField.press('Enter');
        await this.page.waitForSelector('.myxing-profile');
        console.log('Signed In');
    }

    async visitRequestsPage() {
        console.log('Visiting requests page');
        await this.page.goto('https://www.xing.com/app/contact?op=toconfirm');
    }

    acceptPendingRequests() {
        console.log('Accepting requests');
        return this.page;
    }

    finish() {
        return this.browser.close();
    }
};

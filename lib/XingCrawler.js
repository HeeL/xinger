const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const extractProfileId = contact => contact.find('>a').attr('href').match(/profile\/(.+)\//)[1];

const nextLinkSelector = '.foundation-icon-shape-arrow-right';

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

    async visitGroupPageProfiles(groupName) {
        console.log('Visiting group page');
        await this.page.goto(`https://www.xing.com/communities/groups/${groupName}/member_states`);
    }

    async parsePremiumProfiles() {
        const content = await this.page.content();
        const select = cheerio.load(content);

        return select('.contact')
            .has('.user-name-premium')
            .map((i, contact) => extractProfileId(select(contact)))
            .get();
    }

    async nextPageExists() {
        const link = await this.page.$(nextLinkSelector);
        return Boolean(link);
    }

    async visitNextPage() {
        const link = await this.page.$(nextLinkSelector);
        await link.click();
        await this.page.waitForNavigation();
    }

    async acceptPendingRequests() {
        await this.visitRequestsPage();
        console.log('Accepting requests');
        const acceptLinkSelector = '.icn-ext-ctr-con-add';
        const acceptLinkElement = await this.page.$(acceptLinkSelector);
        if (!acceptLinkElement) {
            console.log('Nothing to accept');
            return;
        }
        await acceptLinkElement.click();
        const acceptButtonSelector = '#crl-button-send-request a';
        await this.page.waitForSelector(acceptButtonSelector);
        const acceptButtonElement = await this.page.$(acceptButtonSelector);
        await acceptButtonElement.click();
        await this.page.waitFor(3000);
        console.log('Request accepted');
        this.acceptPendingRequests();
    }

    finish() {
        return this.browser.close();
    }
};

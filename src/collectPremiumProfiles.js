const collectProfilesFromPage = async (crawler, createProfiles) => {
    const profilesList = await crawler.parsePremiumProfiles();
    createProfiles(profilesList);
    const nextPageExists = await crawler.nextPageExists();
    if (nextPageExists) {
        await crawler.visitNextPage();
        collectProfilesFromPage(crawler, createProfiles);
    }
};

module.exports = async (XingCrawler, createProfiles) => {
    console.log('Start collecting requests');
    const crawler = new XingCrawler({ headless: false });

    await crawler.init();
    await crawler.signIn();
    await crawler.visitGroupPageProfiles('muenchen-xing-ambassador-community-d6b8-1071145');
    await collectProfilesFromPage(crawler, createProfiles);
    await crawler.finish();
};

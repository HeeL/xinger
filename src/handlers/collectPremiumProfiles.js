const collectProfilesFromPage = async (crawler, createProfiles) => {
    const profilesList = await crawler.parsePremiumProfiles();
    createProfiles(profilesList);
    const nextPageExists = await crawler.nextPageExists();
    if (nextPageExists) {
        await crawler.visitNextPage();
        await collectProfilesFromPage(crawler, createProfiles);
    }
};

module.exports = async (XingCrawler, createProfiles) => {
    console.log('Start collecting requests');
    const crawler = new XingCrawler({ headless: false });

    await crawler.init();
    await crawler.signIn();
    await crawler.visitGroupPageProfiles('it-und-data-xing-ambassador-community-500b-1071386');
    await collectProfilesFromPage(crawler, createProfiles);
    await crawler.finish();
};

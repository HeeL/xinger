module.exports = async (XingCrawler) => {
    console.log('Starting accepting requests');
    const crawler = new XingCrawler({ headless: false });

    await crawler.init();
    await crawler.signIn();
    await crawler.acceptPendingRequests();
    await crawler.finish();
};

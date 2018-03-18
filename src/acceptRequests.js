module.exports = async (XingCrawler) => {
    console.log('Starting accepting requests');
    const crawler = new XingCrawler({ headless: false });

    crawler.signIn();
    crawler.visitRequestsPage();
    crawler.acceptPendingRequests();
};

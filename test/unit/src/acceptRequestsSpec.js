import test from 'ava';
import sinon from 'sinon';
import acceptRequests from '../../../src/acceptRequests';

const createXingCrawlerStub = (
    signIn = () => {},
    visitRequestsPage = () => {},
    acceptPendingRequests = () => {}
) => sinon.stub().returns({
    signIn,
    visitRequestsPage,
    acceptPendingRequests
});
sinon.stub(console, 'log');

test('instantiates injected class', t => {
    const xingCrawlerStub = createXingCrawlerStub();

    acceptRequests(xingCrawlerStub);
    t.true(xingCrawlerStub.calledWithNew());
});

test('signs in', t => {
    const signInSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub(signInSpy);
    acceptRequests(xingCrawlerStub);

    t.true(signInSpy.calledOnce);
});

test('visits requests page after sign in', t => {
    const signInSpy = sinon.spy();
    const visitRequestsPageSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub(signInSpy, visitRequestsPageSpy);
    acceptRequests(xingCrawlerStub);

    t.true(visitRequestsPageSpy.calledOnce);
    t.true(visitRequestsPageSpy.calledImmediatelyAfter(signInSpy));
});

test('accepts requests after navigating on requests page', t => {
    const visitRequestsPageSpy = sinon.spy();
    const acceptPendingRequestsSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub(
        undefined,
        visitRequestsPageSpy,
        acceptPendingRequestsSpy
    );
    acceptRequests(xingCrawlerStub);

    t.true(acceptPendingRequestsSpy.calledOnce);
    t.true(acceptPendingRequestsSpy.calledImmediatelyAfter(visitRequestsPageSpy));
});

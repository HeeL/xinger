import test from 'ava';
import sinon from 'sinon';
import acceptRequests from '../../../../src/handlers/acceptRequests';

const createXingCrawlerStub = (
    init = () => {},
    signIn = () => {},
    acceptPendingRequests = () => {},
    finish = () => {}
) => sinon.stub().returns({
    init,
    signIn,
    acceptPendingRequests,
    finish
});
sinon.stub(console, 'log');

test('instantiates injected class', async t => {
    const xingCrawlerStub = createXingCrawlerStub();

    await acceptRequests(xingCrawlerStub);
    t.true(xingCrawlerStub.calledWithNew());
});

test('init', async t => {
    const initSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub(initSpy);
    await acceptRequests(xingCrawlerStub);

    t.true(initSpy.calledOnce);
});

test('signs in after initialization', async t => {
    const signInSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub(undefined, signInSpy);
    await acceptRequests(xingCrawlerStub);

    t.true(signInSpy.calledOnce);
});

test('accepts requests after sign In', async t => {
    const signInSpy = sinon.spy();
    const acceptPendingRequestsSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub(
        undefined,
        signInSpy,
        acceptPendingRequestsSpy
    );
    await acceptRequests(xingCrawlerStub);

    t.true(acceptPendingRequestsSpy.calledOnce);
    t.true(acceptPendingRequestsSpy.calledImmediatelyAfter(signInSpy));
});

test('calls finish() after accepting requests', async t => {
    const acceptPendingRequestsSpy = sinon.spy();
    const finishSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub(
        undefined,
        undefined,
        acceptPendingRequestsSpy,
        finishSpy
    );
    await acceptRequests(xingCrawlerStub);

    t.true(finishSpy.calledOnce);
    t.true(finishSpy.calledImmediatelyAfter(acceptPendingRequestsSpy));
});

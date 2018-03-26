import test from 'ava';
import sinon from 'sinon';
import collectPremiumProfiles from '../../../../src/handlers/collectPremiumProfiles';

const createXingCrawlerStub = (spies = {}) => sinon.stub().returns({
    init: spies.init || (() => {}),
    signIn: spies.signIn || (() => {}),
    visitGroupPageProfiles: spies.visitGroupPageProfiles || (() => {}),
    parsePremiumProfiles: spies.parsePremiumProfiles || (() => {}),
    nextPageExists: spies.nextPageExists || (() => {}),
    visitNextPage: spies.visitNextPage || (() => {}),
    acceptPendingRequests: spies.acceptPendingRequests || (() => {}),
    finish: spies.finish || (() => {})
});

sinon.stub(console, 'log');

test('init', async t => {
    const initSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub({ init: initSpy });
    await collectPremiumProfiles(xingCrawlerStub, () => {});

    t.true(initSpy.calledOnce);
});

test('signs in after initialization', async t => {
    const signInSpy = sinon.spy();
    const initSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub({
        init: initSpy,
        signIn: signInSpy
    });
    await collectPremiumProfiles(xingCrawlerStub, () => {});

    t.true(signInSpy.calledOnce);
});

test('visits group page after sign in', async t => {
    const signInSpy = sinon.spy();
    const visitSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub({
        signIn: signInSpy,
        visitGroupPageProfiles: visitSpy
    });
    await collectPremiumProfiles(xingCrawlerStub, () => {});

    t.true(visitSpy.calledOnce);
    t.true(visitSpy.calledImmediatelyAfter(signInSpy));
});

test('parses premium profiles after visiting group page', async t => {
    const visitSpy = sinon.spy();
    const parseSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub({
        visitGroupPageProfiles: visitSpy,
        parsePremiumProfiles: parseSpy
    });
    await collectPremiumProfiles(xingCrawlerStub, () => {});

    t.true(parseSpy.calledOnce);
    t.true(parseSpy.calledImmediatelyAfter(visitSpy));
});

test('creates profiles with parsed data', async t => {
    const createProfilesSpy = sinon.spy();
    const parsedResult = ['foo', 'bar'];
    const parseStub = sinon.stub().returns(parsedResult);
    const xingCrawlerStub = createXingCrawlerStub({ parsePremiumProfiles: parseStub });
    await collectPremiumProfiles(xingCrawlerStub, createProfilesSpy);

    t.true(createProfilesSpy.calledOnce);
    t.true(createProfilesSpy.calledWith(parsedResult));
});

test('calls finish after creating profiles', async t => {
    const finishSpy = sinon.spy();
    const createProfilesSpy = sinon.spy();
    const xingCrawlerStub = createXingCrawlerStub({ finish: finishSpy });
    await collectPremiumProfiles(xingCrawlerStub, createProfilesSpy);

    t.true(finishSpy.calledOnce);
    t.true(finishSpy.calledAfter(createProfilesSpy));
});

test('visit next page as long as it exists', async t => {
    const visitNextPageSpy = sinon.spy();
    const nextPageExistsStub = sinon.stub()
        .onFirstCall().returns(true)
        .onSecondCall().returns(true) // eslint-disable-line newline-per-chained-call
        .onThirdCall().returns(false); // eslint-disable-line newline-per-chained-call
    const xingCrawlerStub = createXingCrawlerStub({
        visitNextPage: visitNextPageSpy,
        nextPageExists: nextPageExistsStub
    });
    await collectPremiumProfiles(xingCrawlerStub, () => {});

    t.true(visitNextPageSpy.calledTwice);
});

test('does not visit next page if it does not exist', async t => {
    const visitNextPageSpy = sinon.spy();
    const nextPageExistsStub = sinon.stub().returns(false);
    const xingCrawlerStub = createXingCrawlerStub({
        visitNextPage: visitNextPageSpy,
        nextPageExists: nextPageExistsStub
    });
    await collectPremiumProfiles(xingCrawlerStub, () => {});

    t.true(visitNextPageSpy.notCalled);
});

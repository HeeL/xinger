#!/usr/bin/env node

const cli = require('cli');
const R = require('ramda');
const acceptRequests = require('../src/handlers/acceptRequests');
const collectProfiles = require('../src/handlers/collectPremiumProfiles');
const XingCrawler = require('../lib/XingCrawler');
const createProfiles = require('../src/profile/createProfiles');
require('dotenv').config();

const cliOptions = {
    accept: ['a', 'Accept all incoming contact requests'],
    collect: ['c', 'Collect and persist premium profiles']
};

const optionFunctions = {
    accept: acceptRequests.bind(null, XingCrawler),
    collect: collectProfiles.bind(null, XingCrawler, createProfiles),
};

const filterSelectedOptions = R.compose(
    R.keys,
    R.filter(R.equals(true))
);

const pickHandlersForOptions = R.compose(
    R.values,
    R.flip(R.pickAll)(optionFunctions),
);

R.pipe(
    cli.parse,
    filterSelectedOptions,
    pickHandlersForOptions,
    R.map(R.call)
)(cliOptions);

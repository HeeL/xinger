#!/usr/bin/env node

const cli = require('cli');
const R = require('ramda');
const acceptRequests = require('../src/acceptRequests');
const collectProfiles = require('../src/collectPremiumProfiles');
const XingCrawler = require('../lib/XingCrawler');
const createProfiles = require('../src/createProfiles');
require('dotenv').config();

const cliOptions = {
    accept: ['a', 'Accept all incoming contact requests'],
    collect: ['c', 'Collect and persist premium profiles']
};
const optionFunctions = {
    accept: acceptRequests.bind(null, XingCrawler),
    collect: collectProfiles.bind(null, XingCrawler, createProfiles),
};

R.pipe(
    cli.parse,
    R.filter(R.equals(true)),
    R.keys,
    R.flip(R.pickAll)(optionFunctions),
    R.values,
    R.map(R.call)
)(cliOptions);

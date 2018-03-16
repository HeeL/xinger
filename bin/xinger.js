#!/usr/bin/env node

const cli = require('cli');
const R = require('ramda');
const acceptRequests = require('../src/acceptRequests');

const cliOptions = {
    accept: ['a', 'Accept all incoming contact requests']
};
const optionFunctions = { accept: acceptRequests };

R.pipe(
    cli.parse,
    R.filter(R.equals(true)),
    R.keys,
    R.flip(R.pickAll)(optionFunctions),
    R.values,
    R.map(R.call)
)(cliOptions);
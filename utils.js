#!/usr/bin/env node
"use strict";
const crypto = require("crypto");

const utils = {
  generateDepositAddress() {
    const hash = crypto.createHash("sha256");
    return hash
      .update(`${Date.now()}`)
      .digest("hex")
      .substring(0, 8);
  },
  turnDepositsToArrayOfNumbers(deposits) {
    let newArray = [];

    deposits = deposits.split(",");

    deposits.forEach(numberString => {
      newArray.push(parseInt(numberString));
    });

    return newArray;
  },
  getTotalDepositAmount(deposits) {
    return deposits.reduce((a, b) => a + b);
  }
};

module.exports = utils;

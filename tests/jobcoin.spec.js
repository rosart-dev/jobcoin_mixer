#!/usr/bin/env node
"use strict";
const expect = require("chai").expect;
const utils = require("../utils");

describe("utils", () => {
  it("should exist", () => {
    expect(utils).to.be.ok;
  });

  it("generateDepositAddress generates a string with 8 characters", () => {
    const depositAddress = utils.generateDepositAddress();
    expect(typeof depositAddress).to.equal("string");
    expect(depositAddress).to.have.length(8);
  });

  it("turnDepositsToArrayOfNumbers will turn comma-separated numbers (string) to array of number", () => {
    const numStr = "10,20,30,40,50";
    const expectedArr = [10, 20, 30, 40, 50];
    const results = utils.turnDepositsToArrayOfNumbers(numStr);
    results.forEach((number, index) => {
      expect(number).to.equal(expectedArr[index]);
    });
  });

  it("getTotalDepositAmount will return the correct total of values in given array", () => {
    const values1 = [10, 20, 30, 40, 50];
    const total1 = utils.getTotalDepositAmount(values1);
    expect(total1).to.equal(150);

    const values2 = [1, 4, 5, 7, 3, 2, 8, 9];
    const total2 = utils.getTotalDepositAmount(values2);
    expect(total2).to.equal(39);
  });
});

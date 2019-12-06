#!/usr/bin/env node
"use strict";
const axios = require("axios");

/* Urls */
const API_BASE_URL = "http://jobcoin.gemini.com/parameter-awkward/api";
const API_ADDRESS_URL = `${API_BASE_URL}/addresses/`;
const API_TRANSACTIONS_URL = `${API_BASE_URL}/transactions`;

exports.getAddressInfo = async address => {
  try {
    const addressInfo = await axios.get(`${API_ADDRESS_URL}${address}`);

    return addressInfo.data;
  } catch (error) {
    console.error(error);
  }
};

exports.sendJobcoins = async (toAddress, fromAddress, amount) => {
  try {
    const transactionResponse = await axios.post(API_TRANSACTIONS_URL, {
      fromAddress,
      toAddress,
      amount
    });

    return transactionResponse.data;
  } catch (error) {
    console.error(error);
  }
};

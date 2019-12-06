#!/usr/bin/env node
"use strict";
const green = require("chalk").green;
const inquirer = require("inquirer");
const utils = require("./utils");

const { getAddressInfo, sendJobcoins } = require("./apiClient");

let userProvidedAddresses = [];
let mixerAddresses = [];
let desiredDeposits = [];
let userAddress = "";

const JOB_COIN_HOUSE_ADDRESS = "JobCoinHouse";

function prompt(isRepeat = false) {
  const jobcoinAddress = utils.generateDepositAddress();
  inquirer
    .prompt([
      {
        name: "userAddress",
        message: "Hi, please enter your address.",
        when: !isRepeat
      },
      {
        name: "addresses",
        message:
          "Please enter a comma-separated list of new, unused Jobcoin addresses where your mixed Jobcoins will be sent:"
      },
      {
        name: "deposit",
        message: `You may now send Jobcoins to address ${green(
          jobcoinAddress
        )}. They will be mixed and sent to your destination addresses. \n Enter ${green(
          '"y"'
        )} to run again.`,
        when: answers => answers.addresses
      },
      {
        name: "amounts",
        message:
          "Please enter a comma-separated list of the amount of Jobcoins to be sent to each respective address",
        when: answers => answers.deposit !== "y"
      }
    ])
    .then(answers => {
      //Save the user address
      if (answers.userAddress) {
        userAddress = answers.userAddress;
      }

      //Continually append to the list of addresses the user provides
      let addresses = answers.addresses.split(",");
      userProvidedAddresses = [...userProvidedAddresses, ...addresses];

      /**
       * I collected the addresses that the mixer provides here
       * However I created a "JobCoinHouse" address in the
       * Jobcoin viewer portal that will collect the bitcoins
       * and send them to the desired addresses - Therefore the addresses
       * that will recieve jobcoins will not see the sender's address
       */
      mixerAddresses = [...mixerAddresses, jobcoinAddress];

      //Create list of desposit amounts
      if (answers.amounts) {
        let newDepositAmounts = utils.turnDepositsToArrayOfNumbers(
          answers.amounts
        );
        desiredDeposits = [...newDepositAmounts];
      }

      //Prompt again if they wish to provide more addresses
      if (answers.deposit && answers.deposit.toLowerCase() === "y") {
        prompt(true);
      } else {
        //make http request to get details of the user
        getAddressInfo(userAddress).then(data => {
          //Ensure the user exists and/or if they have enough Jobcoins
          let totalDesiredDepositAmount = utils.getTotalDepositAmount(
            desiredDeposits
          );

          if (data.balance < totalDesiredDepositAmount) {
            //Cannot continue the transactions
            console.log(
              `Insufficient funds :(. You want to send ${totalDesiredDepositAmount} jobcoins but your balance is ${data.balance} jobcoins. Please try again.`
            );
          } else {
            //Continue the transaction
            //Send the Jobcoins to the JobCoinHouse Address
            sendJobcoins(
              JOB_COIN_HOUSE_ADDRESS,
              userAddress,
              totalDesiredDepositAmount
            ).then(resp => {
              const allSendTransactionsPromises = [];

              //Then JobCoinHouse will send JobCoins to respective addresses
              userProvidedAddresses.forEach((toAddress, index) => {
                allSendTransactionsPromises.push(
                  sendJobcoins(
                    toAddress,
                    JOB_COIN_HOUSE_ADDRESS,
                    desiredDeposits[index]
                  )
                );
              });

              //Executing all transactions
              Promise.all(allSendTransactionsPromises).then(resp => {
                console.log(
                  "Money is now being sent! Thank you for using Jobcoin Mixer"
                );
              });
            });
          }
        });
      }
    });
}

console.log("Welcome to the Jobcoin mixer!");
prompt();

module.exports = prompt;

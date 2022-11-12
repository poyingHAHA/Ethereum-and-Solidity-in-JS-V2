const HDWwlletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile.js");
require("dotenv").config();

const provider = new HDWwlletProvider(
    process.env.MNEMONIC,
    "https://goerli.infura.io/v3/346fabc81de441a085290afe2eb03c09"
);

const web3 = new Web3(provider);
(async() => {
    const accounts = await web3.eth.getAccounts(); // A single MNEMONIC can use to generate a list of accounts
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
        .send({ gas: '1000000', from: accounts[0] })
    console.log("Accounts: ",accounts);
    console.log("Address: ", result.options.address);
    provider.engine.stop();
})()


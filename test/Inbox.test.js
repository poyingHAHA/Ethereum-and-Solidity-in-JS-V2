const assert = require("assert");
const ganache = require("ganache-cli"); //this is going to serve as our local Ethereum test network.
const Web3 = require("web3"); //Whenever we make use of web three, we are always going to be requiring in or importing a constructor function
const web3 = new Web3(ganache.provider()); //here is what creates an instance of web three and tells that instance to attempt to connect to this local test network

// Update the import to destructure the abi (formerly the interface) and the evm (bytecode)
const {abi, evm} = require("../compile");

let accounts;
let inbox;
const INITIAL_STRING = "Hi there!";

before(async () => {
    // Get a list of all accounts
    // Every function we call with web3 is asynchronous in nature which means it's going to return Promise
    accounts = await web3.eth.getAccounts()
    
    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({data: evm.bytecode.object, arguments: [INITIAL_STRING]})
        .send({from: accounts[0], gas: '1000000' })
});

describe("Inbox", () => {
    it('deploys a contract', () => {
        // after we deploy the contract to the test network, this address property will contain the address of wherever this cnotract is deployed to.
        assert.ok(inbox.options.address); // if it's null or undefined then this test will fail
    });

    it('has a default message', async () => {
        // The second set of parentheses are used to customize the transaction that we are attempting to send out to the network
        // we might pass in an object that specifies exactly who is going to pay for this transaction and how much gas to use.
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING)
    });

    it('can change the message', async () => {
        // send transaction
        await inbox.methods.setMessage("New message").send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, "New message");
    });
})
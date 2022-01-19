const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddres;
let campaign;

beforeEach(async() => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [campaignAddres] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddres);
});

describe('Campaigns', () =>  {
  it('Deploys factory and campaig', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('Marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  it('Allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200'
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('Requires a minimun contribution', async () => {
    try {
      await campaign.methos.contribute().send({
        from: accounts[1],
        value: 0
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('Allows a manager to create a payment request', async () => {
    const requestDescription = 'Buy something';
    await campaign.methods
      .createRequest(requestDescription, '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    const request = await campaign.methods.requests(0).call();

    assert.strictEqual(requestDescription, request.description);
  });

  it('Processes request', async () => {
    let initialBalance = await web3.eth.getBalance(accounts[1]);
    initialBalance = await web3.utils.fromWei(initialBalance, 'ether');
    initialBalance = parseFloat(initialBalance);

    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
      .createRequest('Buy something', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let finalBalance = await web3.eth.getBalance(accounts[1]);
    finalBalance = web3.utils.fromWei(finalBalance, 'ether');
    finalBalance = parseFloat(finalBalance);
    const difference = finalBalance - initialBalance;

    assert(difference > 4);
  })
});
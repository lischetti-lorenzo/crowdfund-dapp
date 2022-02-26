async function increase(web3, duration) {
  //first, let's increase time
  await web3.currentProvider.sendAsync({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [duration],
    id: 0
  }, () => {});

  //next, let's mine a new block
  await web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_mine",
      params: [],
      id: 0
  }, () => {});
}

const duration = {

  seconds: function (val) {
      return val;
  },
  minutes: function (val) {
      return val * this.seconds(60);
  },
  hours: function (val) {
      return val * this.minutes(60);
  },
  days: function (val) {
      return val * this.hours(24);
  },
}

module.exports = {
  increase,
  duration,
};

module.exports = {
  networks: {
    development: {
      host: "10.80.69.218",
      port: 22000,
      network_id: "*", // Match any network id
      gasPrice:0,
      gas: 4500000
    },
    nodeone: {
      host: "10.80.69.218",
      port: 22000,
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000,
    },
    nodetwo: {
      host: "10.80.69.218",
      port: 22001,
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000,
    },
    nodethree: {
      host: "10.80.69.218",
      port: 22002,
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000,
    },
  },
};

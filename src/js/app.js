App = {
  web3Provider: null,
  contracts: {},
  account: null,

  /**
   * Initializes web application using current account and provider
   */
  init: function(accounts) {
    App.accounts = accounts;
    App.account = App.getAccount(window.location.pathname);

    /* Initialize web3 */
    App.web3Provider = new Web3.providers.HttpProvider(App.account.provider);

    web3 = new Web3(App.web3Provider);

    App.account.hash = web3.eth.accounts[0];

    App.getTransactionsByAccount(App.account.hash,web3.eth)

    console.log(App.accounts)

    return App.initContract();
  },

  /**
   * Initializes smart contract on web application
   */
  initContract: function() {
    $.getJSON("Trade.json", function(data) {
      App.contracts.Trade = TruffleContract(data);

      App.contracts.Trade.setProvider(App.web3Provider);

      return App.fetchBalance();
    });

    return App.setupPage();
  },

  /**
   * Retrieves balance for current account from smart contract
   */
  fetchBalance: function() {
    App.contracts.Trade.deployed()
      .then(function(instance) {
        return instance.getBalance(App.account.hash);
      })
      .then(function(balance) {
        $(".account-balance").text(Number(web3.fromWei(balance)).toFixed(2));
      })
      .catch(function(error) {
        console.log(error);
      });
  },

  getTransactionsByAccount: function(myaccount, eth) {
    var blocks = "Trasactions Blocks: ";

    startBlockNumber = 0
    endBlockNumber = eth.blockNumber;
    console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
  
    for (var i = startBlockNumber; i <= endBlockNumber; i++) {
      if (i % 1000 == 0) {
        console.log("Searching block " + i);
      }
      var block = eth.getBlock(i, true);
      if (block != null && block.transactions != null) {
        block.transactions.forEach( function(e) {
          if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
            // console.log("  tx hash          : " + e.hash + "\n"
            //   + "   nonce           : " + e.nonce + "\n"
            //   + "   blockHash       : " + e.blockHash + "\n"
            //   + "   blockNumber     : " + e.blockNumber + "\n"
            //   + "   transactionIndex: " + e.transactionIndex + "\n"
            //   + "   from            : " + e.from + "\n" 
            //   + "   to              : " + e.to + "\n"
            //   + "   value           : " + e.value + "\n"
            //   + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
            //   + "   gasPrice        : " + e.gasPrice + "\n"
            //   + "   gas             : " + e.gas + "\n"
            //   + "   input           : " + e.input);

            blocks += e.blockNumber + " "
          }
        })
      }
    }

    document.getElementById("blocks").innerHTML = blocks
  },

  /**
   * Sets up HTML elements based on available contract data
   */
  setupPage: function() {
    var template = $("#account-item");
    $("#account-name").text(App.account.name);
    $("#account-image").text(App.account.image);

    Object.keys(App.accounts).forEach(function(key, index) {

      var account = App.accounts[key];

      var x = document.getElementById("accounts");
      option = document.createElement('option');
      option.value = account.provider
      option.text = account.name;
      x.add(option);


     
      template.find(".dropdown-item").attr("href", "/" + (index + 1));
      template.find(".dropdown-item").text(account.name);
      template.find(".dropdown-item").toggleClass("active", App.account === account);
      $(".dropdown-menu").append(template.html());
    });

    return App.bindEvents();
  },

  /**
   * Bind actions with HTML elements
   */
  bindEvents: function() {
    $(document).on("click", "#sendEther", App.sendEther);
  },

  /**
   * Handles action when user clicks 'Buy'. Calls
   * the buying action on the smart contract.
   */
  sendEther: function(event) {
    event.preventDefault();
    var instance;
    var hash;
    var recieverPubKey;
    var value = $('#etherValue').val()
    var accountsVal = $('#accounts').val()
    console.log(accountsVal)

    App.contracts.Trade.deployed()
      .then(function(contract) {
        instance = contract;

        Object.keys(App.accounts).forEach(function(key, index) {
          var account = App.accounts[key];
          if(accountsVal == account.provider){
            recieverPubKey = account.key;
          }
        });

        // // Creates array of keys from other accounts
        // var privateFor = $(App.accounts)
        // .not([App.account])
        // .get()
        // .map(function(acc) {
        //   return acc.key;
        // });

        // console.log(privateFor)

        hash = new Web3(new Web3.providers.HttpProvider(accountsVal)).eth.accounts[0];

        return instance.sendEther(hash,parseInt(value, 10) * 1000000000000000000, {
          from: App.account.hash,
          privateFor: [recieverPubKey],
        });
      })
      .then(function(data) {
        console.log(data)
        return App.fetchBalance();
      })
      .catch(function(error) {
        console.log(error);
      });
  },

  /**
   * Switches accounts based on browser routes
   */
  getAccount: function(pathname) {
    switch (window.location.pathname) {
      case "/1":
        return App.accounts[0];
      case "/2":
        return App.accounts[1];
      case "/3":
        return App.accounts[2];
      default:
        return App.accounts[0];
    }
  },
};

$(function() {
  $(window).load(function() {
    $.getJSON("json/accounts.json").then(function(data) {
      App.init(data);
    });
  });
});

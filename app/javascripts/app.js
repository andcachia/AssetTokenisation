// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import assetTokenisation_artifacts from '../../build/contracts/AssetTokenisation.json'

var AssetTokenisation = contract(assetTokenisation_artifacts);

var AccountAddress;

var showAccountDetails = function(){
  AccountAddress = localStorage.getItem("AccountAddress");
  $("#account-address").html("<b>Account Address:</b> " + AccountAddress);

  var etherBalance = web3.fromWei(web3.eth.getBalance(AccountAddress));
  $("#ether-balance").html("<b>Balance:</b> " + etherBalance.toString() + " ETH");
}


window.getAssetDetails = function() {
  let assetId = $("#search-asset-id").val();

  AssetTokenisation.deployed().then(function(contractInstance) {
    contractInstance.getAssetDetails(assetId, {from: AccountAddress, gas: 140000}).then(function(v) {
      $("#asset-desc").html(v[0]);
      $("#avail-tokens").html("<b>Available Tokens</b> " + v[1].toString());
      $("#tokens-price").html("<b>Token Price</b> " + web3.fromWei(v[2], 'ether') + " ETH");
      $("#account-tokens").html("<br><b>My Account Tokens</b> " + v[3].toString());
    });
  });
}

window.addNewAsset = function() {
  let assetId = $("#input-asset-id").val();
  let assetDesc = $("#input-asset-desc").val();
  let numTokens = $("#input-num-tokens").val();
  let pricePerToken = $("#input-price-per-token").val();

  AssetTokenisation.deployed().then(function(contractInstance) {
    contractInstance.addAsset(assetId, assetDesc, numTokens, web3.toWei(pricePerToken, 'ether'), 
      {gas: 140000, from: AccountAddress}).then(function() {
        //window.location.href = "./index.html";
      });
  });
}

window.buyAsset = function() {
  let assetId = $("#buy-asset-id").val();
  let price = $("#buy-asset-amount").val();

  AssetTokenisation.deployed().then(function(contractInstance) {
    contractInstance.buy(assetId,
      {value: web3.toWei(price, 'ether'), from: AccountAddress}).then(function() {
        showAccountDetails();
      });
  });
}

window.sellAsset = function() {
  let assetId = $("#sell-asset-id").val();
  let numTokens = $("#sell-asset-tokens").val();

  AssetTokenisation.deployed().then(function(contractInstance) {
    contractInstance.sell(assetId, numTokens,
      {from: AccountAddress}).then(function() {
        showAccountDetails();
      });
  });
}



$( document ).ready(function() {
  /*if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {*/
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  //}

  AssetTokenisation.setProvider(web3.currentProvider);
  showAccountDetails();
});
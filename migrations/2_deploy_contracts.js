var AssetTokenisation = artifacts.require("./AssetTokenisation.sol");

module.exports = function(deployer) {
  deployer.deploy(AssetTokenisation, {gas: 6700000});
};
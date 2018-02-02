pragma solidity ^0.4.18;

contract AssetTokenisation {

    struct Shareholder {
        uint tokensOwned;
    }

    struct Asset {
        uint availableTokens;
        uint tokenPrice;

        string assetDescription;
        address owner;

        mapping (address => Shareholder) shareholderInfo;
    }

    mapping (bytes32 => Asset) assetList;

    function addAsset(bytes32 assetId, string assetDescription, uint numberOfTokens, uint pricePerToken) public {
        assetList[assetId].owner = msg.sender;
        assetList[assetId].assetDescription = assetDescription;
        assetList[assetId].tokenPrice = pricePerToken;
        assetList[assetId].availableTokens = numberOfTokens;
    }

    function buy(bytes32 assetId) payable public returns (uint) {
        uint tokensToBuy = msg.value / assetList[assetId].tokenPrice;
        require(tokensToBuy <= assetList[assetId].availableTokens);

        assetList[assetId].shareholderInfo[msg.sender].tokensOwned += tokensToBuy;
        assetList[assetId].availableTokens -= tokensToBuy;

        return tokensToBuy;
    }

    function sell(bytes32 assetId, uint tokensToSell) public {
        require(tokensToSell <= assetList[assetId].shareholderInfo[msg.sender].tokensOwned);
        require((tokensToSell * assetList[assetId].tokenPrice) <= this.balance);

        assetList[assetId].shareholderInfo[msg.sender].tokensOwned -= tokensToSell;
        assetList[assetId].availableTokens += tokensToSell;

        msg.sender.transfer(tokensToSell * assetList[assetId].tokenPrice);
    }


    function getAssetDetails(bytes32 assetId) view public returns (string, uint, uint, uint) {
        return (assetList[assetId].assetDescription, 
            assetList[assetId].availableTokens, 
            assetList[assetId].tokenPrice,
            assetList[assetId].shareholderInfo[msg.sender].tokensOwned);
    }

    function getShareholderShares(bytes32 assetId, address user) view public returns (uint) {
        return assetList[assetId].shareholderInfo[user].tokensOwned;
    }
}
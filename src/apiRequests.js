import axios from "axios";
import tokenList from "./tokenList.json";

//https://dex-backend-lcew.onrender.com

// const ONE_INCH_API_KEY = "E77kfTWqGWaLzHSXycEVUAKmIp9FKHAX";

const apiInstance = axios.create({
    baseURL: "https://api-dzap.1inch.io/v5.2",
    // headers: { "Authorization": ONE_INCH_API_KEY, "Access-Control-Allow-Origin": "*" }
});

export const tokenApiRequests = {

    // api request to get the price of 1 token
    getTokenPrice: (contractAddress, chainId) => axios.get(`https://dex-backend-lcew.onrender.com/token/price?contractAddress=${contractAddress}&chainId=${chainId}`),

    // api request to 1inch api endpoint approve/allowance to check whether 1inch smart contract is approved to spend the selling token
    getTokenAllowance: (tokenToSellAddress, walletAddress, chainId) => {
        let allowance;
        switch (chainId) {
            case "0x1":
                allowance = apiInstance.get(`/1/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0x89":
                allowance = apiInstance.get(`/137/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            default:
                console.log("invalid url");
                break;
        }
        return allowance;
    },

    // api request to 1inch api endpoint "approve/transaction" to approve 1inch smart contract to spend the selling token from our metamask wallet
    getTransactionDetails: (tokenToSellAddress, tokenToSellAmount, chainId) => {
        const token = tokenList.find(token => token.address[chainId] === tokenToSellAddress);
        let approve;
        switch (chainId) {
            case "0x1":
                approve = apiInstance.get(`/1/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0x89":
                const amount = tokenToSellAmount * Math.pow(10, token.decimals);
                console.log(amount);
                approve = apiInstance.get(`/137/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${String(amount)}`);
                break
            default:
                console.log("invalid url");
                break;
        }
        return approve;
    },

    // api request to 1inch api endpoint approve/transaction to get the transaction details of the swap transaction to use it to send transaction through metamask
    swapTokens: (tokenToSellAddress, tokenToBuyAddress, tokenToSellAmount, walletAddress, slippage, chainId) => {
        const token = tokenList.find(token => token.address[chainId] === tokenToSellAddress);
        let tx;
        switch (chainId) {
            case "0x1":
                tx = apiInstance.get(`/1/swap?fromTokenAddress=${tokenToSellAddress}&toTokenAddress=${tokenToBuyAddress}&amount=${String(tokenToSellAmount).padEnd(String(token.decimals) + String(tokenToSellAmount).length, '0')}&fromAddress=${walletAddress}&slippage=${slippage}`);
                break;
            case "0x89":
                const amount = tokenToSellAmount * Math.pow(10, token.decimals);
                console.log(amount);
                tx = apiInstance.get(`/137/swap?fromTokenAddress=${tokenToSellAddress}&toTokenAddress=${tokenToBuyAddress}&amount=${String(amount)}&fromAddress=${walletAddress}&slippage=${Number(slippage)}`);
                break;
            default:
                console.log("invalid url");
                break;
        }
        return tx;
    }
}
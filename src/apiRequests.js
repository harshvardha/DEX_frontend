import axios from "axios";
import tokenList from "./tokenList.json";

//https://dex-backend-lcew.onrender.com

const ONE_INCH_API_KEY = "E77kfTWqGWaLzHSXycEVUAKmIp9FKHAX";

const apiInstance = axios.create({
    baseURL: "https://api.1inch.dev/swap/v5.2",
    headers: { "Authorization": ONE_INCH_API_KEY, "Access-Control-Allow-Origin": "*" }
});

export const tokenApiRequests = {

    // api request to get the price of 1 token
    getTokenPrice: (contractAddress) => axios.get(`https://dex-backend-lcew.onrender.com/token/price?contractAddress=${contractAddress}`),

    // api request to 1inch api endpoint approve/allowance to check whether 1inch smart contract is approved to spend the selling token
    getTokenAllowance: (tokenToSellAddress, walletAddress, chainId) => {
        let allowance;
        switch (chainId) {
            case "0x1":
                allowance = apiInstance.get(`/1/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0xa4b1":
                allowance = apiInstance.get(`/42161/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0xa":
                allowance = apiInstance.get(`/10/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0x89":
                allowance = apiInstance.get(`/137/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0x4E454152":
                allowance = apiInstance.get(`/1313161554/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            default:
                console.log("invalid url");
                break;
        }
        return allowance;
    },

    // api request to 1inch api endpoint "approve/transaction" to approve 1inch smart contract to spend the selling token from our metamask wallet
    getTransactionDetails: (tokenToSellAddress, amount, chainId) => {
        let approve;
        switch (chainId) {
            case "0x1":
                approve = apiInstance.get(`/1/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0xa4b1":
                approve = apiInstance.get(`/42161/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0xa":
                approve = apiInstance.get(`/10/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0x89":
                approve = apiInstance.get(`/137/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0x4E454152":
                approve = apiInstance.get(`/1313161554/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            default:
                console.log("invalid url");
                break;
        }
        return approve;
    },

    // api request to 1inch api endpoint approve/transaction to get the transaction details of the swap transaction to use it to send transaction through metamask
    swapTokens: (tokenToSellAddress, tokenToBuyAddress, tokenToSellAmount, walletAddress, slippage, chainId) => {
        const token = tokenList.find(token => token.address === tokenToSellAddress);
        let tx;
        switch (chainId) {
            case "0x1":
                tx = apiInstance.get(`/1/swap?fromTokenAddress=${tokenToSellAddress}&toTokenAddress=${tokenToBuyAddress}&amount=${String(tokenToSellAmount).padEnd(String(token.decimals) + String(tokenToSellAmount).length, '0')}&fromAddress=${walletAddress}&slippage=${slippage}`);
                break;
            case "0xa4b1":
                tx = apiInstance.get(`/42161/swap?fromTokenAddress=${tokenToSellAddress}&toTokenAddress=${tokenToBuyAddress}&amount=${String(tokenToSellAmount).padEnd(String(token.decimals) + String(tokenToSellAmount).length, '0')}&fromAddress=${walletAddress}&slippage=${slippage}`);
                break;
            case "0xa":
                tx = apiInstance.get(`/10/swap?fromTokenAddress=${tokenToSellAddress}&toTokenAddress=${tokenToBuyAddress}&amount=${String(tokenToSellAmount).padEnd(String(token.decimals) + String(tokenToSellAmount).length, '0')}&fromAddress=${walletAddress}&slippage=${slippage}`);
                break;
            case "0x89":
                tx = apiInstance.get(`/137/swap?fromTokenAddress=${tokenToSellAddress}&toTokenAddress=${tokenToBuyAddress}&amount=${String(tokenToSellAmount).padEnd(String(token.decimals) + String(tokenToSellAmount).length, '0')}&fromAddress=${walletAddress}&slippage=${slippage}`);
                break;
            case "0x4E454152":
                tx = apiInstance.get(`/1313161554/swap?fromTokenAddress=${tokenToSellAddress}&toTokenAddress=${tokenToBuyAddress}&amount=${String(tokenToSellAmount).padEnd(String(token.decimals) + String(tokenToSellAmount).length, '0')}&fromAddress=${walletAddress}&slippage=${slippage}`);
                break;
            default:
                console.log("invalid url");
                break;
        }
        return tx;
    }
}
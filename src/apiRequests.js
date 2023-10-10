import axios from "axios";
import tokenList from "./tokenList.json";

export const tokenApiRequests = {

    // api request to get the price of 1 token
    getTokenPrice: (contractAddress) => axios.get(`http://localhost:5000/token/price?contractAddress=${contractAddress}`),

    // api request to 1inch api endpoint approve/allowance to check whether 1inch smart contract is approved to spend the selling token
    getTokenAllowance: (tokenToSellAddress, walletAddress, chainId) => {
        let allowance;
        switch (chainId) {
            case "0x1":
                allowance = axios.get(`https://api.1inch.io/v5.2/1/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0xa4b1":
                allowance = axios.get(`https://api.1inch.io/v5.2/42161/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0xa":
                allowance = axios.get(`https://api.1inch.io/v5.2/10/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0x89":
                allowance = axios.get(`https://api.1inch.io/v5.2/137/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
                break;
            case "0x4E454152":
                allowance = axios.get(`https://api.1inch.io/v5.2/1313161554/approve/allowance?tokenAddress=${tokenToSellAddress}&walletAddress=${walletAddress}`);
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
                approve = axios.get(`https://api.1inch.io/v5.2/1/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0xa4b1":
                approve = axios.get(`https://api.1inch.io/v5.2/42161/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0xa":
                approve = axios.get(`https://api.1inch.io/v5.2/10/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0x89":
                approve = axios.get(`https://api.1inch.io/v5.2/137/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            case "0x4E454152":
                approve = axios.get(`https://api.1inch.io/v5.2/1313161554/approve/transaction?tokenAddress=${tokenToSellAddress}&amount=${amount}`);
                break;
            default:
                console.log("invalid url");
                break;
        }
        return approve;
    },

    // api request to 1inch api endpoint approve/transaction to get the transaction details of the swap transaction to use it to send transaction through metamask
    swapTokens: (tokenToSellAddress, tokenToBuyAddress, tokenToSellAmount, walletAddress, slippage) => {
        const token = tokenList.find(token => token.address === tokenToSellAddress);
        const tx = axios.get(`https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${tokenToSellAddress}&toTokenAddress=${tokenToBuyAddress}&amount=${String(tokenToSellAmount).padEnd(String(token.decimals) + String(tokenToSellAmount).length, '0')}&fromAddress=${walletAddress}&slippage=${slippage}`)
        return tx;
    }
}
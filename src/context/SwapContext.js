import React, { useEffect, useState } from "react";
import chainList from "../chainList.json";
import { tokenApiRequests } from "../apiRequests";

const SwapContext = React.createContext();
const { ethereum } = window;

const SwapProvider = ({ children }) => {
    // state to store the contract address of the selling token
    const [tokenToSellAddress, setTokenToSellAddress] = useState("");

    // state to store the contract address of the buying token
    const [tokenToBuyAddress, setTokenToBuyAddress] = useState("");

    // state to store the chain id of the selected network in hex
    const [chainId, setChainId] = useState();

    // metamask connected account address
    const [accountAddress, setAccountAddress] = useState("");

    // n. of selling tokens
    const [tokenToSellAmount, setTokenToSellAmount] = useState("");

    // no. of buying tokens
    const [tokenToBuyAmount, setTokenToBuyAmount] = useState("");

    // decimals of selling token
    const [tokenToSellDecimals, setTokenToSellDecimals] = useState(0);

    // decimals of buying token
    const [tokenToBuyDecimals, setTokenToBuyDecimals] = useState(0);

    const connectWallet = async () => {
        // function to connect to metamask wallet
        console.log(chainId);

        try {
            // checking if metamask exist or not
            if (!ethereum) return alert("Please install Metamask.");

            // if wallet not connected then connect it 
            if (!accountAddress) {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                if (accounts.length) {
                    setAccountAddress(accounts[0]);
                }
                else {
                    alert("No account found");
                }
            }

            // getting the chain id of the network selected in metamask wallet
            const currentChainId = await ethereum.request({ method: "eth_chainId" });

            if (currentChainId !== chainId) {
                try {
                    // switching to selected network if it is already added to wallet
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: chainId }]
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to metamask
                    if (switchError.code === 4902) {
                        const network = chainList.find(chain => chain.chainId === chainId);
                        try {
                            // adding selected network to wallet
                            await ethereum.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: chainId,
                                        chainName: network.networkName,
                                        rpcUrls: network.rpcUrls,
                                        iconUrls: [],
                                        nativeCurrency: network.nativeCurrency,
                                        blockExplorerUrls: network.blockExplorerUrls
                                    }
                                ]
                            })
                        } catch (addError) {
                            console.log("Unable to add network.");
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getQuote = async (event, sellAddress, buyAddress, sellAmount, sellDecimals, buyDecimals, network) => {
        let amount, sellTokenAddress, buyTokenAddress, sellTokenDecimals, buyTokenDecimals, networkId;
        if (event) {
            event.preventDefault();
            amount = event.target.value;
            setTokenToSellAmount(amount);
        }
        else {
            if (sellAddress) {
                sellTokenAddress = sellAddress;
            }
            if (buyAddress) {
                buyTokenAddress = buyAddress;
            }
            if (sellDecimals) {
                sellTokenDecimals = sellDecimals;
            }
            if (buyDecimals) {
                buyTokenDecimals = buyDecimals;
            }
            if (network) {
                networkId = network;
            }
            amount = sellAmount ? sellAmount : tokenToSellAmount;
        }
        try {
            if (tokenToSellAddress && tokenToBuyAddress && Number(amount) > 0) {
                const quote = await tokenApiRequests.getQuote(
                    sellTokenAddress ? sellTokenAddress : tokenToSellAddress,
                    buyTokenAddress ? buyTokenAddress : tokenToBuyAddress,
                    Number(amount) * Math.pow(10, sellTokenDecimals ? sellTokenDecimals : tokenToSellDecimals),
                    networkId ? networkId : chainId
                );
                console.log(`quote: ${JSON.stringify(quote.data)}`);
                const buyAmount = Number(quote.data.toAmount) / Math.pow(10, buyTokenDecimals ? buyTokenDecimals : tokenToBuyDecimals);
                setTokenToBuyAmount(buyAmount);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const sendTransaction = async (transaction) => {
        // function to send transaction through metamask for exchanging token
        try {
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [
                    {
                        from: transaction.data.tx.from,
                        to: transaction.data.tx.to,
                        gas: String(transaction.data.tx.gas),
                        gasPrice: transaction.data.tx.gasPrice,
                        value: transaction.data.tx.value,
                        data: transaction.data.tx.data
                    }
                ]
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (accountAddress) {
            connectWallet();
        }
    }, [chainId])

    return (
        <SwapContext.Provider
            value={{
                tokenToSellAddress,
                tokenToBuyAddress,
                accountAddress,
                tokenToSellAmount,
                tokenToBuyAmount,
                chainId,
                tokenToSellDecimals,
                tokenToBuyDecimals,
                setTokenToSellAmount,
                setTokenToBuyAmount,
                setTokenToSellAddress,
                setTokenToBuyAddress,
                setTokenToSellDecimals,
                setTokenToBuyDecimals,
                setChainId,
                setAccountAddress,
                getQuote,
                connectWallet,
                sendTransaction
            }}
        >
            {children}
        </SwapContext.Provider>
    )
}

export { SwapContext, SwapProvider }
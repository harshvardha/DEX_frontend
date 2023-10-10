import React, { useEffect, useState } from "react";
import chainList from "../chainList.json";

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

    // price of 1 token of the selling token
    const [tokenToSellPrice, setTokenToSellPrice] = useState(0.0);

    // n. of selling tokens
    const [tokenToSellAmount, setTokenToSellAmount] = useState("");

    // price of 1 token of the buying token
    const [tokenToBuyPrice, setTokenToBuyPrice] = useState(0.0);

    // no. of buying tokens
    const [tokenToBuyAmount, setTokenToBuyAmount] = useState("");

    // ratio between the price of 1 selling token and 1 buying token (i.e. tokenToSellPrice / tokenToBuyPrice)
    const [ratioOfTokenPrices, setRatioOfTokenPrices] = useState();

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

    const sendTransaction = async (transaction) => {
        // function to send transaction through metamask for exchanging token
        try {
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [
                    {
                        from: transaction.tx.from,
                        to: transaction.tx.to,
                        gas: transaction.tx.gas,
                        gasPrice: transaction.tx.gasPrice,
                        value: transaction.tx.value,
                        data: transaction.tx.data
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
                tokenToSellPrice,
                tokenToBuyPrice,
                ratioOfTokenPrices,
                chainId,
                setRatioOfTokenPrices,
                setTokenToSellAmount,
                setTokenToBuyAmount,
                setTokenToSellPrice,
                setTokenToBuyPrice,
                setTokenToSellAddress,
                setTokenToBuyAddress,
                setChainId,
                setAccountAddress,
                connectWallet,
                sendTransaction
            }}
        >
            {children}
        </SwapContext.Provider>
    )
}

export { SwapContext, SwapProvider }
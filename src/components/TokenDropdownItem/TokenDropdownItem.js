import { useState, useContext } from "react";
import { SwapContext } from "../../context/SwapContext";
import tokenList from "../../tokenList.json";
import { tokenApiRequests } from "../../apiRequests";

const TokenDropdownItem = ({
    imageURL,
    name,
    tokenAddress,
    tokenType,
    setTokenToSellTicker,
    setTokenToBuyTicker,
    setTokenToSellName,
    setTokenToBuyName,
    setIsOpenSell,
    setIsOpenBuy,
    setTokenToBuyImage,
    setTokenToSellImage
}) => {
    const {
        tokenToSellAddress,
        tokenToBuyAddress,
        tokenToSellPrice,
        tokenToBuyPrice,
        tokenToSellAmount,
        setTokenToSellAddress,
        setTokenToBuyAddress,
        setTokenToSellPrice,
        setTokenToBuyPrice,
        setRatioOfTokenPrices,
        setTokenToBuyAmount
    } = useContext(SwapContext);

    const changeTokenAddress = async (event) => {
        /* 
            whenever changing or selecting a token from select token dropdown
            this function arranges all the info required about the token 
        **/

        const token = tokenList.find(token => token.address === tokenAddress);
        try {
            const tokenInfo = await tokenApiRequests.getTokenPrice(tokenAddress);
            if (tokenType === "sell" && tokenAddress !== tokenToBuyAddress) {
                setTokenToSellAddress(tokenAddress);
                setTokenToSellPrice(tokenInfo.data.usdPrice);
                setTokenToSellTicker(token.ticker);
                setTokenToSellName(token.name);
                setTokenToSellImage(token.img);
                setIsOpenSell(false);
                if (tokenToBuyPrice) {
                    const ratio = tokenInfo.data.usdPrice / tokenToBuyPrice;
                    setRatioOfTokenPrices(ratio);
                    setTokenToBuyAmount(ratio * tokenToSellAmount);
                }
            }
            else if (tokenType === "buy" && tokenAddress !== tokenToSellAddress) {
                setTokenToBuyAddress(tokenAddress);
                setTokenToBuyPrice(tokenInfo.data.usdPrice);
                setTokenToBuyTicker(token.ticker);
                setTokenToBuyName(token.name);
                setTokenToBuyImage(token.img);
                setIsOpenBuy(false);
                const ratio = tokenToSellPrice / tokenInfo.data.usdPrice;
                setRatioOfTokenPrices(ratio);
                setTokenToBuyAmount(ratio * tokenToSellAmount)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="dropdownitem" onClick={changeTokenAddress}>
            <img className="chainLogo" src={imageURL} alt="" />
            <p className="networkName">{name}</p>
        </div>
    )
}

export default TokenDropdownItem;
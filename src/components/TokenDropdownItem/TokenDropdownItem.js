import { useContext } from "react";
import { SwapContext } from "../../context/SwapContext";
import tokenList from "../../tokenList.json";

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
        getQuote,
        chainId,
        setTokenToSellAddress,
        setTokenToBuyAddress,
        setTokenToSellDecimals,
        setTokenToBuyDecimals,
    } = useContext(SwapContext);

    const changeTokenAddress = async (event) => {
        /* 
            whenever changing or selecting a token from select token dropdown
            this function arranges all the info required about the token 
        **/

        const token = tokenList.find(token => token.address[chainId] === tokenAddress);

        if (tokenType === "sell") {
            setTokenToSellAddress(tokenAddress);
            setTokenToSellTicker(token.ticker);
            setTokenToSellName(token.name);
            setTokenToSellImage(token.img);
            setTokenToSellDecimals(token.decimals);
            setIsOpenSell(false);

            // getQuote will be called if user changes the sell token
            getQuote(null, tokenAddress, null, null, token.decimals, null);
        }
        if (tokenType === "buy") {
            setTokenToBuyAddress(tokenAddress);
            setTokenToBuyTicker(token.ticker);
            setTokenToBuyName(token.name);
            setTokenToBuyImage(token.img);
            setTokenToBuyDecimals(token.decimals);
            setIsOpenBuy(false);

            // getQuote will be called if user changes the buy token
            getQuote(null, null, tokenAddress, null, null, token.decimals);
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
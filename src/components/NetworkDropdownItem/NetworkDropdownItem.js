import { useContext } from "react";
import { SwapContext } from "../../context/SwapContext";
import chainList from "../../chainList.json";
import tokenList from "../../tokenList.json";
import { tokenApiRequests } from "../../apiRequests";
import "./DropdownItem.css";

const NetworkDropdownItem = ({ imageURL, name, chainId, setNetworkName, setNetworkImage, setIsOpen }) => {
    const {
        chainId: prevChainId,
        setChainId,
        setTokenToSellPrice,
        setTokenToBuyPrice,
        setRatioOfTokenPrices,
        setTokenToBuyAmount,
        setTokenToSellAddress,
        setTokenToBuyAddress,
        tokenToSellAddress,
        tokenToBuyAddress,
        tokenToSellAmount
    } = useContext(SwapContext);

    function switchNetwork() {
        const network = chainList.find(chain => chain.chainId === chainId);
        setNetworkName(network.chainName);
        setNetworkImage(network.image);
        setIsOpen(prevState => !prevState);
        if (tokenToSellAddress || tokenToBuyAddress) {
            updateBuyAndSellPrice();
        }
        else {
            setChainId(chainId);
        }
    }

    async function updateBuyAndSellPrice() {
        let sellTokenInfo;
        let buyTokenInfo;
        // getting new sell token info on network change
        if (tokenToSellAddress) {
            console.log(prevChainId);
            const sellToken = tokenList.find(token => token.address[prevChainId] === tokenToSellAddress);
            setTokenToSellAddress(sellToken.address[chainId]);
            sellTokenInfo = await tokenApiRequests.getTokenPrice(sellToken.address[chainId], chainId);
            setTokenToSellPrice(sellTokenInfo.data.usdPrice);
        }

        // getting new buy token info on network change
        if (tokenToBuyAddress) {
            const buyToken = tokenList.find(token => token.address[prevChainId] === tokenToBuyAddress);
            setTokenToBuyAddress(buyToken.address[chainId]);
            buyTokenInfo = await tokenApiRequests.getTokenPrice(buyToken.address[chainId], chainId);
            setTokenToBuyPrice(buyTokenInfo.data.usdPrice);
        }

        // updating the ratio between the prices
        if (tokenToSellAddress && tokenToBuyAddress) {
            const ratio = sellTokenInfo.data.usdPrice / buyTokenInfo.data.usdPrice;
            setRatioOfTokenPrices(ratio);

            // updating the buy token amount based on new ratio
            setTokenToBuyAmount(ratio * tokenToSellAmount);
        }
        setChainId(chainId);
    }

    return (
        <div className="dropdownitem" onClick={switchNetwork}>
            <img className="chainLogo" src={imageURL} alt="" />
            <p className="networkName">{name}</p>
        </div>
    )
}

export default NetworkDropdownItem;
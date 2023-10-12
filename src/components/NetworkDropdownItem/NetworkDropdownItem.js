import { useContext } from "react";
import { SwapContext } from "../../context/SwapContext";
import chainList from "../../chainList.json";
import tokenList from "../../tokenList.json";
import "./DropdownItem.css";

const NetworkDropdownItem = ({ imageURL, name, chainId, setNetworkName, setNetworkImage, setIsOpen }) => {
    const {
        chainId: prevChainId,
        getQuote,
        setChainId,
        setTokenToSellAddress,
        setTokenToBuyAddress,
        tokenToSellAddress,
        tokenToBuyAddress
    } = useContext(SwapContext);

    function switchNetwork() {
        let sellAddress, buyAddress;
        const network = chainList.find(chain => chain.chainId === chainId);
        setNetworkName(network.chainName);
        setNetworkImage(network.image);
        setIsOpen(prevState => !prevState);

        // whenever the user changes the network then to update quote the following procedure will take place
        if (tokenToSellAddress) {
            const tokenInfo = tokenList.find(token => token.address[prevChainId] === tokenToSellAddress);
            sellAddress = tokenInfo.address[chainId];
            setTokenToSellAddress(sellAddress);
        }
        else {
            sellAddress = null;
        }
        if (tokenToBuyAddress) {
            const tokenInfo = tokenList.find(token => token.address[prevChainId] === tokenToBuyAddress);
            buyAddress = tokenInfo.address[chainId];
            setTokenToBuyAddress(buyAddress);
        }
        else {
            buyAddress = null;
        }
        getQuote(null, sellAddress, buyAddress, null, null, null, chainId);
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
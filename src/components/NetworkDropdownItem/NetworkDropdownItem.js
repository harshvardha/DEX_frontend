import { useState, useContext } from "react";
import { SwapContext } from "../../context/SwapContext";
import chainList from "../../chainList.json"
import "./DropdownItem.css";

const NetworkDropdownItem = ({ imageURL, name, chainId, setNetworkName, setNetworkImage, setIsOpen }) => {
    const { setChainId } = useContext(SwapContext);

    function switchNetwork() {
        setChainId(chainId);
        const network = chainList.find(chain => chain.chainId === chainId);
        setNetworkName(network.chainName);
        setNetworkImage(network.image);
        setIsOpen(prevState => !prevState);
    }

    return (
        <div className="dropdownitem" onClick={switchNetwork}>
            <img className="chainLogo" src={imageURL} alt="" />
            <p className="networkName">{name}</p>
        </div>
    )
}

export default NetworkDropdownItem;
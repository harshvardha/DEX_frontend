import { useState, useContext, useEffect } from "react";
import { SwapContext } from "../../context/SwapContext";
import { IoIosArrowDropdown } from "react-icons/io";
import "./DropdownMenu.css";
import chainList from "../../chainList.json";
import NetworkDropdownItem from "../NetworkDropdownItem/NetworkDropdownItem";

const DropdownMenu = () => {
    const { setChainId } = useContext(SwapContext);
    const [isOpen, setIsOpen] = useState(false);
    const [networkName, setNetworkName] = useState()
    const [networkImage, setNetworkImage] = useState();

    // using the useEffect hook to initalize network states with ethereum by default
    useEffect(() => {
        const network = chainList.find(chain => chain.chainId === "0x1");
        setNetworkImage(network.image);
        setNetworkName(network.chainName);
        setChainId(network.chainId)
    }, [])

    return (
        <div className="dropdown--menu">
            <img style={{ width: "15%" }} src={networkImage} alt="" />
            <p className="selectMenu">{networkName}</p>
            <IoIosArrowDropdown onClick={() => setIsOpen(prevState => !prevState)} />
            {isOpen &&
                <div className="dropdown--container">
                    {chainList.map(chain =>
                        <NetworkDropdownItem
                            imageURL={chain.image}
                            name={chain.chainName}
                            chainId={chain.chainId}
                            setNetworkName={setNetworkName}
                            setNetworkImage={setNetworkImage}
                            setIsOpen={setIsOpen}
                        />
                    )
                    }
                </div>
            }
        </div>
    )
}

export default DropdownMenu;
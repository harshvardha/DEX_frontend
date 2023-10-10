import { useContext } from "react";
import { SwapContext } from "../../context/SwapContext";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import "./Header.css";

const Header = () => {
    const { accountAddress, connectWallet } = useContext(SwapContext);

    return (
        <div className="header">
            <DropdownMenu />
            <button className="connectButton" onClick={connectWallet}>{accountAddress ? accountAddress.substring(0, 4) + "..." + accountAddress.substring(36) : "Connect"}</button>
        </div>
    )
}

export default Header;
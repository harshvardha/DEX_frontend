import { useContext } from "react";
import { SwapContext } from "../../context/SwapContext";
import "./SellBuy.css";
import { IoIosArrowDropdown } from "react-icons/io";

const SellBuy = ({
    setIsOpen,
    tokenTicker,
    tokenName,
    tokenImage,
    tokenType
}) => {

    const {
        tokenToSellAmount,
        tokenToBuyAmount,
        tokenToSellPrice,
        tokenToBuyPrice,
        ratioOfTokenPrices,
        setTokenToSellAmount,
        setTokenToBuyAmount,
        setRatioOfTokenPrices
    } = useContext(SwapContext);

    return (
        <div className="sellbuy">
            <div className="tokenAmount">
                <div className="token" onClick={() => setIsOpen(prevState => !prevState)}>
                    <img className="tokenLogo" src={tokenImage} alt="" />
                    <p>{tokenTicker}</p>
                    <IoIosArrowDropdown />
                </div>
                {tokenType === "sell" ? (
                    // calculating the amount of buy tokens whenever the sell token amount is changed
                    <input
                        className="tokenAmountInput"
                        required
                        type="number"
                        value={tokenToSellAmount}
                        onChange={(event) => {
                            const amount = event.target.value;
                            setTokenToSellAmount(Number(amount));
                            if (tokenToBuyPrice && tokenToSellPrice) {
                                const ratio = tokenToSellPrice / tokenToBuyPrice;
                                setRatioOfTokenPrices(ratio);
                                setTokenToBuyAmount(ratio * amount);
                            }
                        }}
                    />) : (
                    <p>{tokenToBuyAmount}</p>
                )
                }
            </div>
            <div className="tokenPrice">
                <p>{tokenName}</p>
                <p>{tokenType === "sell" ? tokenToSellPrice * tokenToSellAmount : tokenToBuyPrice * tokenToBuyAmount}</p>
            </div>
        </div>
    )
}

export default SellBuy;
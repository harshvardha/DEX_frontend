import { useState, useContext } from "react";
import "./Swap.css";
import { SwapContext } from "../../context/SwapContext";
import SellBuy from "../SellBuy/SellBuy";
import TokenDropdownItem from "../TokenDropdownItem/TokenDropdownItem";
import { AiOutlineArrowDown } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import tokenList from "../../tokenList.json";
import { tokenApiRequests } from "../../apiRequests";

const Swap = () => {
    const {
        getQuote,
        chainId,
        tokenToSellAddress,
        tokenToSellDecimals,
        tokenToBuyDecimals,
        tokenToBuyAddress,
        tokenToSellAmount,
        tokenToBuyAmount,
        accountAddress,
        setTokenToSellAddress,
        setTokenToBuyAddress,
        setTokenToSellAmount,
        setTokenToSellDecimals,
        setTokenToBuyDecimals,
        sendTransaction
    } = useContext(SwapContext);

    // open/close state manager for opening and closing of the selling select token dropdown
    const [isOpenSell, setIsOpenSell] = useState(false);

    // open/close state manager for opening and closing of the buying select token dropdown
    const [isOpenBuy, setIsOpenBuy] = useState(false);

    // token ticker(symbol) for the selling token
    const [tokenToSellTicker, setTokenToSellTicker] = useState("Select Token");

    // token ticker(symbol) for the buying token
    const [tokenToBuyTicker, setTokenToBuyTicker] = useState("Select Token");

    // name of the selling token
    const [tokenToSellName, setTokenToSellName] = useState("")

    // name of the buying token
    const [tokenToBuyName, setTokenToBuyName] = useState("");

    // imageURL of the selling token
    const [tokenToSellImage, setTokenToSellImage] = useState("");

    // imageURL of the buying token
    const [tokenToBuyImage, setTokenToBuyImage] = useState("");

    // slippage value can be selected through clicking on settings icon
    const [slippage, setSlippage] = useState();

    // open/close state manager for slippage popup
    const [isSlippageOpen, setIsSlippageOpen] = useState(false);

    // This function will reverse the selection of sell token and buy token
    // i.e sell token becomes buy token and vice-versa
    function reverseTokenSelection(event) {
        let temp;

        // reversing the images of selected tokens
        temp = tokenToSellImage;
        setTokenToSellImage(tokenToBuyImage);
        setTokenToBuyImage(temp);

        // reversing the tickers of selected tokens
        temp = tokenToSellTicker;
        setTokenToSellTicker(tokenToBuyTicker);
        setTokenToBuyTicker(temp);

        // reversing the names of selected tokens
        temp = tokenToSellName;
        setTokenToSellName(tokenToBuyName);
        setTokenToBuyName(temp);

        // calling getQuote function to update the quote value after reverse of tokens
        getQuote(null, tokenToBuyAddress, tokenToSellAddress, tokenToBuyAmount, tokenToBuyDecimals, tokenToSellDecimals);

        // reversing the decimals of the selected tokens
        temp = tokenToSellDecimals;
        setTokenToSellDecimals(tokenToBuyDecimals);
        setTokenToBuyDecimals(temp);

        // reversing the addressess of selected tokens
        temp = tokenToSellAddress;
        setTokenToSellAddress(tokenToBuyAddress);
        setTokenToBuyAddress(temp);

        // making buy amount sell amount
        setTokenToSellAmount(tokenToBuyAmount);

    }

    const swapTokens = async (event) => {
        // function to initiate the swapping of tokens
        event.preventDefault();
        try {

            // checking for 1inch smart contract selling token allowance
            console.log(chainId);
            const allowance = await tokenApiRequests.getTokenAllowance(tokenToSellAddress, accountAddress, chainId);
            console.log(`allowance: ${JSON.stringify(allowance)}`);
            if (allowance.data.allowance === "0") {
                // getting 1inch smart contract approved to spend selling token if it is not approved to
                const approve = await tokenApiRequests.getTransactionDetails(tokenToSellAddress, tokenToSellAmount, chainId)
                console.log(`approve: ${JSON.stringify(approve)}`);
                // getting transaction details for swapping tokens transactions
                console.log(`slippage: ${typeof slippage}`);
                const transaction = await tokenApiRequests.swapTokens(tokenToSellAddress, tokenToBuyAddress, tokenToSellAmount, accountAddress, slippage, chainId);
                console.log(`transaction details: ${JSON.stringify(transaction)}`);

                // sending transaction details to metamask wallet to confirm the transaction
                sendTransaction(transaction)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="swap">
                <div className="swap--header">
                    <p>Swap</p>
                    <CiSettings onClick={() => setIsSlippageOpen(prevState => !prevState)} />
                    {isSlippageOpen &&
                        <div className="slippage">
                            <div className="slippagePercents">
                                <input
                                    type="radio"
                                    id="0.5"
                                    name="slippagePercent"
                                    value={"0.5"}
                                    onClick={(event) => setSlippage(event.target.value)}
                                />
                                <label htmlFor="0.5">0.5%</label>
                            </div>
                            <div className="slippagePercents">
                                <input
                                    type="radio"
                                    id="2.5"
                                    name="slippagePercent"
                                    value={"2.5"}
                                    onClick={(event) => setSlippage(event.target.value)}
                                />
                                <label htmlFor="2.5">2.5%</label>
                            </div>
                            <div className="slippagePercents">
                                <input
                                    type="radio"
                                    id="5.0"
                                    name="slippagePercent"
                                    value={"5.0"}
                                    onClick={(event) => setSlippage(event.target.value)}
                                />
                                <label htmlFor="5.0">5.0%</label>
                            </div>
                        </div>
                    }
                </div>
                <div className="swap--main">
                    <div className="swap--main--sell">
                        <h3 style={{ marginLeft: "1rem" }}>You Sell</h3>
                        <SellBuy
                            isOpen={isOpenSell}
                            setIsOpen={setIsOpenSell}
                            tokenTicker={tokenToSellTicker}
                            tokenName={tokenToSellName}
                            tokenImage={tokenToSellImage}
                            tokenType="sell"
                        />
                    </div>
                    <div className="swap--main--buy">
                        <h3 style={{ marginLeft: "1rem" }}>You Buy</h3>
                        <SellBuy
                            isOpen={isOpenBuy}
                            setIsOpen={setIsOpenBuy}
                            tokenTicker={tokenToBuyTicker}
                            tokenName={tokenToBuyName}
                            tokenImage={tokenToBuyImage}
                            tokenType="buy"
                        />
                    </div>
                </div>
                <button className="reverse" onClick={reverseTokenSelection}><AiOutlineArrowDown style={{ marginTop: "2px" }} /></button>
                <div className="swap--transact">
                    <button className="swapButton" onClick={swapTokens} disabled={!accountAddress || !tokenToSellAmount || !tokenToBuyAmount}>Swap</button>
                </div>
            </div>
            {(isOpenSell || isOpenBuy) &&
                <div className="modal">
                    <div className="tokenList">
                        <div className="tokenListHeader">
                            <h2 style={{ marginLeft: "auto", marginRight: "auto" }}>Select Token</h2>
                            <AiOutlineClose onClick={() => isOpenSell ? setIsOpenSell(!isOpenSell) : setIsOpenBuy(!isOpenBuy)} />
                        </div>
                        <div className="tokens">
                            {tokenList.map(token => <TokenDropdownItem
                                imageURL={token.img}
                                name={token.name}
                                tokenAddress={token.address[chainId]}
                                tokenType={isOpenSell ? "sell" : "buy"}
                                setTokenToSellTicker={setTokenToSellTicker}
                                setTokenToBuyTicker={setTokenToBuyTicker}
                                setTokenToSellName={setTokenToSellName}
                                setTokenToBuyName={setTokenToBuyName}
                                setIsOpenSell={setIsOpenSell}
                                setIsOpenBuy={setIsOpenBuy}
                                setTokenToBuyImage={setTokenToBuyImage}
                                setTokenToSellImage={setTokenToSellImage} />
                            )}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Swap;
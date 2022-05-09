import { REACT_APP_ALCHEMY_KEY, CONTRACT_ADDRESS } from "../config";

const alchemyKey = REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = CONTRACT_ADDRESS;

export const kickstarterContract = new web3.eth.Contract(contractABI, contractAddress);

export const loadProject = async () => {
    const project = await kickstarterContract.methods.project().call();
    return project;
}


export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "Peněženka úspěšně připojena.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            Musíte si do prohlížeče nainstalovat Metamask, virtuální Ethereum peněženku.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "Peněženka úspěšně připojena.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊Připojte si Metamask peněženku pomocí tlačítka vpravo nahoře.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            Musíte si do prohlížeče nainstalovat Metamask, virtuální Ethereum peněženku.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const donate = async (address, amount) => {
    if (!window.ethereum || address === null) {
        return {
            status:
                "🦊 Připojte si Metamask peněženku pomocí tlačítka vpravo nahoře."
        };
    }

    if (amount <= 0) {
        return {
            status: "❌ Hodnota musí být kladná."
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: contractAddress, 
        from: address, 
        data: kickstarterContract.methods.donate(amount).encodeABI(),
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        Podívejte se na status své transakce na Etherscanu!
                    </a>
                </span>
            ),
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
}

export const claim = async (address) => {
    if (!window.ethereum || address === null) {
        return {
            status:
                "🦊 Připojte si Metamask peněženku pomocí tlačítka vpravo nahoře."
        };
    }

    let projectOwnerAddress = await this.loadProject().owner;

    if (address != projectOwnerAddress) {
        return {
            status:
                "❌ Pro vyzvednutí částky musíte být vlastník kontraktu."
        }
    }

    //set up transaction parameters
    const transactionParameters = {
        to: address,
        from: contractAddress,
        data: kickstarterContract.methods.claim().encodeABI(),
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        Podívejte se na status své transakce na Etherscanu!
                    </a>
                </span>
            ),
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
}

export const refund = async (address) => {
    if (!window.ethereum || address === null) {
        return {
            status:
                "🦊 Připojte si Metamask peněženku pomocí tlačítka vpravo nahoře."
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: address,
        from: contractAddress,
        data: kickstarterContract.methods.getRefund().encodeABI(),
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        Podívejte se na status své transakce na Etherscanu!
                    </a>
                </span>
            ),
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
}


import Web3 from 'web3'

import ERC20 from '../artifacts/ERC20.json'
import BASE from '../artifacts/Base.json'
import ROUTER from '../artifacts/Router_Vether.json'
import POOLS from '../artifacts/Pool_Vether.json'
import UTILS from '../artifacts/Utils_Vether.json'
import DAO from '../artifacts/Dao_Vether.json'

const net = 'MAIN';

export const ETH_ADDR = '0x0000000000000000000000000000000000000000'
export const BASE_ADDR = net === 'KOVAN' ? '0xdA9e97139937BaD5e6d1d1aBB4C9Ab937a432B7C' : '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279'
export const UTILS_ADDR = net === 'KOVAN' ? '0xec2fA91989e335F616177e4F3A233a69755a5f80' :'0x0f216323076dfe029f01B3DeB3bC1682B1ea8A37'
export const DAO_ADDR = net === 'KOVAN' ? '0xCc44719a8bB550505E51BfB38387766eb8fbf16D' : '0xBDeeE633ABC60660d29a5dA7AD414D6A75754d12'
export const ROUTER_ADDR = net === 'KOVAN' ? '0xDFBB81D71d5237c17257827e6e62F9764843a462' : '0xe16e64Da1338d8E56dFd8355Ba7642D0A79e253c'

export const BASE_ABI = BASE.abi
export const ROUTER_ABI = ROUTER.abi
export const POOLS_ABI = POOLS.abi
export const ERC20_ABI = ERC20.abi
export const UTILS_ABI = UTILS.abi
export const DAO_ABI = DAO.abi

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545")
}
export const getExplorerURL = () => {
    return "https://explorer.binance.org/smart-testnet/"
}
export const getAccountArray = async () => {
    var web3_ = getWeb3()
    var accounts = await web3_.eth.getAccounts()
    return accounts
}

export const getBNBBalance = async (acc) => {
    var web3_ = getWeb3()
    var bal_ = await web3_.eth.getBalance(acc)
    return bal_
}

export const getTokenContract = (address) => {
    var web3 = getWeb3()
    return new web3.eth.Contract(ERC20_ABI, address)
}

export const getTokenSymbol = async (address) => {
    var contractToken = getTokenContract(address)
    return await contractToken.methods.symbol().call()
}
export const getTokenName = async (address) => {
    var contractToken = getTokenContract(address)
    return await contractToken.methods.name().call()
}

export const getUtilsContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(UTILS_ABI, UTILS_ADDR)
}

export const getBaseContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(BASE_ABI, BASE_ADDR)
}

export const getPoolsContract = (address) => {
    var web3 = getWeb3()
    return new web3.eth.Contract(POOLS_ABI)
}

export const getRouterContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(ROUTER_ABI, ROUTER_ADDR)
}

export const getDaoContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(DAO_ABI, DAO_ADDR)
}

// Get just an array of tokens that can be upgrade
// export const getAssets = async () => {
//     var contract = getBaseContract()
//     let assetArray = await contract.methods.allAssets().call()
//     console.log({ assetArray })
//     return assetArray
// }

// Build out Asset Details, as long as have balance
export const getTokenDetails = async (address, assetArray) => {
    let assetDetailsArray = []
    for (let i = 0; i < assetArray.length; i++) {
        let utilsContract = getUtilsContract()
        let assetDetails = await utilsContract.methods.getTokenDetailsWithMember(assetArray[i], address).call()
        if(+assetDetails.balance > 0){
            assetDetailsArray.push(assetDetails)
        }
    }
    console.log({ assetDetailsArray })
    return assetDetailsArray
}

// Filter tokens for eligiblity to upgrade
export const getEligibleAssets = async (address, assetDetailsArray) => {
    const eligibleAssetArray = assetDetailsArray.find((item) => !item.hasClaimed)
    console.log({ eligibleAssetArray })
    return eligibleAssetArray
}

export const getListedTokens = async () => {
    var contract = getUtilsContract()
    let tokenArray = []
    try {
        tokenArray = await contract.methods.allTokens().call()
    } catch (err) {
        console.log(err)
    }
     
    console.log({ tokenArray })
    return tokenArray
}

// export const getAlltokens = async () => {
//     let assetArray = await getAssets()
//     let tokenArray = await getListedTokens()
//     let allTokens= assetArray.concat(tokenArray)
//     var sortedTokens = [...new Set(allTokens)].sort()
//     return sortedTokens;
// }
export const getListedPools= async () => {
    var contract = getUtilsContract()
    let poolArray = await contract.methods.allPools().call()
    console.log({ poolArray })
    return poolArray
}

export const getPoolsData = async (tokenArray) => {
    let poolsData = []
    for (let i = 0; i < tokenArray.length; i++) {
        poolsData.push(await getPool(tokenArray[i]))
    }
    console.log({ poolsData })
    return poolsData
}

export const getPool = async (address) => {
    var contract = getUtilsContract()
    let tokenDetails = await contract.methods.getTokenDetails(address).call()
    let poolDataRaw = await contract.methods.getPoolData(address).call()
    let apy = await contract.methods.getPoolAPY(address).call()
    let poolData = {
        'symbol': tokenDetails.symbol,
        'name': tokenDetails.name,
        'address': address,
        'price': +poolDataRaw.baseAmt / +poolDataRaw.tokenAmt,
        'volume': +poolDataRaw.volume,
        'baseAmt': +poolDataRaw.baseAmt,
        'tokenAmt': +poolDataRaw.tokenAmt,
        'depth': 2 * +poolDataRaw.baseAmt,
        'txCount': +poolDataRaw.txCount,
        'apy': +apy,
        'units': +poolDataRaw.poolUnits,
        'fees': +poolDataRaw.fees
    }
    return poolData
}

export const getPoolData = async (address, poolsData) => {
    const poolData = poolsData.find((item) => item.address === address)
    return (poolData)
}

export const getNetworkData = async (poolsData) => {
    let totalVolume = poolsData.reduce((accum, item) => accum+item.volume, 0)
    let totalStaked = poolsData.reduce((accum, item) => accum+item.depth, 0)
    let totalTx = poolsData.reduce((accum, item) => accum+item.txCount, 0)
    let totalRevenue = poolsData.reduce((accum, item) => accum+item.fees, 0)

    const networkData = {
        'pools' : poolsData.length,
        'totalVolume': totalVolume,
        'totalStaked': totalStaked,
        'totalTx': totalTx,
        'totalRevenue': totalRevenue,
    }
    console.log(networkData)
    return (networkData)
}

export const getGlobalData = async ()  => {
    var contract = getUtilsContract()
    let globalData = await contract.methods.getGlobalDetails().call()
    console.log({globalData})
    return globalData
}

export const getWalletData = async (address, tokenDetailsArray) => {
    var tokens = []
    console.log(tokenDetailsArray)
    var walletData = {
        'address': address,
        'tokens': tokens
    }
    tokens.push({
        'symbol': 'VETHER',
        'name': 'VETH',
        'balance': await getTokenContract(BASE_ADDR).methods.balanceOf(address).call(),
        'address': BASE_ADDR
    })

    for (let i = 0; i < tokenDetailsArray.length; i++) {
        var obj = tokenDetailsArray[i]
        tokens.push({
            'symbol': obj.symbol,
            'name': obj.name,
            'balance': obj.tokenAddress === ETH_ADDR ? await getBNBBalance(address) : await getTokenContract(obj.tokenAddress).methods.balanceOf(address).call(),
            'address': obj.tokenAddress
        })
    }
    console.log({ walletData })
    return walletData
}

export const getNewTokenData = async (token, member) => {
    var obj = await getUtilsContract().methods.getTokenDetailsWithMember(token, member).call()
    // var tokenBalance = await getTokenContract(token).methods.balanceOf(address).call()

    var tokenData = {
        'symbol': obj.symbol,
        'name': obj.name,
        'balance': obj.balance,
        'address': token
    }

    console.log(tokenData)
    return tokenData
}

export const getTokenData = async (address, walletData) => {
    const tokenData = walletData.tokens.find((item) => item.address === address)
    return (tokenData)
}

// Get all tokens on wallet that have a pool - swapping
export const filterWalletByPools = async (poolsData, walletData) => {
    const Wallet = walletData.tokens
    const pools = poolsData.map((item) => item.address)
    const wallet = Wallet.map((item) => item.address)
    const tokens = wallet.filter((item) => pools.includes(item) || item === BASE)
    return tokens
}

// Get all tokens on wallet that not have a pool - creating new pool
export const filterWalletNotPools = async (poolsData, walletData) => {
    const Wallet = walletData.tokens
    const pools = poolsData.map((item) => item.address)
    const wallet = Wallet.map((item) => item.address)
    const tokens = wallet.filter((item) => !pools.includes(item) && item !== BASE)
    return tokens
}

// Get all tokens that can be sold into the pool
export const filterTokensByPoolSelection = async (address, poolsData, walletData) => {
    const tokens = await filterWalletByPools(poolsData, walletData)
    const tokensByPool = tokens.filter((item) => item !== address)
    return tokensByPool
}

export const filterTokensNotPoolSelection = async (address, poolsData, walletData) => {
    const tokens = await filterWalletNotPools(poolsData, walletData)
    const tokensNotPool = tokens.filter((item) => item !== address)
    return tokensNotPool
}

export const getStakesData = async (member, poolArray) => {
    let stakesData = []
    for (let i = 0; i < poolArray.length; i++) {
        stakesData.push(await getStake(member, poolArray[i]))
    }
    console.log({ stakesData })
    return stakesData
}

export const getStake = async (member, token) => {
    var contract = getUtilsContract()
    let poolAddress = await contract.methods.getPool(token).call()
    let tokenDetails = await contract.methods.getTokenDetails(poolAddress).call()
    let memberData = await contract.methods.getMemberShare(token, member).call()
    let stakeUnits = await getTokenContract(poolAddress).methods.balanceOf(member).call()
    let locked = await getDaoContract().methods.mapMemberPool_Balance(member, poolAddress).call()
    let stake = {
        'symbol': tokenDetails.symbol,
        'name': tokenDetails.name,
        'address': token,
        'poolAddress':poolAddress,
        'baseAmt': memberData.baseAmt,
        'tokenAmt': memberData.tokenAmt,
        'locked': locked,
        'units': stakeUnits,
        'share': +stakeUnits / +tokenDetails.totalSupply
    }
    return stake
}

export const getStakeData = async (address, stakesData) => {
    const stakeData = stakesData.find((item) => item.address === address)
    return (stakeData)
}

export const getRewards = async (member) => {
    let locked = await getDaoContract().methods.calcCurrentReward(member).call()
    return locked;
}

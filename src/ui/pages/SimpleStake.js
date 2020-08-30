
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { BASE_ADDR, ROUTER_ADDR, ETH_ADDR, getTokenContract, getRouterContract, 
    getTokenDetails, getTokenData } from '../../client/web3'


import { Button, Row, Col, message, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { paneStyles, colStyles } from '../components/styles'
import { AssetTable } from '../layout/WalletDrawer'
var utils = require('ethers').utils;

const SimpleStake = (props) => {

    const context = useContext(Context)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)

    const [listed, setListed] = useState(false);

    const [tokenFrom, setAssetFrom] = useState(BASE_ADDR);
    const [tokenTo, setAssetTo] = useState('0x0000000000000000000000000000000000000000');
    const [approval, setApproval] = useState(false)
    const [approvalS, setApprovalS] = useState(false)
    const [tokenData, setTokenData] = useState({
        'symbol': 'BASE',
        'name': 'BASEN PROTOCOL TOKEN',
        'balance': 0,
        'address': BASE_ADDR
    })
    const [tokenAmount, setTokenAmount] = useState(false);
    const [baseAmount, setBaseAmount] = useState(false);

    const [startTx, setStartTx] = useState(false);
    const [endTx, setEndTx] = useState(false);

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {
        let tokenDetails = await getTokenData(tokenFrom, context.walletData)
        setTokenData(tokenDetails)
        checkApproval(BASE_ADDR)
    }

    const changeToken = (e) => {
        // console.log(e)
        setAssetFrom(e.target.value)
        setApproval(false)
        e.target.value === ETH_ADDR ? setApproval(true) : checkApproval(e.target.value)
        // let tokenDetails = await getTokenData(tokenFrom, context.walletData)
        // setTokenData(tokenDetails)
        console.log(e.target.value)
        // checkListed(e.target.value)
        // setSwapData(getSwapData(tokenDetails))
    }

    const checkListed = async (address) => {
        var contract = getRouterContract()
        let pool = (await contract.methods.getPool(address).call())
        console.log({pool})
        if(pool === '0x0000000000000000000000000000000000000000'){
            setListed(false)
        } else {
            setListed(true)
        }
    }

    // const getSwapData = (details) => {
    //     return {
    //         'output': '100000000000000000',
    //         'slip': 0.01,
    //     }
    // }

    const checkApproval = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.walletData.address, ROUTER_ADDR).call()
        console.log(approval, address)
        if (+approval > 0) {
            address === BASE_ADDR ? setApprovalS(true) : setApproval(true)
        }
    }

    const approveBase = async () => {
        approveToken(BASE_ADDR)
    }

    const approve = async () => {
       approveToken(tokenFrom)
    }

    const approveToken = async (address) => {
        const contract = getTokenContract(address)
        // (utils.parseEther(10**18)).toString()
        const supply = '1000000000000000000000000'
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
        checkApproval(address)
    }

    const changeTokenAmount = (e) => {
        setTokenAmount((utils.parseEther(e.target.value)).toString())
    }
    const changeBaseAmount = (e) => {
        setBaseAmount((utils.parseEther(e.target.value)).toString())
    }

    const create = async () => {
        setStartTx(true)
        console.log(baseAmount, tokenAmount, tokenFrom)
        let contract = getRouterContract()
        await contract.methods.createPool(baseAmount, tokenAmount, tokenFrom).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
        setStartTx(false)
        setEndTx(true)
        // context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray) })
    }



    const indentStyles = {
        margin: 100,
        minHeight: 400
    }

    const colStylesInner = {
        padding: 20
    }

    return (
        <div>
            <Row style={indentStyles}>
                <Col xs={24}>

                    <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                        <Row>
                                <Col xs={12} style={colStylesInner}>
                                <h1>Enter Token To Stake</h1>
                                    <Input
                                        onChange={changeToken}
                                        placeholder={'Enter BEP2E Asset Address'}
                                    >
                                    </Input>
                                </Col>
                                <Col>
                                <h2>Token is {listed ? "true" : "false"}</h2>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} style={colStylesInner}>
                                    
                                    <h4>Balance: {utils.formatEther(tokenData?.balance, { commify: true })}</h4>
                                    <Input
                                        onChange={changeTokenAmount}
                                        placeholder={'Enter Amount of Token'}
                                    >
                                    </Input>
                                    <br/><br/>
                                    {!approval &&
                                        <Button onClick={approve} type={'secondary'}>APPROVE</Button>
                                    }
                                    {approval && !startTx &&
                                        <Button onClick={create} type={'primary'} >CREATE</Button>
                                    }
                                    {approval && startTx && !endTx &&
                                        <Button onClick={create} type={'primary'} icon={<LoadingOutlined />}>CREATE</Button>
                                    }
                                </Col>
                                <Col xs={12} style={colStylesInner}>
                                <h4>Balance: {utils.formatEther(tokenData?.balance, { commify: true })}</h4>
                                    <Input
                                        onChange={changeBaseAmount}
                                        placeholder={'Enter Amount of Base'}
                                    >
                                    </Input>
                                    <br/><br/>
                                    {!approvalS &&
                                        <Button onClick={approveBase} type={'secondary'}>APPROVE</Button>
                                    }
                                </Col>
                            </Row>

                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} style={colStylesInner}>
                            <h1>Tokens on your wallet</h1>
                            {context.connected &&
                                <AssetTable />
                            }
                        </Col>
                        <Col xs={12} style={colStylesInner}>
                           
                        </Col>
                    </Row>



                </Col>

            </Row>



        </div>
    )


}

export default SimpleStake
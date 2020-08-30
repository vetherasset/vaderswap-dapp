import React, { useEffect, useState, useContext} from 'react'
import { Context } from '../../context'
import {Link} from 'react-router-dom'
import { Row, Col } from 'antd'
import { HR, H1, H2, Text, LabelGroup, Button, Gap } from '../components/elements';
import { rowStyles } from '../components/styles'

import {getRouterContract} from '../../client/web3'
import { formatUSD, convertFromWei } from '../../utils'

const Overview = (props) => {
    const context = useContext(Context)

    const [networkData, setNetworkData] = useState({
        'pools' : 0,
        'totalVolume': 0,
        'totalStaked': 0,
        'totalTx': 0,
        'totalRevenue': 0,
    })

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    const getData = async () => {

        var contract = getRouterContract()
        let BASE = await contract.methods.BASE().call() 
        console.log(BASE)

        // let networkData = await getNetworkData(context.poolsData)
        // context.setContext({'networkData': networkData})
        // setNetworkData(networkData)
    }

    // const volume = () => {
    //     return `$${().toFixed(2)}`
    // }


    return (
        <div>
            <H1>Overview</H1>
            <HR />
            <Gap/>
            <h1>

            </h1>
            {/* <Row  style={rowStyles}>
                <Col xs={3}>
                    <LabelGroup size={24} label={'POOLS'} element={networkData?.pools} />
                </Col>
                <Col xs={6}>
                    <LabelGroup size={24}  label={'VOLUME'} element={formatUSD(convertFromWei(networkData?.totalVolume), context.basenPrice)} />
                </Col>
                <Col xs={3}>
                    <LabelGroup size={24}  label={'TOTAL TX'} element={networkData?.totalTx}/>
                </Col>
                <Col xs={6}>
                    <LabelGroup size={24}  label={'TOTAL STAKED'} element={formatUSD(convertFromWei(networkData?.totalStaked), context.basenPrice)} />
                </Col>
                <Col xs={6}>
                    <LabelGroup size={24}  label={'TOTAL REVENUE'} element={formatUSD(convertFromWei(networkData?.totalRevenue), context.basenPrice)} />
                </Col>
            </Row> */}
            {/* <Gap/>
            <H2>POOLS</H2><br></br>
            <Text>You can provide liquidity and trade across pools</Text><br/>
            <Link to={"/pools"}><Button type="primary">POOLS</Button></Link>
            <Gap></Gap> */}
            {/* <H2>CDPs</H2><br></br>
            <Text>You can create debt from pooled tokens</Text><br/>
            <Link to={"/pools"}><Button type="primary">CDPS</Button></Link> */}

        </div>
    )
}

export default Overview
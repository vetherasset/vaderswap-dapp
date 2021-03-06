import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from 'antd';
import './App.css';
import 'antd/dist/antd.css'
import { Colour } from './ui/components/elements'

import Headbar from './ui/layout/Headbar'
// import Footer from './ui/layout/Footer'

// import SimpleSwap from './ui/pages/SimpleSwap'
// import SimpleStake from './ui/pages/SimpleStake'
// import Upgrade from './ui/pages/Upgrade'
// import Dao from './ui/pages/DAO'
// import Earn from './ui/pages/Earn'

// import Overview from './ui/pages/Overview'
import Pools from './ui/pages/Pools'
//  import CDPs from './ui/pages/CDPs'
// import PriceAnchor from './ui/pages/PriceAnchor'
// import About from './ui/pages/About'

import Stake from './ui/pages/NewStake'
import Swap from './ui/pages/NewSwap'
import CreatePool from './ui/pages/CreatePool'
// import ManageCDP from './ui/pages/manageCDP'
// import OpenCDP from './ui/pages/openCDP'
import { ContextProvider } from './context'

const { Content } = Layout;

const contentStyles = {
	background: Colour().white,
	color: '#000',
	// paddingLeft: 30,
	// paddingTop: 20,
	// paddingRight: 30,
	// paddingBottom: 50,
	padding:20,
	// margin:40
	// minHeight:'calc(100vh - 70px)'
}

const App = () => {
	return (
		<Router>
			<div>
				<ContextProvider>
					<Layout style={{ height: "100vh", background:Colour().offwhite }}>
						<Headbar />
						<Content style={contentStyles}>
							<Switch>
								<Route path="/" exact component={Pools} />
								{/* <Route path="/upgrade" exact component={Upgrade} /> */}
								{/* <Route path="/swap" exact component={SimpleSwap} />
								<Route path="/stake" exact component={SimpleStake} /> */}
								{/* <Route path="/dao" exact component={Dao} /> */}
								{/* <Route path="/earn" exact component={Earn} /> */}
								<Route path="/pools" exact component={Pools} />
								{/* <Route path="/CDPs" exact component={CDPs} /> */}
								{/* <Route path="/anchor" exact component={PriceAnchor} /> */}
								{/* <Route path="/about" exact component={About} /> */}
								<Route path="/pool/stake" exact component={Stake} />
								<Route path="/pool/swap" exact component={Swap} />
								{/* <Route path="/cdp/manageCDP" exact component={ManageCDP}/> */}
								{/* <Route path="/cdp/openCDP" exact component={OpenCDP}/> */}
								<Route path="/pool/create" exact component={CreatePool} />
							</Switch>
						</Content>
						{/* <Footer style={{height:50}}/> */}
					</Layout>
				</ContextProvider>
			</div>
		</Router>
	);
}

export default App;

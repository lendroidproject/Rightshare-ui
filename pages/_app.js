import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import ReactGA from 'react-ga'
import { ThemeProvider } from 'styled-components'
import RightshareJS from 'rightshare-js'

import Web3 from 'web3'
import Fortmatic from 'fortmatic'

import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import configureStore from '~store'

import Layout from '~layouts'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const MAIN_NETWORK = process.env.MAIN_NETWORK
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY
const FORTMATIC_API_KEY = process.env.FORTMATIC_API_KEY

const theme = {
  primary: 'default',
}

class RightshareApp extends App {
  state = {
    address: '',
    balance: '',
    addressTimer: null,
    balanceTimer: null,
    provider: 'metamask',
    fortmatic: null,
  }

  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps }
  }

  componentDidMount() {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', 'UA-158350923-2')

    ReactGA.initialize(process.env.GA_TRACKING_ID, {
      gaOptions: {
        js: Date.now(),
        config: process.env.GA_TRACKING_ID,
      },
    })

    const fortmatic = new Fortmatic(FORTMATIC_API_KEY)
    this.setState({ fortmatic }, async () => {
      if (window.ethereum) {
        ethereum.autoRefreshOnNetworkChange = false
        window.web3 = new Web3(window.ethereum)
        if (ethereum._metamask.isEnabled() && (await ethereum._metamask.isUnlocked())) {
          this.initMetamask()
        } else {
          ethereum.enable().then(() => this.initMetamask())
        }
      } else {
        window.web3 = new Web3(fortmatic.getProvider())
        this.initMetamask()
      }
    })
  }

  componentWillUnmount() {
    this.releaseTimer()
  }

  handleProvider(type) {
    const { provider, fortmatic, address, balance } = this.state
    const { store } = this.props
    if (type === provider) return
    this.releaseTimer()
    const { methods } = store.getState()
    switch (type) {
      case 'fortmatic':
        window.web3 = new Web3(fortmatic.getProvider())
        methods.web3.setProvider(fortmatic.getProvider())
        web3.eth.getAccounts((err, accounts) => {
          if (!err) {
            this.setState({ provider: 'fortmatic' }, () => this.initMetamask({ address: accounts[0] }))
          } else {
            window.web3 = new Web3(window.ethereum)
            this.setState({ provider: 'metamask' }, () => this.initMetamask({ address, balance }))
          }
        })
        break
      default:
        this.setState({ provider: 'metamask' }, () => this.initMetamask())
        window.web3 = new Web3(window.ethereum)
        methods.web3.setProvider(window.ethereum)
        break
    }
  }

  releaseTimer() {
    const { addressTimer, balanceTimer } = this.state
    if (addressTimer) clearTimeout(addressTimer)
    if (balanceTimer) clearTimeout(balanceTimer)
  }

  initMetamask(defaults) {
    const addressTimer = setInterval(async () => {
      const { address } = this.state
      const [selectedAddress] = await web3.eth.getAccounts()
      if (address !== selectedAddress) {
        return this.saveMetamask({ address: selectedAddress }, () => this.getBalance())
      }
    }, 1 * 1000)
    const balanceTimer = setInterval(async () => {
      const { address } = this.state
      const [selectedAddress] = await web3.eth.getAccounts()
      if (address !== selectedAddress) {
        return this.saveMetamask({ address: selectedAddress }, () => this.getBalance())
      }
      this.getBalance()
    }, 15 * 1000)
    this.saveMetamask({ address: '', balance: 0, balanceTimer, addressTimer, ...defaults }, () => this.getBalance())

    const { store } = this.props
    if (!this.props.store.getState().web3) {
      const handleMessage = (type, payload, error) => {
        store.dispatch({
          type,
          payload,
          error,
        })
      }
      const library = RightshareJS(web3.currentProvider, {
        onEvent: handleMessage,
        apiURL: MAIN_NETWORK ? 'https://api.opensea.io/api/v1' : 'https://rinkeby-api.opensea.io/api/v1',
        apiKey: OPENSEA_API_KEY,
        addresses: MAIN_NETWORK
          ? {
              FRight: '0x63A52a41df33A40d5E39d6cEB4EEBD1d47ACc1b3',
              IRight: '0xf61a634C4a8f1778A06202F6a1E5751ED0fBCdEa',
              RightsDao: '0x3B0841ab834052f3DBd21a537f7886388d09A114',
            }
          : {
              FRight: '0x76e78270d2117689864Bb5f94DAD7192BCd42298',
              IRight: '0x006fE254Ee6c7D0565c5D688D9485699a715C8AA',
              RightsDao: '0x0dF99b67006cbDF410F88E652C0DFF625Ee65cb1',
            },
      })
      store.dispatch({
        type: 'INIT_CONTRACTS',
        payload: library,
      })
    } else {
      //
    }
  }

  saveMetamask(metamask, callback) {
    const { store } = this.props
    if (metamask.address !== undefined) {
      store.dispatch({
        type: 'METAMASK_ADDRESS',
        payload: metamask,
      })
    } else if (metamask.balance !== undefined) {
      store.dispatch({
        type: 'METAMASK_BALANCE',
        payload: metamask.balance,
      })
    }
    this.setState(metamask, callback)
  }

  getBalance() {
    const { address, balance: origin } = this.state
    if (address) {
      web3.eth.getBalance(address).then((res) => {
        const balance = Number(web3.utils.fromWei(res))
        if (origin !== balance) this.saveMetamask({ balance })
      })
    }
  }

  render() {
    const {
      props: { Component, pageProps, store },
      state: { provider },
    } = this

    return (
      <>
        <Head>
          <title>Rightshare</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta charSet="utf-8" />
          {process.env.NODE_ENV === 'production' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KJNBZPW');`,
              }}
            />
          )}
          <link href="https://necolas.github.io/normalize.css/latest/normalize.css" rel="stylesheet" type="text/css" />
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
            rel="stylesheet"
            type="text/css"
          />
          <link href="/fonts/avenir-lt-std/style.css" rel="stylesheet" type="text/css" />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              body {
                display: flex;
                line-height: 1.5;
                background: url('/bg.jpg');
                background-color: #c2a061;
                font-family: "Open Sans", sans-serif;
              }

              body * {
                box-sizing: border-box;
              }

              button {
                border: 0;
                cursor: pointer;
                margin-top: 12px;
                background: #232160;
                color: white;
                padding: 15px 20px;

                font-size: 16px;
                // text-transform: uppercase;
                border-radius: 8px;

                font-size: 14px;
                padding: 13px 15px;
                border-radius: 5px;
              }

              p {
                margin: 8px 0;
              }

              button:disabled {
                background: #23216099;
                cursor: not-allowed;
              }

              #__next {
                width: 100%;
              }
            `,
            }}
          />
          <link rel="apple-touch-icon" sizes="57x57" href="/manifest/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/manifest/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/manifest/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/manifest/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/manifest/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/manifest/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/manifest/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/manifest/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/manifest/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/manifest/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/manifest/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/manifest/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/manifest/favicon-16x16.png" />
          <link rel="manifest" href="/manifest/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/manifest/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Layout mainNetwork={MAIN_NETWORK} provider={provider} onProvider={this.handleProvider.bind(this)}>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ThemeProvider>
      </>
    )
  }
}

export default withRedux(configureStore)(RightshareApp)

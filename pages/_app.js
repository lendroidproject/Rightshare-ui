import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import ReactGA from 'react-ga'
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

const themes = {
  primary: `
    --color-bg1: #4000B4;
    --color-grad1: linear-gradient(to bottom, #4000B4 0%, #7E0783 100%);
    --color-bg2: #180259;
    --color-grad2: linear-gradient(to bottom, #180259 0%, #140249 100%);
    --color-bg3: #FF00F1;
    --color-grad3: linear-gradient(to bottom, #FF00F1 0%, #9700FF 100%);
    --color-tab: #FF00F1;
    --color-tab-grad: linear-gradient(to bottom, #FF00F1 0%, #9700FF 100%);
    --color-bg4: #18058D;
    --color-grad4: linear-gradient(to bottom, #18058D 0%, #000000 100%);
    --color-bg5: #1189FF;
    --color-grad5: linear-gradient(to bottom, #1189FF 0%, #5704ED 100%);
    --color-bg6: #00EEAE;
    --color-grad6: linear-gradient(to bottom, #00EEAE 0%, #00C6D9 100%);
    --color-bg7: #F900F9;
    --color-grad7: linear-gradient(to bottom, #F900F9 0%, #890089 100%);
    --color-bg8: #4402D4;
    --color-grad8: linear-gradient(to bottom, #4402D4 0%, #000000 100%);
    --color-text: #FFFFFF;
    --color-text-black: #FFFFFF;
    --color-text-head: #FFFFFF;
    --color-bg: #000000;
    --color-bg-panel: #000000;
    --color-bg-black: #000000;
    --color-bg-input: transparent;
    --color-primary: #9700FF;
    --color-secondary: #7D0884;
    --color-highlight: #00FFDF;
    --color-border: #7E0782;
    --color-border-grey: #FFFFFF;
    --color-thick: #5B00FF;
    --color-dark: #252525;
    --color-grey: #393939;
    --color-line: #552BA1;
    --color-link: #00C9DC;
    --color-purple: #B800FF;
    --color-input: #82008F;
    --color-blue: #4F00FF;
    --color-disable: #4E4E4E;
    --box-shadow1: inset 3px 3px 4px 0 rgba(0, 0, 0, 0.5);
    --box-shadow2: inset 0 0 3px 0 #202124, -5px -5px 13px 0 #232239, 6px 6px 13px 0 #121120;
    --box-shadow3: inset 0 0 3px 0 #202124, -5px -5px 13px 0 #232239;
    --box-shadow4: -3px -3px 12px 0 #232239;
    --box-shadow-modal: inset 2px 2px 6px 6px rgba(0,0,0,0.5), 13px 0 20px 0 rgba(0,0,0,0.03);
    --filter-invert: invert(0);
    --modal-bg: rgba(0, 0, 0, 0.91);
    --color-green: #7fff67;
  `,
  dark: `
    --color-bg1: #4000B4;
    --color-grad1: linear-gradient(to bottom, #57DE87 0%, #53DBFD 100%);
    --color-bg2: white;
    --color-grad2: white;
    --color-bg3: #12161E;
    --color-grad3: #12161E;
    --color-tab: #1991EB;
    --color-tab-grad: #1991EB;
    --color-bg4: #E3E3E3;
    --color-grad4: #E3E3E3;
    --color-bg5: #12265E;
    --color-grad5: #12265E;
    --color-bg6: #12265E;
    --color-grad6: #12265E;
    --color-bg7: #12265E;
    --color-grad7: #12265E;
    --color-bg8: #F7F7F7;
    --color-grad8: #F7F7F7;
    --color-text: #000000;
    --color-text-black: #FFFFFF;
    --color-text-head: #12265E;
    --color-bg: #FFFFFF;
    --color-bg-panel: #F7F7F7;
    --color-bg-black: #12265E;
    --color-bg-input: #F7F7F7;
    --color-primary: #CCCCCC;
    --color-secondary: #7D0884;
    --color-highlight: #000;
    --color-border: #1991EB;
    --color-border-grey: #CCCCCC;
    --color-thick: #CCCCCC;
    --color-dark: #CCCCCC;
    --color-grey: #CCCCCC;
    --color-line: #CCCCCC;
    --color-link: #12265E;
    --color-purple: #12265E;
    --color-input: #CCCCCC;
    --color-blue: #4F00FF;
    --color-disable: #4E4E4E;
    --filter-invert: invert(1);
    --modal-bg: rgba(255, 255, 255, 0.98);
    --color-green: #218F04;
  `,
}

class RightshareApp extends App {
  state = {
    address: '',
    balance: '',
    addressTimer: null,
    balanceTimer: null,
    provider: 'metamask',
    fortmatic: null,
    loading: true,
    theme: 'primary',
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
    this.setState({
      loading: false,
      theme: localStorage.getItem('theme') || 'primary',
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
              FRight: '0x53a133EABab0220E5f06d59918796626Ab325043',
              IRight: '0x51dc3f98bE32CbeE0CD399500488Fc1254fa8689',
              RightsDao: '0xC47Af0d7D3B568db6A26Fbc5c0084100925F32Ac',
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

  handleTheme(theme) {
    localStorage.setItem('theme', theme)
    this.setState({ theme })
  }

  render() {
    const {
      props: { Component, pageProps, store },
      state: { provider, theme },
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
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              :root { ${themes[theme]} }

              body {
                font-family: 'Poppins', sans-serif;
                line-height: 1.5;
                background: var(--color-bg2);
                background: var(--color-grad2);
                min-height: 100vh;
              }

              body * {
                box-sizing: border-box;
              }

              a {
                cursor: pointer;
                color: var(--color-link);
              }

              *::-webkit-scrollbar {
                width: 3px;
                margin-left: 3px;
              }

              *::-webkit-scrollbar-track {
                background: var(--color-bg);
              }

              *::-webkit-scrollbar-thumb {
                border-radius: 5px;
                background-color: var(--color-text);
              }

              *::-webkit-scrollbar-thumb:hover {
                background: var(--color-primary);
              }

              input::-webkit-calendar-picker-indicator {
                opacity: 0;
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
        <Provider store={store}>
          <Layout mainNetwork={MAIN_NETWORK} provider={provider} onProvider={this.handleProvider.bind(this)}>
            <Component {...pageProps} onTheme={this.handleTheme.bind(this)} />
          </Layout>
        </Provider>
      </>
    )
  }
}

export default withRedux(configureStore)(RightshareApp)

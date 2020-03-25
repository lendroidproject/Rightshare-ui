import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import { ThemeProvider } from 'styled-components'
import RightshareJS from 'rightshare-js'

import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import configureStore from '~/store'

import Layout from '~/layouts'

const theme = {
  primary: 'default',
}

class RightshareApp extends App {
  state = {
    address: '',
    balance: '',
    addressTimer: null,
    balanceTimer: null,
  }

  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps }
  }

  async componentDidMount() {
    if (window.ethereum) {
      if (ethereum._metamask.isEnabled() && (await ethereum._metamask.isUnlocked())) {
        this.initMetamask()
      } else {
        ethereum.enable().then(() => this.initMetamask())
      }
    }
  }

  componentWillUnmount() {
    const { addressTimer, balanceTimer } = this.state
    if (addressTimer) clearTimeout(addressTimer)
    if (balanceTimer) clearTimeout(balanceTimer)
  }

  initMetamask() {
    const addressTimer = setInterval(() => {
      const { address } = this.state
      if (address !== ethereum.selectedAddress) {
        return this.saveMetamask({ address: ethereum.selectedAddress }, () => this.getBalance())
      }
    }, 1 * 1000)
    const balanceTimer = setInterval(() => {
      const { address } = this.state
      if (address !== ethereum.selectedAddress) {
        return this.saveMetamask({ address: ethereum.selectedAddress }, () => this.getBalance())
      }
      this.getBalance()
    }, 15 * 1000)
    this.saveMetamask({ address: ethereum.selectedAddress, balanceTimer, addressTimer }, () => this.getBalance())

    const { store } = this.props
    store.dispatch({
      type: 'INIT_CONTRACTS',
      payload: RightshareJS(ethereum),
    })
  }

  saveMetamask(metamask, callback) {
    const { store } = this.props
    if (metamask.address) {
      store.dispatch({
        type: 'METAMASK_ADDRESS',
        payload: metamask.address,
      })
    }
    if (metamask.balance !== undefined) {
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
      web3.eth.getBalance(address, (err, res) => {
        if (!err) {
          const balance = Number(web3._extend.utils.fromWei(res))
          if (origin !== balance) this.saveMetamask({ balance })
        }
      })
    }
  }

  render() {
    const {
      props: { Component, pageProps, store },
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
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
            rel="stylesheet"
            type="text/css"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              body {
                display: flex;
                line-height: 1.5;
                background: url('/bg.png');
                background-color: #0a2c79;
                font-family: "Open Sans", sans-serif;
              }

              body * {
                color: white;
                box-sizing: border-box;
              }

              button {
                border: 0;
                cursor: pointer;
                margin-top: 12px;
                background: #0a2c79;
                color: white;
                border-radius: 4px;
                padding: 10px 20px;
              }

              p {
                margin: 8px 0;
              }

              button:disabled {
                background: #0a2c7999;
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
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ThemeProvider>
      </>
    )
  }
}

export default withRedux(configureStore)(RightshareApp)

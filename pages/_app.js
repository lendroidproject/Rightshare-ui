import React from 'react'
import Head from 'next/head'
import App from 'next/app'
import { ThemeProvider } from 'styled-components'

import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import configureStore from '~/store'

import Layout from '~/layouts'

const theme = {
  primary: 'default',
}

class LeaseNFTApp extends App {
  state = {
    address: '',
    balance: 0,
    addressTimer: null,
    balanceTimer: null,
    web3: null,
  }

  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps }
  }

  componentDidMount() {
    if (window.ethereum) {
      if (ethereum._metamask.isEnabled()) {
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
    const { address } = this.state
    const addressTimer = setInterval(() => {
      if (address !== ethereum.selectedAddress) {
        return this.setState({ address: ethereum.selectedAddress }, () => this.getBalance())
      }
    }, 1 * 1000)
    const balanceTimer = setInterval(() => {
      if (address !== ethereum.selectedAddress) {
        return this.setState({ address: ethereum.selectedAddress }, () => this.getBalance())
      }
      this.getBalance()
    }, 15 * 1000)
    this.setState({ address: ethereum.selectedAddress, balanceTimer, addressTimer }, () => this.getBalance())
  }

  getBalance() {
    const { address } = this.state
    if (address) {
      web3.eth.getBalance(address, (err, res) => {
        if (!err) {
          const balance = Number(web3._extend.utils.fromWei(res))
          this.setState({ balance })
        }
      })
    }
  }

  render() {
    const {
      props: { Component, pageProps, store },
      state: { address, balance },
    } = this

    return (
      <>
        <Head>
          <title>LeaseNFT UI</title>
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
          <link href="https://fonts.googleapis.com/css?family=Overpass" rel="stylesheet" type="text/css" />
          <style>
            {`
              body {
                display: flex;
                line-height: 1.5;
              }

              #__next {
                width: 100%;
              }
            `}
          </style>
        </Head>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Layout {...{ address, balance }}>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ThemeProvider>
      </>
    )
  }
}

export default withRedux(configureStore)(LeaseNFTApp)

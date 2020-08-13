import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Button from '~components/common/Button'
import Input from '../components/common/Input'

const Wrapper = styled.div`
  height: 100vh;
  max-width: 1440px;
  margin: auto;
  color: var(--color-text);

  display: flex;
  flex-direction: column;

  &.open {
    .mobile-open {
      display: flex;
    }
  }
`

const Account = styled.div`
  padding: 30px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media all and (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 40px 22px 22px;

    position: fixed;
    top: 0;
    z-index: 1;

    .input {
      width: calc(100% - 98px);
    }
  }

  .logo {
    height: 45px;
    @media all and (max-width: 767px) {
      height: 40px;
    }
  }
  .mobile-hamburger {
    display: none;
    position: absolute;
    right: 23px;
    top: 47px;
    z-index: 10;
  }
  @media all and (max-width: 767px) {
    a {
      margin-bottom: 27px;
      z-index: 10;
    }

    .mobile-hamburger {
      display: flex;
    }
  }

  .account-info {
    display: flex;
    align-items: center;
    margin: 0 -16px;
    @media all and (max-width: 767px) {
      margin: 0 -6.5px;
      width: calc(100% + 13px);
    }

    > * {
      margin: 0 16px;
      @media all and (max-width: 767px) {
        margin: 0 6.5px;
      }
    }

    .input input {
      width: 366px;
      max-width: 100%;
      @media all and (max-width: 767px) {
        width: auto;
      }
    }
  }
`

const Content = styled.div`
  margin-top: 160px;
  flex: 1;
  overflow: auto;
  @media all and (min-width: 768px) {
    height: 100%;
    margin-top: 0;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  font-size: 14px;
  @media all and (max-width: 767px) {
    flex-direction: column-reverse;
    font-size: 10px;
  }

  .resources {
    display: flex;
    margin: 0 -10px;
    @media all and (max-width: 767px) {
      margin: 0 -8px 15px;
    }
  }

  a {
    margin: 0 10px;
    @media all and (max-width: 767px) {
      margin: 0 8px;
    }
  }
`

const Link = styled.a`
  border-radius: 10px;
  cursor: pointer;

  border: 1px solid var(--color-border);
  background: var(--color-bg-black);
  box-shadow: var(--box-shadow2);

  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media all and (max-width: 767px) {
    width: 31px;
    height: 31px;

    img {
      height: 75%;
    }
  }
`

export default connect((state) => state)(function ({ provider, onProvider, children, ...props }) {
  const { address, mainNetwork } = props

  const [theme, setTheme] = useState('primary')
  const [showMenu, setShowMenu] = useState(false)
  useEffect(() => {
    setTheme(localStorage.getItem('theme') || 'primary')
  }, [])

  return (
    <Wrapper className={showMenu ? 'open' : 'close'}>
      <Account>
        <a href="/" style={{ display: 'flex' }}>
          <img src={theme === 'primary' ? '/meta/logo.svg' : '/meta/logo_dark.png'} className="logo" />
        </a>
        <img
          src={`/meta/mobile-${!showMenu ? 'menu' : 'close'}.svg`}
          alt=""
          className="mobile-hamburger"
          onClick={() => setShowMenu(!showMenu)}
        />
        <div className="account-info">
          <Input
            className="small"
            icon={<img src="/meta/eth.png" />}
            value={address || '---'}
            style={{ borderRadius: 7 }}
            disabled
          />
          <Button className={`black icon ${provider === 'metamask' ? 'active' : ''}`}>
            <img src="/meta/Metamask.svg" onClick={() => onProvider('metamask')} />
          </Button>
          <Button className={`black icon ${provider === 'fortmatic' ? 'active' : ''}`}>
            <img src="/meta/fortnite.svg" onClick={() => onProvider('fortmatic')} />
          </Button>
          {/* <Button
            style={{ fontSize: 30 }}
            className="black icon"
            dangerouslySetInnerHTML={{ __html: theme === 'primary' ? '&#9728;' : '&#9729' }}
            onClick={() => {
              localStorage.setItem('theme', localStorage.getItem('theme') === 'dark' ? 'primary' : 'dark')
              window.location.reload()
            }}
          /> */}
        </div>
      </Account>
      <Content>{React.cloneElement(children, { onHideMenu: () => setShowMenu(false) })}</Content>
      <Footer>
        <div>Copyright © 2020 Rightshare.</div>
        <div className="resources">
          <Link href="https://github.com/lendroidproject/Rightshare-contracts" target="_blank">
            <img src="/meta/github.svg" />
          </Link>
          <Link href="https://discordapp.com/invite/SyHdEbD" target="_blank" className="discord">
            <img src="/meta/discord.svg" />
          </Link>
        </div>
      </Footer>
    </Wrapper>
  )
})

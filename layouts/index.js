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
`

const Account = styled.div`
  padding: 30px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    height: 45px;
  }

  .account-info {
    display: flex;
    align-items: center;
    margin: 0 -16px;

    > * {
      margin: 0 16px;
    }

    .input input {
      width: 366px;
      max-width: 100%;
    }
  }
`

const Content = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  font-size: 14px;

  .resources {
    display: flex;
    margin: 0 -10px;
  }

  a {
    margin: 0 10px;
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
  padding: 5px;
`

export default connect((state) => state)(function ({ provider, onProvider, children, ...props }) {
  const { address, mainNetwork } = props

  const [theme, setTheme] = useState('primary')
  useEffect(() => {
    setTheme(localStorage.getItem('theme'))
  }, [])

  return (
    <Wrapper>
      <Account>
        <img src={theme === 'primary' ? '/meta/logo.svg' : '/meta/logo_dark.png'} className="logo" />
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
          <Button
            style={{ fontSize: 30 }}
            className="black icon"
            dangerouslySetInnerHTML={{ __html: theme === 'primary' ? '&#9728;' : '&#9729' }}
            onClick={() => {
              localStorage.setItem('theme', localStorage.getItem('theme') === 'dark' ? 'primary' : 'dark')
              window.location.reload()
            }}
          />
        </div>
      </Account>
      <Content>{children}</Content>
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

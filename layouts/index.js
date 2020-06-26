import styled from 'styled-components'
import { connect } from 'react-redux'

const Wrapper = styled.div`
  width: 100%;
`

const Account = styled.div`
  margin: 0;
  padding: 30px 20px 20px;
  text-align: center;
  word-break: break-all;
  position: relative;

  .logo {
    height: 60px;
    display: block;
    margin: 0 auto 10px;
  }
`

const Content = styled.div`
  width: 100%;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px;

  a {
    margin: 0 10px;
    text-decoration: none;
    color: #232160;
    display: flex;
    position: relative;

    img {
      height: 50px;
    }

    &.discord:after {
      content: '';
      position: absolute;
      left: 10px;
      right: 10px;
      top: 10px;
      bottom: 10px;
      background: white;
      border-radius: 50%;
      z-index: -1;
    }
  }
`

const CopyRight = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const Discord = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  @media all and (max-width: 767px) {
    bottom: 15px;
    right: 15px;
  }

  a {
    display: flex;

    img {
      width: 60px;
    }

    &:after {
      content: '';
      position: absolute;
      left: 13px;
      right: 13px;
      top: 13px;
      bottom: 15px;
      background: white;
      border-radius: 50%;
      z-index: -1;
    }
  }
`

const AccountProvider = styled.div`
  position: absolute;
  display: flex;
  height: 40px;
  right: 20px;
  top: 20px;

  img {
    height: 100%;
    margin: 0 10px;
    cursor: pointer;
    border-radius: 50%;
    filter: grayscale(1);

    &.fortmatic {
      background: #f7f6ff;
    }

    &.active {
      filter: grayscale(0);
    }
  }
`

export default connect((state) => state)(function ({ provider, onProvider, children, ...props }) {
  const { address, balance, mainNetwork } = props

  return (
    <Wrapper>
      <Account>
        <img src={mainNetwork ? '/logo.png' : '/logo_rinkeby.png'} className="logo" />
        {address || '---'} : {balance || '0'}
        <AccountProvider>
          <img
            src="/brands/Metamask.svg"
            className={`metamask ${provider === 'metamask' ? 'active' : ''}`}
            onClick={() => onProvider('metamask')}
          />
          <img
            src="/brands/Fortmatic.svg"
            className={`fortmatic ${provider === 'fortmatic' ? 'active' : ''}`}
            onClick={() => onProvider('fortmatic')}
          />
        </AccountProvider>
      </Account>
      <Content>{children}</Content>
      <Footer>
        <a href="https://github.com/lendroidproject/Rightshare-contracts" target="_blank">
          <img src="/logos/github.png" />
        </a>
        <a href="https://discordapp.com/invite/SyHdEbD" target="_blank" className="discord">
          <img src="/logos/discord.png" />
        </a>
      </Footer>
      <CopyRight>Copyright © 2020 Rightshare.</CopyRight>
      <Discord>
        <a href="https://discordapp.com/invite/SyHdEbD" target="_blank">
          <img src="/discord.svg" />
        </a>
      </Discord>
    </Wrapper>
  )
})

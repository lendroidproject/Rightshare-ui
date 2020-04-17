import styled from 'styled-components'
import { connect } from 'react-redux'

const Wrapper = styled.div`
  width: 100%;
`

const Account = styled.p`
  margin: 0;
  padding: 30px 20px 20px;
  text-align: center;
  word-break: break-all;

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
  margin-bottom: 15px;

  a {
    margin: 0 10px;
    text-decoration: none;
    color: #0a2c79;
  }
`

const CopyRight = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

export default connect((state) => state)(function ({ children, ...props }) {
  const { address, balance, mainNetwork } = props

  return (
    <Wrapper>
      <Account>
        <img src={mainNetwork ? '/logo.png' : '/logo_rinkeby.png'} className="logo" />
        {address || '---'} : {balance || '0'}
      </Account>
      <Content>{children}</Content>
      <Footer>
        <a href="https://github.com/lendroidproject/Rightshare-contracts" target="_blank">
          Github
        </a>
        <a href="https://discordapp.com/invite/SyHdEbD" target="_blank">
          Discord
        </a>
      </Footer>
      <CopyRight>Copyright © 2020 Rightshare.</CopyRight>
    </Wrapper>
  )
})

import styled from 'styled-components'
import { connect } from 'react-redux'

const Wrapper = styled.div`
  width: 100%;
`

const Account = styled.p`
  margin: 0;
  padding: 20px;
  text-align: center;

  .logo {
    width: 100px;
    height: 100px;
    display: block;
    margin: 0 auto;
  }
`

const Content = styled.div`
  width: 100%;
`

export default connect(state => state)(function({ children, ...props }) {
  const { address, balance } = props

  return (
    <Wrapper>
      <Account>
        <img src="/logo.png" className="logo" />
        {address || '---'} : {balance || '0'}
      </Account>
      <Content>{children}</Content>
    </Wrapper>
  )
})

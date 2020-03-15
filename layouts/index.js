import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import { useEffect } from 'react'

const Wrapper = styled.div`
  width: 100%;
`

const Account = styled.p`
  margin: 0;
  padding: 10px;
  text-align: center;
`

const Content = styled.div`
  width: 100%;
`

export default connect(state => state)(function({ children, ...props }) {
  const { address, balance } = props

  return (
    <Wrapper>
      <Account>
        {address} : {balance}
      </Account>
      <Content>{children}</Content>
    </Wrapper>
  )
})

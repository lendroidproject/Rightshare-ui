import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
`

export default function({ address, balance, ...props }) {
  return (
    <Wrapper>
      <p>
        {address} : {balance}
      </p>
      <div {...props} />
    </Wrapper>
  )
}

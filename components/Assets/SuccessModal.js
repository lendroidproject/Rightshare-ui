import styled from 'styled-components'

import { ItemOverlay, ItemDetail } from './AssetDetail'

const MAIN_NETWORK = process.env.MAIN_NETWORK

const Content = styled(ItemDetail)`
  flex-direction: column;
  padding: 20px 25px;

  > * {
    padding: 0;
  }

  img {
    max-width: 50px;
    padding: 0;
    margin: 20px auto 0;
  }

  h1 {
    text-align: center;
    margin: 10px auto;
  }

  a {
    color: #0a2c79;
  }
`

export default ({ onClose }) => (
  <ItemOverlay onClick={onClose}>
    <Content onClick={e => e.stopPropagation()}>
      <img src="/checked.svg" />
      <h1>Congratulations!</h1>
      <p>
        Your fRights and iRights have been minted. They're in your wallet. Refresh the page in a couple of minutes and
        you can see them.
        <br />
        You can also view details, share or sell them directly from{' '}
        <a href={MAIN_NETWORK ? "https://opensea.io/account" : "https://rinkeby.opensea.io/account"} target="_blank" rel="noopener noreferrer">
          your OpenSea account
        </a>
        .
      </p>
      <p>
        Click{' '}
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            onClose()
          }}
        >
          here
        </a>{' '}
        to understand your minted Rights Tokens better.
      </p>
    </Content>
  </ItemOverlay>
)

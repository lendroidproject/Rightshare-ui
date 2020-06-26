import styled from 'styled-components'

import { ItemOverlay, ItemDetail } from './AssetDetail'

const MAIN_NETWORK = process.env.MAIN_NETWORK

const Content = styled.div`
  border-radius: 5px;
  background: white;
  position: relative;
  max-height: 100vh;
  overflow: auto;

  padding: 20px 25px;
  text-align: center;
  max-width: 513px;

  > * {
    padding: 0;
    width: auto;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  img.tick {
    width: 90px;
    padding: 0;
    margin: 20px auto 0;
  }

  h1 {
    text-align: center;
    margin: 10px auto;
    color: #8ba70e;
    font-size: 24px;
    font-weight: normal;
  }

  a {
    color: #258aca;
  }
`

export default ({ onClose }) => (
  <ItemOverlay onClick={onClose}>
    <Content onClick={(e) => e.stopPropagation()}>
      <img src="/assets/close.svg" className="close" onClick={onClose} />
      <img src="/assets/tick.svg" className="tick" />
      <h1>Congratulations!</h1>
      <p>
        Your ticketing for virtual events meta tokens have been minted. They’re in your wallet. Refresh the page in a
        couple of minutes and you can see them. You can also view details, share or sell them directly from your{' '}
        <a
          href={MAIN_NETWORK ? 'https://opensea.io/account' : 'https://rinkeby.opensea.io/account'}
          target="_blank"
          rel="noopener noreferrer"
        >
          your OpenSea account
        </a>
        .
      </p>
      <p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onClose()
          }}
        >
          Click Here
        </a>{' '}
        to understand your minted Rights Tokens better.
      </p>
    </Content>
  </ItemOverlay>
)

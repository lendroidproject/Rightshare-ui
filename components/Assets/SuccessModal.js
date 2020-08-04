import styled from 'styled-components'

import { ItemOverlay, ItemDetail } from './AssetDetail'

const MAIN_NETWORK = process.env.MAIN_NETWORK

export const Content = styled.div`
  border: 2px solid var(--color-thick);
  border-radius: 8px;
  background-color: var(--color-bg8);
  background: var(--color-grad8);
  box-shadow: var(--box-shadow-modal);
  color: var(--color-text);
  position: relative;

  width: 572px;
  max-width: 100%;

  padding: 0px 25px 20px;
  text-align: center;

  @media all and (max-width: 767px) {
    width: 90%;
  }

  > * {
    padding: 0;
    width: auto;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 30px;
    cursor: pointer;
  }

  img.tick {
    width: 190px;
    padding: 0;
    margin: 20px auto 0;
  }

  h1 {
    text-align: center;
    margin: 10px auto;
    color: var(--color-purple);
    font-size: 28px;
    font-weight: 600;
  }

  p {
    font-size: 14px;
  }

  a {
    color: var(--color-link);
  }
`

export default ({ onClose }) => (
  <ItemOverlay onMouseDown={onClose}>
    <Content onMouseDown={(e) => e.stopPropagation()}>
      <img src="/meta/close-btn.svg" className="close" onClick={onClose} />
      <img src="/meta/celebrations.svg" className="tick" />
      <h1>Congratulations</h1>
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
        .<br />
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

import styled from 'styled-components'

import { ItemOverlay, ItemDetail } from './AssetDetail'
import { Content as ModalContent } from './SuccessModal'

const Content = styled(ModalContent)`
  p {
    font-size: 18px;
  }
`

export default ({ onClose }) => (
  <ItemOverlay onMouseDown={onClose}>
    <Content onMouseDown={(e) => e.stopPropagation()}>
      <img src="/meta/loading-icon.svg" className="tick" />
      <h1>Creating Metatoken</h1>
      <p>
        Please wait while your Metatoken is
        <br />
        minted to your address
      </p>
    </Content>
  </ItemOverlay>
)

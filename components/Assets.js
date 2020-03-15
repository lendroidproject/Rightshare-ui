import { useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import { Flex, FlexWrap } from '~/components/common/Wrapper'

const Wrapper = styled(FlexWrap)`
  margin: -15px;
  align-items: stretch;
`

const ItemWrapper = styled.div`
  width: 100%;
  max-width: 250px;
  margin: 15px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 1px 1px 5px grey;
`

const Thumbnail = styled.div`
  height: 250px;
  display: felx;
  justify-content: center;

  img {
    height: 100%;
  }
`

const ItemInfo = styled(Flex)`
  justify-content: space-between;
  background: #eee;
  padding: 10px;
  min-height: 48px;

  .price {
    flex: 0 0 50px;
    text-align: right;
  }
`

function Item(props) {
  const {
    token_id: id,
    image_preview_url: preview,
    // image_thumbnail_url: thumbnail,
    // image_original_url: original
    name,
    background_color: background,
    current_price: price,
    decimals,
  } = props
  console.log(background)

  return (
    <ItemWrapper className="item" key={id}>
      <Thumbnail style={{ background: background ? `#${background}` : 'white' }}>
        <img src={preview ? preview : 'https://picsum.photos/250'} alt="" />
      </Thumbnail>
      <ItemInfo>
        <div>{name}</div>
        <div className="price">{Number(price ? paice : 0).toFixed(decimals)}</div>
      </ItemInfo>
    </ItemWrapper>
  )
}

export default connect(state => state)(function({ children, ...props }) {
  const { address, dispatch, assets = [] } = props

  useEffect(() => {
    getMyAssets()
      .then(response => response.data)
      .then(({ assets }) => {
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: assets,
        })
      })
      .catch(error => {
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: [],
          error,
        })
      })
  }, [address])

  return <Wrapper>{assets.map(Item)}</Wrapper>
})

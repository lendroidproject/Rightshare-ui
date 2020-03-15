import { useEffect, useState } from 'react'
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

const LoadMore = styled.button``

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
  const [page, setPage] = useState({ offset: 0, limit: 20 })

  useEffect(() => {
    if (address) {
      getMyAssets({
        offset: 0,
        limit: 20,
      })
        .then(response => response.data)
        .then(({ assets }) => {
          dispatch({
            type: 'GET_MY_ASSETS',
            payload: assets,
          })
          setPage({ offset: assets.length, limit: 20 })
        })
        .catch(error => {
          dispatch({
            type: 'GET_MY_ASSETS',
            payload: [],
            error,
          })
        })
    }
  }, [address])

  const more = page.offset > 0 && page.offset % page.limit
  const loadMore = () => {
    if (page.offset % page.limit === 0) {
      getMyAssets(page)
        .then(response => response.data)
        .then(({ assets: newAssets }) => {
          const allAssets = [...assets, ...newAssets]
          dispatch({
            type: 'GET_MY_ASSETS',
            payload: allAssets,
          })
          setPage({ offset: allAssets.length, limit: 20 })
        })
        .catch(error => {
          dispatch({
            type: 'GET_MY_ASSETS',
            payload: [],
            error,
          })
        })
    }
  }

  return (
    <Wrapper>
      {assets.map(Item)}
      {more && <LoadMore onClick={loadMore}>Load more...</LoadMore>}
    </Wrapper>
  )
})

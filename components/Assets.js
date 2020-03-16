import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import { Flex, FlexWrap, FlexCenter, FlexInline } from '~/components/common/Wrapper'

const Wrapper = styled(FlexWrap)`
  margin: -15px;
  align-items: stretch;
`
const LoadMore = styled.button``

const ItemWrapper = styled.div`
  width: 100%;
  max-width: 250px;
  margin: 15px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 1px 1px 5px grey;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 0px 7px black;
  }
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

const ItemOverlay = styled(FlexCenter)`
  background: rgba(0, 0, 0, 0.7);
  z-index: 11;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`
const ItemDetail = styled(FlexInline)`
  padding: 20px;
  border-radius: 5px;
  background: white;

  > * {
    width: 50%;
  }

  .info {
    padding: 20px;

    .heading {
      display: flex;
      justify-content: space-between;

      p {
        margin: 0;
      }
    }

    .owner {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      img {
        border-radius: 50%;
        width: 35px;
        margin-right: 10px;
      }
    }
  }
`

function Item({ onSelect, ...data }) {
  const {
    token_id: id,
    image_preview_url: preview,
    // image_thumbnail_url: thumbnail,
    // image_original_url: original
    name,
    background_color: background,
    current_price: price,
    decimals,
  } = data

  return (
    <ItemWrapper className="item" key={id} onClick={() => onSelect(data)}>
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
  const { address: owner, dispatch, assets = [] } = props
  const [page, setPage] = useState({ offset: 0, limit: 20 })
  const [item, setItem] = useState(null)

  useEffect(() => {
    if (owner) {
      getMyAssets({
        offset: 0,
        limit: 20,
        // owner,
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
  }, [owner])

  const more = page.offset > 0 && page.offset % page.limit === 0
  const loadMore = () => {
    if (page.offset % page.limit === 0) {
      getMyAssets({ ...page, owner })
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

  const renderItem = () => {
    if (!item) return null
    const {
      name,
      asset_contract: { name: assetName },
      owner: { user, profile_img_url: avatar },
      permalink,
      current_price: price,
      image_url: image,
    } = item
    const userName = user ? user.username : '---'

    return (
      <ItemOverlay onClick={() => setItem(null)}>
        <ItemDetail onClick={e => e.stopPropagation()}>
          <img src={image} alt={name} />
          <div className="info">
            <div className="heading">
              <p>{assetName}</p>
              <a href={permalink} target="_blank">
                Share
              </a>
            </div>
            <h2>{name}</h2>
            <div className="owner">
              <img src={avatar} alt={userName} />
              <span>
                Owned by <b>{userName.length > 20 ? `${userName.substr(0, 17)}...` : userName}</b>
              </span>
            </div>
            <div className="price">Price: {price ? price : 0}</div>
          </div>
        </ItemDetail>
      </ItemOverlay>
    )
  }

  return (
    <Wrapper>
      {assets.map(asset => (
        <Item {...asset} onSelect={setItem} />
      ))}
      {more && <LoadMore onClick={loadMore}>Load more...</LoadMore>}
      {renderItem()}
    </Wrapper>
  )
})

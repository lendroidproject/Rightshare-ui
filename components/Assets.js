import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import { Flex, FlexWrap, FlexCenter, FlexInline } from '~/components/common/Wrapper'

const Wrapper = styled(FlexWrap)``
const Items = styled(FlexWrap)`
  margin: -15px;
  align-items: stretch;
  margin-bottom: 15px;
`
const LoadMore = styled.button`
  background: transparent;
`

const ItemWrapper = styled.div`
  width: 100%;
  max-width: 250px;
  margin: 15px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 1px 1px 5px grey;
  cursor: pointer;
  background: #eee;

  &:hover {
    box-shadow: 0px 0px 7px #27a0f7;
  }
`
const Thumbnail = styled.div`
  height: 250px;
  display: felx;
  align-items: center;

  img {
    width: 100%;
    display: block;
  }
`
const ItemInfo = styled(Flex)`
  justify-content: space-between;
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
  align-items: stretch;
  padding: 10px;
  border-radius: 5px;
  background: white;
  max-width: 80%;
  position: relative;

  @media all and (max-width: 767px) {
    flex-direction: column;
  }

  .close {
    position: absolute;
    right: 15px;
    top: 15px;
    width: 24px;
    height: 24px;
    background: lightgrey;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background: grey;
    }
  }
  .close:before,
  .close:after {
    position: absolute;
    left: 11px;
    top: 4px;
    content: ' ';
    height: 16px;
    width: 2px;
    background-color: white;
  }
  .close:before {
    transform: rotate(45deg);
  }
  .close:after {
    transform: rotate(-45deg);
  }

  > * {
    width: 384px;
    max-width: 100%;
    min-height: 384px;
    align-items: center;
    padding: 10px;
  }

  .external {
    display: flex;

    img {
      width: 100%;
    }
  }

  .info {
    .heading {
      display: flex;
      justify-content: space-between;

      p {
        margin: 0;
      }
    }

    h2 {
      margin: 0 0 10px;
    }

    .owner {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      img {
        border-radius: 50%;
        width: 35px;
        margin-right: 10px;
      }
    }
  }

  button {
    margin-top: 12px;
    background: #0a2c79;
    color: white;
    border-radius: 4px;
    padding: 10px 20px;
  }

  form {
    .input-group {
      p {
        margin: 0 0 8px;
        font-size: 16px;
        font-weight: 600;
      }

      label {
        font-size: 14px;
        margin-bottom: 4px;
      }

      .inputs {
        display: flex;
        margin: 0 -8px 8px;

        > * {
          width: 100%;
          display: flex;
          flex-direction: column;
          margin: 0 8px;

          &.radio {
            flex-direction: row;
            align-items: center;

            input {
              width: 20px;
              margin-right: 10px;
            }
          }
        }

        input {
          width: 100%;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid;
          padding: 5px 10px;
          line-height: 1.5;

          &[type='radio'] {
            cursor: pointer;
          }
        }
      }
    }
  }
`

function Item({ onSelect, ...data }) {
  const {
    token_id: id,
    image_preview_url: preview,
    // image_thumbnail_url: thumbnail,
    // image_url: original,
    name,
    background_color: background,
    current_price: price,
    decimals,
  } = data

  return (
    <ItemWrapper className="item" onClick={() => onSelect(data)}>
      <Thumbnail style={{ background: background ? `#${background}` : 'white' }}>
        <img src={preview ? preview : 'https://picsum.photos/250'} alt="" />
      </Thumbnail>
      <ItemInfo>
        <div>{name}</div>
        <div className="price">{Number(price ? price : 0).toFixed(decimals)}</div>
      </ItemInfo>
    </ItemWrapper>
  )
}

export default connect(state => state)(function({ children, ...props }) {
  const {
    address: owner,
    dispatch,
    assets = [],
    methods: { isFrozen, approve, freeze },
    addresses: { RightsDao: approveAddress },
  } = props
  const [page, setPage] = useState({ offset: 0, limit: 20 })
  const [end, setEnd] = useState(false)
  const [item, setItem] = useState(null)
  const [freezeForm, setFreezeForm] = useState(null)

  const myAssets = query =>
    getMyAssets(query)
      .then(response => response.data)
      .then(({ assets: newAssets }) => {
        const allAssets = [...(query.offset ? assets : []), ...newAssets]
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: allAssets,
        })
        setPage({ offset: allAssets.length, limit: 20 })
        if (newAssets.length < query.limit) setEnd(true)
      })
      .catch(error => {
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: [],
          error,
        })
      })
  const loadMore = () => myAssets({ ...page, owner })

  useEffect(() => {
    if (owner) {
      myAssets({
        offset: 0,
        limit: 20,
        owner,
      })
    }
  }, [owner])

  const renderItem = () => {
    if (!item) return null
    const {
      name,
      asset_contract: { name: assetName, address },
      owner: { user, profile_img_url: avatar },
      // permalink,
      external_link: external,
      current_price: price,
      image_url: image,
      background_color: background,
      description,
      frozen,
      token_id: tokenId,
    } = item
    const userName = user ? user.username : '---'

    const handleFreeze = e => {
      e.preventDefault()
      approve(address)(approveAddress, tokenId, { from: owner }).then(result => {
        console.log(0, result)
        const { expiryDate, expiryTime, isExclusive, maxISupply, circulatingISupply } = freezeForm
        const expiry = parseInt(new Date(`${expiryDate}T${expiryTime}:00`).getTime() / 1000)
        freeze(address, tokenId, expiry, isExclusive, maxISupply, circulatingISupply, { from: owner })
          .on('transactionHash', function(hash) {
            console.log(1, hash)
          })
          .on('receipt', function(receipt) {
            console.log(2, receipt)
            myAssets({
              offset: 0,
              limit: 20,
              owner,
            })
          })
          .on('confirmation', function(confirmationNumber, receipt) {
            console.log(3, confirmationNumber, receipt)
          })
          .on('error', function(error, receipt) {
            console.log(4, error, receipt)
          })
      })
    }

    return (
      <ItemOverlay onClick={() => setItem(null)}>
        <ItemDetail onClick={e => e.stopPropagation()}>
          <a href={external} className="external" target="_blank">
            <img
              src={image ? image : 'https://picsum.photos/512'}
              alt={name}
              style={{ background: background ? `#${background}` : 'white' }}
            />
          </a>
          <div className="info">
            <div className="close" onClick={() => setItem(null)} />
            <div className="heading">
              <p>{assetName}</p>
            </div>
            <h2>{name}</h2>
            <div className="owner">
              <img src={avatar} alt={userName} />
              <span>
                Owned by <b>{userName.length > 20 ? `${userName.substr(0, 17)}...` : userName}</b>
              </span>
            </div>
            {!!freezeForm ? (
              <form>
                <div className="input-group">
                  <p>Set Expiry</p>
                  <div className="inputs">
                    <div>
                      <label>Date</label>
                      <input
                        type="date"
                        value={freezeForm.expiryDate}
                        onChange={e => setFreezeForm({ ...freezeForm, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>Time</label>
                      <input
                        type="time"
                        value={freezeForm.expiryTime}
                        onChange={e => setFreezeForm({ ...freezeForm, expiryTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <p>Set Access</p>
                  <div className="inputs">
                    <div className="radio">
                      <input
                        type="radio"
                        name="isExclusive"
                        value={1}
                        checked={freezeForm.isExclusive}
                        onChange={e => setFreezeForm({ ...freezeForm, isExclusive: Number(e.target.value) === 1 })}
                      />
                      <label onClick={e => setFreezeForm({ ...freezeForm, isExclusive: true })}>Exclusive</label>
                    </div>
                    <div className="radio">
                      <input
                        type="radio"
                        name="isExclusive"
                        value={2}
                        checked={!freezeForm.isExclusive}
                        onChange={e => setFreezeForm({ ...freezeForm, isExclusive: Number(e.target.value) === 1 })}
                      />
                      <label onClick={e => setFreezeForm({ ...freezeForm, isExclusive: false })}>Non-Exclusive</label>
                    </div>
                  </div>
                  {!freezeForm.isExclusive && (
                    <>
                      <p>Set Supply</p>
                      <div className="inputs">
                        <div>
                          <label>May I Supply</label>
                          <input
                            type="number"
                            value={freezeForm.maxISupply}
                            onChange={e => setFreezeForm({ ...freezeForm, maxISupply: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label>Curclating I Supply</label>
                          <input
                            type="number"
                            value={freezeForm.circulatingISupply}
                            onChange={e => setFreezeForm({ ...freezeForm, circulatingISupply: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <button onClick={handleFreeze}>Proceed</button>
                </div>
              </form>
            ) : (
              <>
                <p>{description}</p>
                <div className="price">Price: {price ? price : 0}</div>
                {!frozen && (
                  <button
                    onClick={() =>
                      setFreezeForm({
                        expiryDate: new Date().toISOString().split('T')[0],
                        expiryTime: new Date()
                          .toISOString()
                          .split('T')[1]
                          .substr(0, 5),
                        isExclusive: true,
                        maxISupply: 1,
                        circulatingISupply: 1,
                      })
                    }
                  >
                    Initiate Right Share
                  </button>
                )}
              </>
            )}
          </div>
        </ItemDetail>
      </ItemOverlay>
    )
  }

  const handleSelect = item => {
    const {
      token_id: tokenId,
      asset_contract: { address },
    } = item
    isFrozen(address, tokenId).then(frozen => {
      setItem({ ...item, frozen })
      setFreezeForm(null);
    })
  }

  return (
    <Wrapper>
      <Items>
        {assets.map((asset, index) => (
          <Item key={index} {...asset} onSelect={handleSelect} />
        ))}
      </Items>
      {!end && <LoadMore onClick={loadMore}>Load more...</LoadMore>}
      {renderItem()}
    </Wrapper>
  )
})

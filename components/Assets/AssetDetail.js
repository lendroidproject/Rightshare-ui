import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FlexCenter, FlexInline } from '~/components/common/Wrapper'

import AssetForm from './AssetForm'

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
`

const Close = styled.div`
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

  &:before,
  &:after {
    position: absolute;
    left: 11px;
    top: 4px;
    content: ' ';
    height: 16px;
    width: 2px;
    background-color: white;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`

const transformFreeze = ({ endTime, isExclusive, maxISupply, circulatingISupply }) => ({
  expiryDate: new Date(Number(endTime) * 1000).toISOString().split('T')[0],
  expiryTime: new Date(Number(endTime) * 1000)
    .toISOString()
    .split('T')[1]
    .substr(0, 5),
  isExclusive,
  maxISupply,
  circulatingISupply,
})

export default ({ item, onReload, onClose, ...props }) => {
  const {
    address: owner,
    methods: {
      NFT: { approve },
      RightsDao: { freeze, unfreeze },
    },
    addresses: { RightsDao: approveAddress },
  } = props
  const [originFreezeForm, setFreezeForm] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    setFreezeForm(null)
  }, [item])

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
    isFrozen,
    isUnfreezable,
    detail,
    token_id: tokenId,
  } = item
  const userName = user ? user.username : '---'
  const freezeForm = isUnfreezable ? transformFreeze(detail) : originFreezeForm

  const handleFreeze = e => {
    e.preventDefault()
    setStatus({ start: true })
    approve(address)(approveAddress, tokenId, { from: owner })
      .then(receipt => {
        console.log(0, receipt)
        setStatus({ ...status, process: true })
        const { expiryDate, expiryTime, isExclusive, maxISupply } = freezeForm
        const expiry = parseInt(new Date(`${expiryDate}T${expiryTime}:00`).getTime() / 1000)
        freeze(address, tokenId, expiry, isExclusive, maxISupply, { from: owner })
          .then(receipt => {
            console.log(1, receipt)
            onReload()
          })
          .catch((error, receipt) => {
            console.log(-2, error, receipt)
            setStatus(null)
          })
      })
      .catch((error, receipt) => {
        console.log(-1, error, receipt)
        setStatus(null)
      })
  }
  const handleUnfreeze = e => {
    e.preventDefault()
    setStatus({ start: true })
    unfreeze(detail.tokenId, { from: owner })
      .then(receipt => {
        console.log(0, receipt)
        onReload()
      })
      .catch((error, receipt) => {
        console.log(-1, error, receipt)
        setStatus(null)
      })
  }

  return (
    <ItemOverlay onClick={onClose}>
      <ItemDetail onClick={e => e.stopPropagation()}>
        <a href={external} className="external" target="_blank">
          <img
            src={image ? image : 'https://picsum.photos/512'}
            alt={name}
            style={{ background: background ? `#${background}` : 'white' }}
          />
        </a>
        <div className="info">
          <Close onClick={onClose} />
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
            <AssetForm
              {...{
                form: freezeForm,
                setForm: setFreezeForm,
                readOnly: isUnfreezable,
              }}
            >
              {isFrozen === false && (
                <button disabled={!!status} onClick={handleFreeze}>
                  Proceed
                  <img src="/spinner.svg" />
                </button>
              )}
              {isUnfreezable === true && (
                <button disabled={!!status} onClick={handleUnfreeze}>
                  Unfreeze
                  <img src="/spinner.svg" />
                </button>
              )}
            </AssetForm>
          ) : (
            <>
              <p>{description}</p>
              <div className="price">Price: {price ? price : 0}</div>
              {isFrozen === false && (
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

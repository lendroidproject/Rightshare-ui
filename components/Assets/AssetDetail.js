import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FlexCenter, FlexInline } from '~/components/common/Wrapper'

import AssetForm from './AssetForm'
import TransferForm from './TransferForm'

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

  .buttons {
    margin: 0 -6px -12px;

    button {
      margin: 12px 6px;
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
      RightsDao: { freeze, unfreeze, issueI, revokeI },
      IRight: { transfer },
    },
    addresses: { RightsDao: approveAddress },
  } = props
  const [originFreezeForm, setFreezeForm] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (item) {
      setFreezeForm(null)
    }
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
    type,
    isFrozen,
    metadata,
    isUnfreezable,
    isIMintAble,
    token_id: tokenId,
  } = item
  const userName = user ? user.username : '---'
  const freezeForm = metadata ? transformFreeze(metadata) : originFreezeForm

  const handleFreeze = e => {
    e.preventDefault()
    setStatus({ start: 'freeze' })
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
    setStatus({ start: 'unfreeze' })
    unfreeze(metadata.tokenId, { from: owner })
      .then(receipt => {
        console.log(0, receipt)
        onReload()
      })
      .catch((error, receipt) => {
        console.log(-1, error, receipt)
        setStatus(null)
      })
  }
  const handleIssueI = e => {
    e.preventDefault()
    setStatus({ start: 'issueI' })
    issueI(metadata.tokenId, Number(metadata.endTime), { from: owner })
      .then(receipt => {
        console.log(0, receipt)
        onReload()
      })
      .catch((error, receipt) => {
        console.log(-1, error, receipt)
        setStatus(null)
      })
  }
  const handleRevoke = e => {
    e.preventDefault()
    setStatus({ start: 'revokeI' })
    revokeI(metadata.tokenId, { from: owner })
      .then(receipt => {
        console.log(0, receipt)
        onReload()
      })
      .catch((error, receipt) => {
        console.log(-1, error, receipt)
        setStatus(null)
      })
  }
  const handleTransfer = e => {
    e.preventDefault()
    setStatus({ start: 'transfer' })
    transfer(owner, originFreezeForm.to, metadata.tokenId, { from: owner })
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
          <p>{description}</p>
          <div className="price">Price: {price ? price : 0}</div>
          {!!freezeForm ? (
            <>
              {type === 'FRight' && (
                <AssetForm
                  {...{
                    form: freezeForm,
                    setForm: setFreezeForm,
                    readOnly: isUnfreezable,
                  }}
                ></AssetForm>
              )}
              {type === 'IRight' && (
                <TransferForm
                  owner={owner}
                  {...{
                    form: freezeForm,
                    setForm: setFreezeForm,
                  }}
                />
              )}
              <div className="buttons">
                {isFrozen === false && (
                  <button disabled={!!status} onClick={handleFreeze}>
                    Proceed
                    {status && status.start === 'freeze' && <img src="/spinner.svg" />}
                  </button>
                )}
                {isUnfreezable === true && (
                  <button disabled={!!status} onClick={handleUnfreeze}>
                    Unfreeze
                    {status && status.start === 'unfreeze' && <img src="/spinner.svg" />}
                  </button>
                )}
                {isIMintAble === true && (
                  <button disabled={!!status} onClick={handleIssueI}>
                    Mint I Right
                    {status && status.start === 'issueI' && <img src="/spinner.svg" />}
                  </button>
                )}
                {type === 'IRight' && (
                  <>
                    <button disabled={!!status} onClick={handleTransfer}>
                      Transfer
                      {status && status.start === 'transfer' && <img src="/spinner.svg" />}
                    </button>
                    <button disabled={!!status} onClick={handleRevoke}>
                      Burn Right
                      {status && status.start === 'revokeI' && <img src="/spinner.svg" />}
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="buttons">
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
            </div>
          )}
        </div>
      </ItemDetail>
    </ItemOverlay>
  )
}

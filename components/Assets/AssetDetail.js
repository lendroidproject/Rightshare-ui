import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { validate } from '~/utils/validation'
import { FlexCenter, FlexInline } from '~/components/common/Wrapper'

import AssetForm from './AssetForm'
import AssetMetaData from './AssetMetaData'
import TransferForm from './TransferForm'
import IMintForm from './IMintForm'

export const ItemOverlay = styled(FlexCenter)`
  background: rgba(0, 0, 0, 0.7);
  z-index: 11;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`

export const ItemDetail = styled(FlexInline)`
  align-items: stretch;
  padding: 10px;
  border-radius: 5px;
  background: white;
  max-width: 80%;
  position: relative;
  max-height: 80vh;
  overflow: auto;

  @media all and (max-width: 767px) {
    flex-direction: column;
  }

  > * {
    width: 384px;
    max-width: 100%;
    align-items: center;
    padding: 10px;
  }

  .external {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;

    img {
      height: auto;
      max-height: 384px;
    }
  }

  .info {
    .heading {
      display: flex;
      justify-content: space-between;

      p {
        margin: 0;
        font-size: 14px;
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

    p.desc {
      font-size: 13px;
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

const transformUTC = (time) => {
  const date = new Date(time)
  const dateUTC = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  return new Date(dateUTC).toISOString()
}

const transformFreeze = ({ endTime, isExclusive, maxISupply, circulatingISupply, serialNumber }) => ({
  expiry: transformUTC(Number(endTime) * 1000),
  expiryDate: transformUTC(Number(endTime) * 1000).split('T')[0],
  expiryTime: transformUTC(Number(endTime) * 1000)
    .split('T')[1]
    .substr(0, 5),
  isExclusive,
  maxISupply,
  circulatingISupply,
  serialNumber,
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
  const [transferForm, setTransferForm] = useState(null)
  const [mintForm, setMintForm] = useState({ iVersion: 1 })
  const [errors, setErrors] = useState({})

  const handleFreezeForm = (form) => {
    if (Object.keys(errors).length) {
      setErrors({})
    }
    setFreezeForm(form)
  }
  const handleTransferForm = (form) => {
    if (Object.keys(errors).length) {
      setErrors({})
    }
    setTransferForm(form)
  }
  const handleMintForm = (form) => {
    if (Object.keys(errors).length) {
      setErrors({})
    }
    setMintForm(form)
  }

  useEffect(() => {
    if (item) {
      handleFreezeForm(null)
      handleTransferForm(null)
      handleMintForm({ iVersion: 1 })
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
    fVersion,
    iVersion,
    metadata,
    isUnfreezable,
    isIMintAble,
    token_id: tokenId,
  } = item
  const userName = user ? user.username : '---'
  const freezeForm = metadata ? transformFreeze(metadata) : originFreezeForm

  const handleFreeze = (e) => {
    e.preventDefault()

    const validations = ['expiryDate', 'expiryTime', 'maxISupply']
    const [isValid, errors] = validate(freezeForm, validations)
    if (!isValid) {
      return setErrors(errors)
    }

    setStatus({ start: 'freeze' })
    approve(address)(approveAddress, tokenId, { from: owner })
      .then((receipt) => {
        console.log(0, receipt)
        const { expiryDate, expiryTime, isExclusive, maxISupply, fVersion, iVersion } = freezeForm
        const [year, month, day] = expiryDate.split('-')
        const expiry = parseInt(new Date(Date.UTC(year, month - 1, day, ...expiryTime.split(':'))).getTime() / 1000)
        freeze(address, tokenId, expiry, isExclusive, [maxISupply, fVersion, iVersion], { from: owner })
          .then((receipt) => {
            console.log(1, receipt)
            onReload('freeze')
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
  const handleUnfreeze = (e) => {
    e.preventDefault()
    setStatus({ start: 'unfreeze' })
    unfreeze(tokenId, { from: owner })
      .then((receipt) => {
        console.log(0, receipt)
        onReload()
      })
      .catch((error, receipt) => {
        console.log(-1, error, receipt)
        setStatus(null)
      })
  }
  const handleIssueI = (e) => {
    e.preventDefault()
    setStatus({ start: 'issueI' })
    const { iVersion } = mintForm
    issueI([metadata.tokenId, Number(metadata.endTime), iVersion], { from: owner })
      .then((receipt) => {
        console.log(0, receipt)
        handleMintForm({ iVersion: 1 })
        onReload()
      })
      .catch((error, receipt) => {
        console.log(-1, error, receipt)
        setStatus(null)
      })
  }
  const handleRevoke = (e) => {
    e.preventDefault()
    setStatus({ start: 'revokeI' })
    revokeI(metadata.tokenId, { from: owner })
      .then((receipt) => {
        console.log(0, receipt)
        onReload()
      })
      .catch((error, receipt) => {
        console.log(-1, error, receipt)
        setStatus(null)
      })
  }
  const handleTransfer = (e) => {
    if (!transferForm) {
      return handleTransferForm({ to: '' })
    }
    e.preventDefault()

    const validations = ['to']
    const [isValid, errors] = validate(transferForm, validations)
    if (!isValid) {
      return setErrors(errors)
    }

    setStatus({ start: 'transfer' })
    transfer(owner, transferForm.to, metadata.tokenId, { from: owner })
      .then((receipt) => {
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
      <ItemDetail onClick={(e) => e.stopPropagation()}>
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
          <p className="desc">{description}</p>
          <div className="price">Price: {price ? price : 0}</div>
          {!type &&
            (!!freezeForm ? (
              <AssetForm
                {...{
                  form: freezeForm,
                  setForm: handleFreezeForm,
                  readOnly: type === 'FRight',
                  data: { fVersion, iVersion },
                }}
                errors={errors}
              ></AssetForm>
            ) : (
              <div className="buttons">
                {isFrozen === false && (
                  <button
                    onClick={() =>
                      handleFreezeForm({
                        expiryDate: new Date().toISOString().split('T')[0],
                        expiryTime: new Date().toISOString().split('T')[1].substr(0, 5),
                        isExclusive: true,
                        maxISupply: 1,
                        circulatingISupply: 1,
                        fVersion: 1,
                        iVersion: 1,
                      })
                    }
                  >
                    Initiate Rightshare
                  </button>
                )}
              </div>
            ))}
          {type && !transferForm && <AssetMetaData data={freezeForm} />}
          {type === 'IRight' && transferForm && (
            <TransferForm
              owner={owner}
              {...{
                form: transferForm,
                setForm: handleTransferForm,
              }}
              errors={errors}
            />
          )}
          {type === 'FRight' && isIMintAble && (
            <IMintForm
              {...{
                form: mintForm,
                setForm: handleMintForm,
                data: { iVersion },
              }}
            />
          )}
          <div className="buttons">
            {isFrozen === false && freezeForm && (
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
                Mint iRight
                {status && status.start === 'issueI' && <img src="/spinner.svg" />}
              </button>
            )}
            {type === 'IRight' && (
              <button disabled={!!status} onClick={handleTransfer}>
                {transferForm ? 'Proceed' : 'Transfer'}
                {status && status.start === 'transfer' && <img src="/spinner.svg" />}
              </button>
            )}
            {type === 'IRight' && !transferForm && (
              <button disabled={!!status} onClick={handleRevoke}>
                Burn iRIghts
                {status && status.start === 'revokeI' && <img src="/spinner.svg" />}
              </button>
            )}
          </div>
        </div>
      </ItemDetail>
    </ItemOverlay>
  )
}

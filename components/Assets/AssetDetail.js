import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { intlActions } from '~utils/translation'
import { validate } from '~utils/validation'
import { FlexCenter, FlexInline } from '~components/common/Wrapper'
import Spinner from '~components/common/Spinner'

import AssetForm from './AssetForm'
import AssetMetaData from './AssetMetaData'
import TransferForm from './TransferForm'

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
  max-height: 100vh;
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

  .actions {
    position: relative;
    min-height: 60px;
  }

  .external {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    padding: 0;

    img {
      height: auto;
      max-height: 384px;
    }
  }

  .info {
    position: relative;

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
    display: flex;

    button {
      margin: 12px 6px;
      font-size: 13px;
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

const transformFreeze = ({ expiry, endTime, isExclusive, maxISupply, circulatingISupply, serialNumber }) => ({
  expiry: transformUTC(Number(expiry || endTime) * 1000),
  expiryDate: transformUTC(Number(expiry || endTime) * 1000).split('T')[0],
  expiryTime: transformUTC(Number(expiry || endTime) * 1000)
    .split('T')[1]
    .substr(0, 5),
  isExclusive,
  maxISupply,
  circulatingISupply,
  serialNumber,
})

export default ({ lang, item, loading, onReload, onClose, ...props }) => {
  const intl = intlActions(lang)
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
    permalink,
    // external_link: external,
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
    isIMintable,
    token_id: tokenId,
    tokenInfo: {
      name: infoName,
      background_color: infoBack,
      description: infoDesc,
      expiry: infoExpiry,
      image: infoImage,
    } = {},
  } = item
  const userName = user ? user.username : '---'
  const freezeForm = metadata ? transformFreeze({ ...metadata, expiry: infoExpiry }) : originFreezeForm

  const [txStatus, setTxStatus] = useState('')
  const handleTransaction = (transaction) => {
    setTxStatus('Waiting for sign transaction...')
    return new Promise((resolve, reject) => {
      transaction
        .on('transactionHash', function (hash) {
          console.log(hash)
          setTxStatus('Waiting for confirmation...')
        })
        .on('receipt', function (receipt) {
          console.log(receipt)
          setTxStatus('Transaction confirmed!')
          setTimeout(() => resolve(receipt), 100)
        })
        .on('error', reject)
    })
  }

  const handleFreeze = (e) => {
    e.preventDefault()

    const validations = ['expiryDate', 'expiryTime', 'maxISupply']
    const [isValid, errors] = validate(freezeForm, validations)
    if (!isValid) {
      return setErrors(errors)
    }

    setStatus({ start: 'freeze' })
    handleTransaction(approve(address)(approveAddress, tokenId, { from: owner }))
      .then(() => {
        const { expiryDate, expiryTime, isExclusive, maxISupply, fVersion, iVersion } = freezeForm
        const [year, month, day] = expiryDate.split('-')
        const expiry = parseInt(new Date(Date.UTC(year, month - 1, day, ...expiryTime.split(':'))).getTime() / 1000)
        handleTransaction(
          freeze(address, tokenId, expiry, [isExclusive ? 1 : maxISupply, fVersion, iVersion], {
            from: owner,
          })
        )
          .then(() => {
            onReload('freeze')
          })
          .catch(() => {
            setStatus(null)
          })
      })
      .catch(() => {
        setStatus(null)
      })
  }
  const handleUnfreeze = (e) => {
    e.preventDefault()
    setStatus({ start: 'unfreeze' })
    handleTransaction(unfreeze(tokenId, { from: owner }))
      .then(() => {
        onReload()
      })
      .catch(() => {
        setStatus(null)
      })
  }
  const handleIssueI = (e) => {
    e.preventDefault()
    setStatus({ start: 'issueI' })
    const { iVersion } = mintForm
    handleTransaction(issueI([metadata.tokenId, Number(metadata.endTime), iVersion], { from: owner }))
      .then(() => {
        handleMintForm({ iVersion: 1 })
        onReload()
      })
      .catch(() => {
        setStatus(null)
      })
  }
  const handleRevoke = (e) => {
    e.preventDefault()
    setStatus({ start: 'revokeI' })
    handleTransaction(revokeI(metadata.tokenId, { from: owner }))
      .then(() => {
        onReload()
      })
      .catch(() => {
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
    handleTransaction(transfer(owner, transferForm.to, metadata.tokenId, { from: owner }))
      .then(() => {
        onReload()
      })
      .catch(() => {
        setStatus(null)
      })
  }

  const handleClose = (e) => {
    if (status) return
    onClose(e)
  }

  return (
    <ItemOverlay onClick={handleClose}>
      <ItemDetail onClick={(e) => e.stopPropagation()}>
        <a href={permalink} className="external" target="_blank">
          <img
            src={
              infoImage || image
                ? infoImage || image
                : `https://via.placeholder.com/512/FFFFFF/000000?text=%23${tokenId}`
            }
            alt={infoName || name}
            style={{
              background: infoBack || background ? `#${infoBack || background}` : 'white',
            }}
          />
        </a>
        {!metadata || metadata.baseAssetAddress !== '0x0000000000000000000000000000000000000000' ? (
          <div className="info">
            <Close onClick={handleClose} />
            <div className="heading">
              <p>{assetName}</p>
            </div>
            <h2>{infoName || name}</h2>
            <div className="owner">
              <img src={avatar} alt={userName} />
              <span>
                Owned by <b>{userName.length > 20 ? `${userName.substr(0, 17)}...` : userName}</b>
              </span>
            </div>
            <p className="desc">{infoDesc || description}</p>
            <div className="price">Price: {price ? price : 0}</div>
            <div className="actions">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {!type &&
                    (!!freezeForm ? (
                      <AssetForm
                        {...{
                          form: freezeForm,
                          setForm: handleFreezeForm,
                          readOnly: type === 'FRight',
                        }}
                        errors={errors}
                      />
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
                            {intl.freeze}
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
                  <div className="buttons">
                    {isFrozen === false && freezeForm && (
                      <button disabled={!!status} onClick={handleFreeze}>
                        {intl.submit}
                        {status && status.start === 'freeze' && <img src="/spinner.svg" />}
                      </button>
                    )}
                    {isUnfreezable && (
                      <button disabled={!!status} onClick={handleUnfreeze}>
                        {intl.unfreeze}
                        {status && status.start === 'unfreeze' && <img src="/spinner.svg" />}
                      </button>
                    )}
                    {isIMintable && !freezeForm.isExclusive && (
                      <button disabled={!!status} onClick={handleIssueI}>
                        {intl.issueI}
                        {status && status.start === 'issueI' && <img src="/spinner.svg" />}
                      </button>
                    )}
                    {type === 'IRight' && (
                      <button disabled={!!status} onClick={handleTransfer}>
                        {transferForm ? intl.submit : intl.transfer}
                        {status && status.start === 'transfer' && <img src="/spinner.svg" />}
                      </button>
                    )}
                    {type === 'IRight' && !transferForm && (
                      <button disabled={!!status} onClick={handleRevoke}>
                        {intl.revokeI}
                        {status && status.start === 'revokeI' && <img src="/spinner.svg" />}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            {status && status.start && (
              <Spinner>
                <div className="message">{txStatus || '...'}</div>
              </Spinner>
            )}
          </div>
        ) : (
          <div className="info">
            <h3>Asset is unavailable.</h3>
          </div>
        )}
      </ItemDetail>
    </ItemOverlay>
  )
}

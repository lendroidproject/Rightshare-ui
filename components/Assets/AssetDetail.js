import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { FlexCenter, FlexInline } from '~/components/common/Wrapper'

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

  form {
    button {
      position: relative;
      &:disabled img {
        display: block;
      }
      img {
        display: none;
        position: absolute;
        height: 100%;
        top: 0;
        left: calc(50% - 19px);
      }
    }

    p {
      margin: 4px 0;
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

export default ({ item, onProceed, onClose, ...props }) => {
  const {
    address: owner,
    methods: { approve, freeze },
    addresses: { RightsDao: approveAddress },
  } = props
  const [freezeForm, setFreezeForm] = useState(null)
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
    frozen,
    token_id: tokenId,
  } = item
  const userName = user ? user.username : '---'

  const handleFreeze = e => {
    e.preventDefault()
    setStatus({ start: true })
    approve(address)(approveAddress, tokenId, { from: owner })
      .then(receipt => {
        console.log(0, receipt)
        setStatus({ ...status, process: true })
        const { expiryDate, expiryTime, isExclusive, maxISupply, circulatingISupply } = freezeForm
        const expiry = parseInt(new Date(`${expiryDate}T${expiryTime}:00`).getTime() / 1000)
        freeze(address, tokenId, expiry, isExclusive, maxISupply, circulatingISupply, { from: owner })
          .then(receipt => {
            console.log(1, receipt)
            onProceed()
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
            <form>
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
                  <label onClick={() => setFreezeForm({ ...freezeForm, isExclusive: true })}>Exclusive</label>
                </div>
                <div className="radio">
                  <input
                    type="radio"
                    name="isExclusive"
                    value={2}
                    checked={!freezeForm.isExclusive}
                    onChange={e => setFreezeForm({ ...freezeForm, isExclusive: Number(e.target.value) === 1 })}
                  />
                  <label onClick={() => setFreezeForm({ ...freezeForm, isExclusive: false })}>Non-Exclusive</label>
                </div>
              </div>
              {!freezeForm.isExclusive && (
                <div className="inputs">
                  <div>
                    <label>May Supply - iRights?</label>
                    <input
                      type="number"
                      value={freezeForm.maxISupply}
                      onChange={e => setFreezeForm({ ...freezeForm, maxISupply: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}
              <button onClick={handleFreeze} disabled={!!status}>
                Proceed
                <img src="/spinner.svg" />
              </button>
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

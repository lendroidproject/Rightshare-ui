import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Spinner from '~components/common/Spinner'
import Button from '~components/common/Button'
import Assets from '~components/Assets'

import { Form } from '~components/Assets/AssetForm'
import { getAsset } from '~utils/api'

const MAIN_NETWORK = process.env.MAIN_NETWORK

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .load-more {
    position: relative;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 20px 32px;
    position: relative;

    h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }

    .actions {
      margin: 0 -12px;
      display: flex;

      .button {
        margin: 0 12px;
      }
    }

    &:after {
      content: '';
      left: 32px;
      right: 32px;
      bottom: 0;
      border-top: 1px solid var(--color-border-grey);
      position: absolute;
    }
  }

  .content {
    flex: 1;
    overflow: auto;
    position: relative;
    padding: 0 32px;
  }

  form {
    max-width: 480px;
    margin: 30px auto;
  }
`

export const NoData = styled.p`
  text-align: center;
  margin: 30px 20px;
`
export const Info = styled.div`
  margin-bottom: 15px;
`

export default function (props) {
  const {
    methods: {
      IRight: { fetchRights },
    },
    addresses: { IRight: iRightAddr },
  } = props

  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [assets, setAssets] = useState([])

  const [form, setForm] = useState({})

  const [meta, setMeta] = useState(null)
  const [item, setItem] = useState(null)
  const assetsProps = {
    lang: 'NFT',
    data: assets,
    loadMore: () => {},
    meta,
    setMeta,
    item,
    setItem,
  }

  const handleLookup = () => {
    const { ethAddr, nftAddr, nftId } = form
    setLoading(true)
    fetchRights(ethAddr, nftAddr, Number(nftId))
      .then((assets) => {
        Promise.all(assets.map((asset) => getAsset(ethAddr, iRightAddr, asset.tokenId)))
          .then((origins) =>
            setAssets(origins.map((origin, idx) => ({ ...origin.data, metadata: assets[idx], loaded: true })))
          )
          .catch((err) => {
            console.log(err)
            setAssets([])
          })
          .finally(() => {
            setLoading(false)
            setFetched(true)
          })
      })
      .catch((err) => {
        console.log(err)
        setAssets([])
      })
      .finally(() => {
        setLoading(false)
        setFetched(true)
      })
  }

  return (
    <Wrapper>
      <div className="header">
        <h1>Asset Lookup</h1>
      </div>
      <div className="content scroll-listener">
        <Form onSubmit={(e) => e.preventDefault()}>
          <div className="inputs">
            <div>
              <label>ETH Address</label>
              <input value={form.ethAddr} onChange={(e) => setForm({ ...form, ethAddr: e.target.value })} />
            </div>
          </div>
          <div className="inputs">
            <div>
              <label>NFT Addresss</label>
              <input value={form.nftAddr} onChange={(e) => setForm({ ...form, nftAddr: e.target.value })} />
            </div>
          </div>
          <div className="inputs">
            <div>
              <label>NFT ID</label>
              <input value={form.nftId} onChange={(e) => setForm({ ...form, nftId: e.target.value })} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button disabled={loading} onClick={handleLookup}>
              Find
            </Button>
          </div>
        </Form>
        {loading ? (
          <Spinner />
        ) : (
          fetched && (
            <>
              {assets.length === 0 ? (
                <NoData>
                  No Assets found. Purchase some from{' '}
                  <a href={MAIN_NETWORK ? 'https://opensea.io/assets' : 'https://rinkeby.opensea.io/'} target="_blank">
                    OpenSea
                  </a>
                  .
                </NoData>
              ) : (
                <Assets {...assetsProps} />
              )}
            </>
          )
        )}
      </div>
    </Wrapper>
  )
}

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getMyAssets, forceFetch } from '~utils/api'
import Spinner from '~components/common/Spinner'
import Button from '~components/common/Button'
import Assets from '~components/Assets'

import { filterPlatform, platforms } from '~components/Parcels'
import Dropdown from '../Dropdown'

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
    @media all and (max-width: 767px) {
      background: var(--color-bg-panel);
    }

    padding: 20px 32px;
    position: relative;
    @media all and (max-width: 767px) {
      padding: 11px 24px;
    }

    h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      @media all and (max-width: 767px) {
        font-size: 16px;
      }
    }

    .actions {
      margin: 0 -12px;
      display: flex;
      @media all and (max-width: 767px) {
        margin: 0 -9px;
      }

      .button {
        margin: 0 12px;
        @media all and (max-width: 767px) {
          margin: 0 9px;
        }
      }
    }

    &:after {
      content: '';
      left: 32px;
      right: 32px;
      bottom: 0;
      border-top: 1px solid var(--color-border-grey);
      position: absolute;
      @media all and (max-width: 767px) {
        border: 0;
      }
    }
  }

  .content {
    flex: 1;
    overflow: auto;
    position: relative;
    padding: 0 32px;
    @media all and (max-width: 767px) {
      padding: 17px 2.5% 5px;
      overflow: hidden auto;
    }
  }
`

export const PAGE_LIMIT = 20
export const NoData = styled.p`
  text-align: center;
  margin: 30px 20px;
`
export const Info = styled.div`
  margin-bottom: 15px;

  // .tooltip ol {
  //   margin: 0 15px;
  //   font-size: 15px;
  //   list-style: none;
  //   padding: 10px 15px;

  //   border-radius: 5px;
  //   box-shadow: 0 0 5px #cdad72;

  //   background: #180259;
  //   background: linear-gradient(180deg, #180259 0%, #140249 100%);

  //   li {
  //     margin: 3px 0;
  //     line-height: 1.5;
  //   }
  // }
`

export const fetchInfos = (assets, [owner, iRightAddr, totalNFTRights, baseAsset]) =>
  Promise.all(
    assets.map(
      (asset) =>
        new Promise((resolve) => {
          const {
            token_id: tokenId,
            asset_contract: { address },
          } = asset
          Promise.all([
            new Promise((resolve) =>
              baseAsset(Number(tokenId))
                .then(resolve)
                .catch(() => resolve(null))
            ),
            new Promise((resolve) =>
              totalNFTRights(iRightAddr, address, Number(tokenId))
                .then(resolve)
                .catch(() => resolve(0))
            ),
          ])
            .then(([base, total]) => resolve({ ...asset, totalNFTRights: total, base }))
            .catch((err) => {
              console.log(err)
              resolve({ ...asset, totalNFTRights: 0, base: null })
            })
          // if (asset.image_url || true) return resolve(asset)
          // const {
          //   token_id: tokenId,
          //   asset_contract: { address },
          // } = asset
          // forceFetch({ tokenId, address, owner })
          //   .then(({ data }) =>
          //     resolve({
          //       ...asset,
          //       image_url: asset.image_url || data.image_url,
          //     })
          //   )
          //   .catch((err) => {
          //     resolve(asset)
          //   })
        })
    )
  )

export default function ({ lang, onTab, onParent, children, ...props }) {
  const {
    title,
    info,
    address: owner,
    methods: {
      addresses: { getName },
      IRight: { totalNFTRights, baseAsset },
    },
    dispatch,
    assets = [],
    addresses: { IRight: iRightAddr },
    filtered: origin,
  } = props

  const [page, setPage] = useState({ offset: assets.length, limit: PAGE_LIMIT })
  const [loading, setLoading] = useState(owner !== props.owner || !props.assets)
  const [end, setEnd] = useState(!assets.length || assets.length % PAGE_LIMIT !== 0)
  const [refresh, setRefresh] = useState(false)

  const myAssets = (query, refresh = false) => {
    setLoading(refresh)
    setRefresh(refresh)
    getMyAssets(query)
      .then((response) => response.data)
      .then(({ assets: newAssets }) => {
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: { assets: newAssets, refresh, owner: query.owner },
        })
        setPage({ offset: query.offset + PAGE_LIMIT, limit: PAGE_LIMIT })
        setEnd(newAssets.length < query.limit)
        fetchInfos(newAssets, [owner, iRightAddr, totalNFTRights, baseAsset]).then((data) =>
          dispatch({
            type: 'GET_ASSET_INFO',
            payload: { data, type: 'assets' },
          })
        )
      })
      .catch((error) => {
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: { assets: [], refresh, owner: query.owner },
          error,
        })
        setEnd(true)
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false)
          setRefresh(false)
          const el = document.querySelector('.load-more')
          if (el) {
            el.setAttribute('data-loading', false)
            isScrolledIntoView(el)
          }
        }, 250)
      )
  }
  const loadMore = (refresh = false, { offset = 0, owner } = {}) =>
    myAssets({ offset, limit: PAGE_LIMIT, owner }, refresh)
  const handleRefresh = (refresh = true) => loadMore(refresh, { owner })

  useEffect(() => {
    if (!props.assets) {
      myAssets(
        {
          offset: 0,
          limit: PAGE_LIMIT,
          owner,
        },
        true
      )
    }
  }, [owner, info])

  const isScrolledIntoView = () => {
    const el = document.querySelector('.load-more')
    if (!el || el.dataset.loading === 'true') return
    const rect = el.getBoundingClientRect()
    const elemTop = rect.top
    const elemBottom = rect.bottom
    const isVisible = elemTop >= 0 && elemBottom <= window.innerHeight
    if (isVisible) {
      el.setAttribute('data-loading', true)
      loadMore(false, {
        offset: Number(el.dataset.offset),
        owner: el.dataset.owner,
      })
    }
  }

  useEffect(() => {
    const panel = document.querySelector('.scroll-listener')
    panel && panel.addEventListener('scroll', isScrolledIntoView, false)
    return () => panel && panel.removeEventListener('scroll', isScrolledIntoView, false)
  }, [])

  const filtered = origin.filter((asset) => iRightAddr.toLowerCase() !== asset.asset_contract.address.toLowerCase())
  const [meta, setMeta] = useState(null)
  const [item, setItem] = useState(null)
  const assetsProps = {
    lang,
    data: filtered,
    loadMore: handleRefresh,
    onTab,
    onParent,
    meta,
    setMeta,
    item,
    setItem,
  }

  const [filter, setFilter] = useState([])
  const options = [
    {
      id: 1,
      label: 'VIP Tickets',
    },
    {
      id: 2,
      label: 'Rental',
    },
    {
      id: 3,
      label: 'Grand Opening',
    },
  ]

  return (
    <Wrapper>
      <div className="header">
        <h1>{title}</h1>
        <div className="actions">
          {meta ? (
            <Button
              className="secondary image"
              onClick={() => {
                setMeta(null)
                setItem(null)
              }}
            >
              <img src="/meta/arrow-circle.svg" />
              Back to My Assets
            </Button>
          ) : (
            <>
              <Dropdown
                options={options}
                onSelect={(val) => setFilter(filter.includes(val) ? filter.filter((a) => a !== val) : [...filter, val])}
                position={{ right: '0px' }}
                selection={filter}
                closeOnSelect={false}
              >
                <Button className={`black image ${filter ? 'active' : ''}`}>
                  <img src="/meta/filter.svg" />
                  {filter.length > 0
                    ? filter.length > 1
                      ? `Filter By (${options[filter[0] - 1].label} +${filter.length - 1})`
                      : `Filter By (${options[filter[0] - 1].label})`
                    : 'Filter By'}
                  <img src="/meta/arrow.svg" className="suffix" />
                </Button>
              </Dropdown>
              <Button className="black image" onClick={handleRefresh}>
                <img src="/meta/reload.svg" />
                Refresh
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="content scroll-listener">
        {!refresh && <Assets {...assetsProps} />}
        {loading ? (
          <Spinner />
        ) : (
          <>
            {filtered.length === 0 && (
              <NoData>
                No digital collectibles available in your wallet. Purchase some from{' '}
                <a
                  href={MAIN_NETWORK ? `https://opensea.io/assets/${platforms[lang]}` : 'https://rinkeby.opensea.io/'}
                  target="_blank"
                >
                  OpenSea
                </a>
                .
              </NoData>
            )}
            {!end && <Spinner className="load-more" data-offset={page.offset} data-owner={owner} />}
          </>
        )}
      </div>
    </Wrapper>
  )
}

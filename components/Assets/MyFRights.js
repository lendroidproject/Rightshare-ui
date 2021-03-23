import { useEffect, useState } from 'react'

import { getMyAssets, fetchMetadata } from '~utils/api'
import Spinner from '~components/common/Spinner'
import Button from '~components/common/Button'
import Assets from '~components/Assets'
import { PAGE_LIMIT, NoData, Info, Wrapper } from './MyAssets'

import { filterBase, filterPlatform, platforms, Addresses } from '~components/Parcels'

const MAIN_NETWORK = process.env.MAIN_NETWORK

export const fetchInfos = (assets, [baseAsset, tokenURI]) =>
  Promise.all(
    assets.map(
      (asset) =>
        new Promise((resolve) => {
          Promise.all([
            new Promise((resolve) =>
              baseAsset(Number(asset.token_id))
                .then(resolve)
                .catch(() => resolve(null))
            ),
            tokenURI(Number(asset.token_id)),
          ])
            .then(([base, uri]) => {
              asset.base = base
              asset.lang = Addresses[base[0]]
              if (asset.image_url) return resolve(asset)
              fetchMetadata(uri)
                .then(({ data: tokenInfo }) => resolve({ ...asset, tokenInfo }))
                .catch((err) => {
                  console.log(err)
                  resolve(asset)
                })
            })
            .catch((err) => {
              console.log(err, asset)
              resolve(asset)
            })
        })
    )
  )

export default function ({ lang, info, onTab, onParent, children, ...props }) {
  const {
    address: owner,
    dispatch,
    assets: rights,
    fRights: assets = [],
    addresses: { FRight: asset_contract_address },
    methods: {
      addresses: { getName },
      FRight: { tokenURI, baseAsset },
    },
  } = props
  const [page, setPage] = useState({ offset: assets.length, limit: PAGE_LIMIT })
  const [loading, setLoading] = useState(owner !== props.owner || !props.fRights)
  const [end, setEnd] = useState(!assets.length || assets.length % PAGE_LIMIT !== 0)
  const [refresh, setRefresh] = useState(false)

  const myAssets = (query, refresh = false) => {
    setLoading(true)
    setRefresh(refresh)
    getMyAssets({ ...query, asset_contract_address })
      .then((response) => response.data)
      .then(({ assets: newAssets }) => {
        dispatch({
          type: 'GET_MY_FRIGHTS',
          payload: { assets: newAssets, refresh, owner: query.owner },
        })
        setPage({ offset: query.offset + PAGE_LIMIT, limit: PAGE_LIMIT })
        setEnd(newAssets.length < query.limit)
        fetchInfos(newAssets, [baseAsset, tokenURI])
          .then((data) =>
            dispatch({
              type: 'GET_ASSET_INFO',
              payload: { data, type: 'fRights' },
            })
          )
          .catch(console.log)
      })
      .catch((error) => {
        dispatch({
          type: 'GET_MY_FRIGHTS',
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
    if (owner !== props.owner || !props.fRights) {
      myAssets(
        {
          offset: 0,
          limit: PAGE_LIMIT,
          owner,
        },
        true
      )
    }
  }, [owner])

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
    window.addEventListener('scroll', isScrolledIntoView, false)
    return () => window.removeEventListener('scroll', isScrolledIntoView, false)
  }, [])

  const filteredRights = (rights || []).filter(filterPlatform(lang, getName))
  const filtered = assets.filter(filterBase(lang))
  const assetsProps = {
    lang,
    data: filtered,
    loadMore: handleRefresh,
    onTab,
    onParent,
  }

  const [filter, setFilter] = useState('')

  return (
    <Wrapper>
      <div className="header">
        <h1>{title}</h1>
        <div className="actions">
          <Button className={`black ${filter ? 'active' : ''}`}>Filter By</Button>
          <Button className="black" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </div>
      <div className="content scroll-listener">
        {filtered.length > 0 && (
          <Info>
            <div className="tooltip">
              <ol>
                {info.map((txt, idx) => (
                  <li key={idx}>{txt}</li>
                ))}
              </ol>
            </div>
          </Info>
        )}
        {!refresh && <Assets {...assetsProps} />}
        {loading ? (
          <Spinner />
        ) : (
          <>
            {filtered.length === 0 && (
              <NoData>
                {rights && filteredRights.length === 0 ? (
                  <>
                    No digital collectibles available in your wallet. Purchase some from{' '}
                    <a
                      href={
                        MAIN_NETWORK ? `https://opensea.io/assets/${platforms[lang]}` : 'https://rinkeby.opensea.io/'
                      }
                      target="_blank"
                    >
                      OpenSea
                    </a>
                    .
                  </>
                ) : (
                  <>
                    No fRights available in your wallet. Freeze a digital collectible from your{' '}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        onTab(0)
                      }}
                    >
                      Assets
                    </a>
                    .
                  </>
                )}
              </NoData>
            )}
            {!end && <Spinner className="load-more" data-offset={page.offset} data-owner={owner} />}
          </>
        )}
      </div>
    </Wrapper>
  )
}

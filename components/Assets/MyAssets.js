import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getMyAssets, forceFetch } from '~utils/api'
import Spinner from '~components/common/Spinner'
import Assets from '~components/Assets'

import { filterPlatform, platforms } from '~components/Parcels'

const MAIN_NETWORK = process.env.MAIN_NETWORK

export const Wrapper = styled.div`
  .load-more {
    position: relative;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const PAGE_LIMIT = 20
export const NoData = styled.p`
  text-align: center;
  margin: 30px 20px;
`
export const Refresh = styled.div`
  position: absolute;
  right: 0;
  top: -30px;
  font-size: 1.5em;
  margin-top: 0;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
  animation: fadein 0.5s;
  animation-fill-mode: forwards;
  @media all and (max-width: 767px) {
    top: 5px;
    right: 5px;
  }

  &:hover {
    color: #27a0f7;
  }
`
export const Info = styled.div`
  margin-bottom: 15px;

  .tooltip ol {
    margin: 0 15px;
    font-size: 15px;
    list-style: none;
    padding: 10px 15px;
    background: url(/bg.jpg);
    border-radius: 5px;
    box-shadow: 0 0 5px #cdad72;

    li {
      margin: 3px 0;
      line-height: 1.5;
    }
  }
`

export const fetchInfos = (assets, owner) =>
  Promise.all(
    assets.map(
      (asset) =>
        new Promise((resolve) => {
          if (asset.image_url || true) return resolve(asset)
          const {
            token_id: tokenId,
            asset_contract: { address },
          } = asset
          forceFetch({ tokenId, address, owner })
            .then(({ data }) =>
              resolve({
                ...asset,
                image_url: asset.image_url || data.image_url,
              })
            )
            .catch((err) => {
              resolve(asset)
            })
        })
    )
  )

export default function ({ lang, onTab, onParent, children, ...props }) {
  const {
    address: owner,
    methods: {
      addresses: { getName },
    },
    dispatch,
    assets = [],
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
        fetchInfos(newAssets, owner).then((data) =>
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
    if (owner !== props.owner || !props.assets) {
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

  const filtered = assets.filter(filterPlatform(lang, getName))
  const assetsProps = {
    lang,
    data: filtered,
    loadMore: handleRefresh,
    onTab,
    onParent,
  }

  return (
    <Wrapper>
      {!refresh && <Assets {...assetsProps} />}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Refresh onClick={handleRefresh}>&#8634;</Refresh>
          {filtered.length === 0 && (
            <NoData>
              No digital collectibles available in your wallet. Purchase some from{' '}
              <a
                href={
                  MAIN_NETWORK
                    ? `https://opensea.io/assets/${platforms[lang]}`
                    : 'https://rinkeby.opensea.io/'
                }
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
    </Wrapper>
  )
}

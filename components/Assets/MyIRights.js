import { useEffect, useState } from 'react'

import { getMyAssets } from '~utils/api'
import Spinner from '~components/common/Spinner'
import Assets from '~components/Assets'
import { PAGE_LIMIT, NoData, Refresh, Info, Wrapper } from './MyAssets'
import { fetchInfos } from './MyFRights'

import { filterBase, filterPlatform, platforms } from '~components/Parcels'

const MAIN_NETWORK = process.env.MAIN_NETWORK

export default function ({ lang, info, onTab, onParent, children, ...props }) {
  const {
    address: owner,
    dispatch,
    assets: rights,
    fRights,
    iRights: assets = [],
    addresses: { IRight: asset_contract_address },
    methods: {
      addresses: { getName },
      IRight: { tokenURI, baseAsset },
    },
  } = props
  const [page, setPage] = useState({ offset: assets.length, limit: PAGE_LIMIT })
  const [loading, setLoading] = useState(owner !== props.owner || !props.iRights)
  const [end, setEnd] = useState(!assets.length || assets.length % PAGE_LIMIT !== 0)
  const [refresh, setRefresh] = useState(false)

  const myAssets = (query, refresh = false) => {
    setLoading(true)
    setRefresh(refresh)
    getMyAssets({ ...query, asset_contract_address })
      .then((response) => response.data)
      .then(({ assets: newAssets }) => {
        dispatch({
          type: 'GET_MY_IRIGHTS',
          payload: { assets: newAssets, refresh, owner: query.owner },
        })
        setPage({ offset: query.offset + PAGE_LIMIT, limit: PAGE_LIMIT })
        setEnd(newAssets.length < query.limit)
        fetchInfos(newAssets, [baseAsset, tokenURI]).then((data) =>
          dispatch({
            type: 'GET_ASSET_INFO',
            payload: { data, type: 'iRights' },
          })
        )
      })
      .catch((error) => {
        dispatch({
          type: 'GET_MY_IRIGHTS',
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
    if (owner !== props.owner || !props.iRights) {
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
  const filteredFRights = (fRights || []).filter(filterBase(lang))
  const filtered = assets.filter(filterBase(lang))
  const assetsProps = {
    lang,
    data: filtered,
    loadMore: handleRefresh,
    onTab,
    onParent,
  }

  return (
    <Wrapper>
      {/* {filtered.length > 0 && (
        <Info>
          <div className="tooltip">
            <ol>
              {info.map((txt, idx) => (
                <li key={idx}>{txt}</li>
              ))}
            </ol>
          </div>
        </Info>
      )} */}
      {!refresh && <Assets {...assetsProps} />}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Refresh onClick={handleRefresh}>&#8634;</Refresh>
          {filtered.length === 0 && (
            <NoData>
              {rights && filteredRights.length === 0 ? (
                <>
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
                </>
              ) : !rights || (fRights && filteredFRights.length === 0) ? (
                <>
                  No iRights available in your wallet. Freeze a digital collectible from your{' '}
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
              ) : (
                <>
                  No iRights available in your wallet. Mint an iRight from one of your{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onTab(1)
                    }}
                  >
                    fRights
                  </a>
                  .
                </>
              )}
            </NoData>
          )}
          {!end && <Spinner className="load-more" data-offset={page.offset} data-owner={owner} />}
        </>
      )}
    </Wrapper>
  )
}

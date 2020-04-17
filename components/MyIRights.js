import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import Spinner from '~/components/common/Spinner'
import Assets from '~/components/Assets'
import { PAGE_LIMIT, NoData, Refresh } from './MyAssets'

const MAIN_NETWORK = process.env.MAIN_NETWORK
const Wrapper = styled.div``

export default connect((state) => state)(function ({ children, onTab, ...props }) {
  const {
    address: owner,
    dispatch,
    assets: rights,
    fRights,
    iRights: assets = [],
    addresses: { IRight: asset_contract_address },
  } = props
  const [page, setPage] = useState({ offset: 0, limit: PAGE_LIMIT })
  const [loading, setLoading] = useState(true)
  const [end, setEnd] = useState(false)
  const [refresh, setRefresh] = useState(true)

  const myAssets = (query, refresh = false) => {
    setLoading(true)
    setRefresh(refresh)
    getMyAssets({ ...query, asset_contract_address })
      .then((response) => response.data)
      .then(({ assets: newAssets }) => {
        const allAssets = [...(query.offset ? assets : []), ...newAssets]
        dispatch({
          type: 'GET_MY_IRIGHTS',
          payload: { assets: newAssets, refresh },
        })
        setPage({ offset: query.offset + PAGE_LIMIT, limit: PAGE_LIMIT })
        setEnd(newAssets.length < query.limit)
      })
      .catch((error) => {
        dispatch({
          type: 'GET_MY_IRIGHTS',
          payload: [],
          error,
        })
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
    if (owner) {
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
      loadMore(false, { offset: Number(el.dataset.offset), owner: el.dataset.owner })
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', isScrolledIntoView, false)
    return () => window.removeEventListener('scroll', isScrolledIntoView, false)
  }, [])

  return (
    <Wrapper>
      {!refresh && <Assets data={assets} loadMore={handleRefresh} onTab={onTab} />}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Refresh onClick={handleRefresh}>&#8634;</Refresh>
          {assets.length === 0 && (
            <NoData>
              {rights && rights.length === 0 ? (
                <>
                  No digital collectibles available in your wallet. Purchase some from{' '}
                  <a
                    href={MAIN_NETWORK ? 'https://opensea.io/assets/cryptovoxels' : 'https://opensea.io'}
                    target="_blank"
                  >
                    OpenSea
                  </a>
                  .
                </>
              ) : !rights || (fRights && fRights.length === 0) ? (
                <>
                  No iRights available in your wallet. Freeze a digital collectible from your{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onTab(1)
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
                      onTab(2)
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
})

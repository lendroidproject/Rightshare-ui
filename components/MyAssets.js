import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import Spinner from '~/components/common/Spinner'
import Assets from '~/components/Assets'

const MAIN_NETWORK = process.env.MAIN_NETWORK
const Wrapper = styled.div``

export const PAGE_LIMIT = 20
export const NoData = styled.p`
  text-align: center;
`
export const Refresh = styled.div`
  position: absolute !important;
  right: 20px;
  top: 20px;
  font-size: 1.5em;
  margin-top: 0;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #27a0f7;
  }
`

export default connect((state) => state)(function ({ children, onTab, ...props }) {
  const {
    address: owner,
    methods: {
      addresses: { getName },
    },
    dispatch,
    assets = [],
  } = props
  const [page, setPage] = useState({ offset: 0, limit: PAGE_LIMIT })
  const [loading, setLoading] = useState(true)
  const [end, setEnd] = useState(false)
  const [refresh, setRefresh] = useState(true)

  const myAssets = (query, refresh = false) => {
    setLoading(true)
    setRefresh(refresh)
    ;(MAIN_NETWORK
      ? getMyAssets({ ...query, asset_contract_address: '0x79986af15539de2db9a5086382daeda917a9cf0c' })
      : getMyAssets(query)
    )
      .then((response) => response.data)
      .then(({ assets: newAssets }) => {
        dispatch({
          type: 'GET_MY_ASSETS',
          payload: { assets: newAssets, refresh },
        })
        setPage({ offset: query.offset + PAGE_LIMIT, limit: PAGE_LIMIT })
        setEnd(newAssets.length < query.limit)
      })
      .catch((error) => {
        dispatch({
          type: 'GET_MY_ASSETS',
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
      {!refresh && (
        <Assets
          data={assets.filter(({ asset_contract: { address } }) => !['FRight', 'IRight'].includes(getName(address)))}
          loadMore={loadMore}
          onTab={onTab}
        />
      )}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Refresh onClick={() => loadMore(true, { owner })}>&#8634;</Refresh>
          {assets.length === 0 && (
            <NoData>
              No digital collectibles available in your wallet. Purchase some from{' '}
              <a href={MAIN_NETWORK ? 'https://opensea.io/assets/cryptovoxels' : 'https://opensea.io'} target="_blank">
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
})

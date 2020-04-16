import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getMyAssets } from '~/utils/api'
import Spinner from '~/components/common/Spinner'
import Assets from '~/components/Assets'
import { NoData } from './MyAssets'

const MAIN_NETWORK = process.env.MAIN_NETWORK
const Wrapper = styled.div``

export default connect((state) => state)(function ({ children, onTab, ...props }) {
  const {
    address: owner,
    dispatch,
    assets: rights,
    fRights: assets = [],
    addresses: { FRight: asset_contract_address },
  } = props
  const [page, setPage] = useState({ offset: 0 })
  const [loading, setLoading] = useState(true)

  const myAssets = (query) => {
    setLoading(true)
    getMyAssets({ ...query, asset_contract_address })
      .then((response) => response.data)
      .then(({ assets: newAssets }) => {
        const allAssets = [...(query.offset ? assets : []), ...newAssets]
        dispatch({
          type: 'GET_MY_FRIGHTS',
          payload: allAssets,
        })
        setPage({ offset: allAssets.length })
      })
      .catch((error) => {
        dispatch({
          type: 'GET_MY_FRIGHTS',
          payload: [],
          error,
        })
      })
      .finally(() => setLoading(false))
  }
  const loadMore = (refresh) =>
    myAssets(
      refresh
        ? {
            offset: 0,
            owner,
          }
        : { ...page, owner }
    )

  useEffect(() => {
    if (owner) {
      myAssets({
        offset: 0,
        owner,
      })
    }
  }, [owner])

  return (
    <Wrapper>
      {loading ? (
        <Spinner />
      ) : assets.length > 0 ? (
        <Assets data={assets} loadMore={loadMore} onTab={onTab} />
      ) : (
        <NoData>
          {rights && rights.length === 0 ? (
            <>
              No digital collectibles available in your wallet. Purchase some from{' '}
              <a href={MAIN_NETWORK ? 'https://opensea.io/assets/cryptovoxels' : 'https://opensea.io'} target="_blank">
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
                  onTab(1)
                }}
              >
                Assets
              </a>
              .
            </>
          )}
        </NoData>
      )}
    </Wrapper>
  )
})

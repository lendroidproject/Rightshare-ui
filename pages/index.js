import styled from 'styled-components'
import { connect } from 'react-redux'

import { intlTabs, intlInfo } from '~utils/translation'
import Button from '~components/common/Button'
import AssetLookup from '~components/AssetLookup'
import Intro from '~components/Intro'

import MyAssets from '~components/Assets/MyAssets'
import MyFRights from '~components/Assets/MyFRights'
import MyIRights from '~components/Assets/MyIRights'
import Spinner from '~components/common/Spinner'

const MAIN_NETWORK = process.env.MAIN_NETWORK

const Accordion = styled.div`
  display: flex;
  height: 100%;

  > div:nth-child(1) {
    border-radius: 0 10px 10px 0;
  }

  > div:nth-child(2) {
    border-radius: 10px 0 0 10px;
  }

  .panel {
    flex: 1;
    height: 100%;
    overflow: auto;
    background: var(--color-bg-panel);
    position: relative;
  }
`

const Tabs = styled.div`
  background: var(--color-bg1);
  background: var(--color-grad1);

  display: flex;
  flex-direction: column;
  min-width: 250px;
  margin-right: 20px;

  .tab {
    padding: 18px 32px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-primary);
    }

    svg {
      margin-left: 10px;
    }

    &.active {
      color: var(--color-highlight);

      svg {
        transform: rotate(180deg);
        transition: all 0.2s;
      }
    }
  }

  &.child {
    background: transparent;
    width: 100%;

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-primary);
    }

    .tab {
      padding: 10px 32px;
      font-weight: normal;
      font-size: 14px;
      position: relative;
      justify-content: flex-start;

      img {
        margin-right: 10px;
      }

      &.active {
        background-color: var(--color-bg5);
        background: var(--color-grad5);
        color: white;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 10px;
          background-color: var(--color-tab);
          background: var(--color-tab-grad);
        }
      }
    }
  }
`

// const tabs = [
//   ...(MAIN_NETWORK
//     ? [
//         {
//           label: 'CryptoVoxels Parcels',
//           hasChild: true,
//           lang: 'CV',
//         },
//       ]
//     : [
//         {
//           label: 'Other NFTs',
//           hasChild: true,
//           lang: 'NFT',
//         },
//         {
//           label: 'CryptoVoxels Parcels',
//           hasChild: true,
//           lang: 'CV',
//         },
//         {
//           label: 'Ethereum Name Service',
//           hasChild: true,
//           lang: 'ENS',
//         },
//       ]),
//   {
//     label: 'How it works',
//     Component: Intro,
//   },
// ]

const childTabs = [
  { label: 'MyAssets', Component: MyAssets, info: 'iRight', icon: '/meta/myassets.svg' },
  // { label: 'MyFRights', Component: MyFRights, info: 'fRight' },
  { label: 'MyIRights', Component: MyIRights, info: 'iRight', icon: '/meta/irights.svg' },
]

class MetaTokenUI extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: false,
      active: 0,
      open: 0,
      activeChild: '0-0',
    }
  }

  render() {
    const { show, active, open, activeChild } = this.state
    const {
      assets = [],
      // addresses: { IRight: iRightAddr },
    } = this.props

    const assetTypes = {}
    const baseMap = {}
    const iRightAddr = this.props.addresses && this.props.addresses.IRight.toLowerCase()
    assets.forEach((asset) => {
      if (asset.asset_contract.address.toLowerCase() === iRightAddr) return
      if (!assetTypes[asset.asset_contract.name]) {
        assetTypes[asset.asset_contract.name] = [asset]
      } else {
        assetTypes[asset.asset_contract.name].push(asset)
      }
      baseMap[asset.asset_contract.address.toLowerCase()] = asset.asset_contract.name
    })
    assets.forEach((asset) => {
      if (asset.asset_contract.address.toLowerCase() !== iRightAddr) return
      if (!asset.base) return
      if (baseMap[asset.base.baseAssetAddress.toLowerCase()]) {
        assetTypes[baseMap[asset.base.baseAssetAddress.toLowerCase()]].push(asset)
      }
    })

    const tabs = [
      ...(!this.props.assets
        ? [
            {
              label: '...',
              hasChild: true,
              lang: 'NFT',
              assets: [],
            },
          ]
        : Object.keys(assetTypes).map((assetName) => ({
            label: assetName,
            hasChild: true,
            lang: 'NFT',
            assets: assetTypes[assetName],
          }))),
      {
        label: 'Access Lookup',
        Component: AssetLookup,
      },
      {
        label: 'How it works',
        Component: Intro,
      },
    ]

    const { hasChild, lang = 'NFT', assets: filtered } = tabs[active]
    const intl = intlTabs(lang)
    const info = intlInfo(lang)

    const Component = (hasChild ? childTabs[activeChild.split('-')[1]] : tabs[active]).Component
    const tabProps = hasChild
      ? {
          lang,
          title: intl[childTabs[activeChild.split('-')[1]].label],
          info: info[childTabs[activeChild.split('-')[1]].info],
          onParent: () => this.setState({ active: tabs.length - 1 }),
          onTab: (child) => this.setState({ activeChild: `${active}-${child}` }),
          filtered,
        }
      : {}

    const handleActive = (active) => {
      this.setState({
        active,
        activeChild: `${active}-0`,
        show: false,
        open: active,
      })
    }

    const Tab = ({ label, icon, hasChild, open, active, onSelect }) => (
      <>
        <div key={label} className={`tab ${active ? 'active' : ''}`} onClick={onSelect}>
          {icon && <img src={icon} alt="icon" />}
          {label}
          {hasChild && (
            <svg width="12px" height="8px" viewBox="0 0 12 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <title>Arrow Copy</title>
              <desc>Created with Sketch.</desc>
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g
                  id="1"
                  transform="translate(-1262.000000, -138.000000)"
                  fill={active ? 'var(--color-highlight)' : 'var(--color-text)'}
                >
                  <g id="Group-7" transform="translate(1165.000000, 124.000000)">
                    <g id="Group-8-Copy">
                      <path
                        d="M105.35809,23.7557077 L99.1947679,18.4073 C98.9350774,18.1821593 98.9350774,17.8184255 99.1947679,17.5927 L105.35809,12.2442923 C105.732977,11.9185692 106.342916,11.9185692 106.718469,12.2442923 C107.093355,12.5700154 107.093355,13.0986574 106.718469,13.4243805 L101.446085,18.0002924 L106.718469,22.5750347 C107.093355,22.9013426 107.093355,23.4299846 106.718469,23.7557077 C106.342916,24.0814308 105.732977,24.0814308 105.35809,23.7557077"
                        id="Arrow-Copy"
                        transform="translate(103.000000, 18.000000) scale(1, -1) rotate(90.000000) translate(-103.000000, -18.000000) "
                      ></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          )}
        </div>
        {hasChild && active && open && renderChilds(lang, assets)}
      </>
    )

    const renderChilds = (lang, assets) => {
      const tabs = childTabs.map(({ label, info: infoKey, icon }) => ({
        label: intl[label],
        info: info[infoKey],
        icon,
      }))

      return (
        <Tabs className="child">
          {tabs.map(({ label, icon }, index) => (
            <Tab
              key={index}
              active={activeChild === `${active}-${index}`}
              label={label}
              icon={icon}
              onSelect={() => this.setState({ activeChild: `${active}-${index}` })}
            />
          ))}
        </Tabs>
      )
    }

    return (
      <Accordion>
        <Tabs>
          {tabs.map(({ label, hasChild }, index) => (
            <Tab
              key={index}
              label={label}
              active={active === index}
              hasChild={hasChild}
              open={open === index}
              onSelect={() => (active === index ? this.setState({ show: !show }) : handleActive(index))}
            />
          ))}
        </Tabs>
        <div className="panel">{this.props.address ? <Component {...tabProps} {...this.props} /> : <Spinner />}</div>
      </Accordion>
    )
  }
}

export default connect((state) => state)(MetaTokenUI)

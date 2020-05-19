import { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { FlexCenter } from '~/components/common/Wrapper'
import MyAssets from '~components/MyAssets'
import MyFRights from '~components/MyFRights'
import MyIRights from '~components/MyIRights'
import Spinner from '~/components/common/Spinner'

export const CV_ADDR = '0x79986af15539de2db9a5086382daeda917a9cf0c'

export const filterCV = (isCV, getName) => ({ asset_contract: { address } }) =>
  !['FRight', 'IRight'].includes(getName(address)) &&
  (address.toLowerCase() === CV_ADDR) === isCV
export const filterBase = (isCV) => ({ base }) =>
  (base && base[0].toLowerCase() === CV_ADDR) === isCV

export const Accordion = styled.div`
  .panel {
    padding: 10px 0;
    min-height: 100px;
  }
`

export const Tabs = styled(FlexCenter)`
  border-bottom: 1px solid #eee;

  > div {
    padding: 5px 10px;
    cursor: pointer;
    font-size: 13px;
    position: relative;
    margin-right: 9px;

    &:hover,
    &.active {
      background-color: #27a0f7;
      color: white;
    }
    &:hover {
      opacity: 0.8;
    }
    &:not(:last-child):after {
      border-right: 1px solid rgba(39, 160, 247, 0.48);
      content: '';
      position: absolute;
      right: -5px;
      top: 5px;
      bottom: 5px;
    }
  }
`

export const Tab = ({ label, active, onSelect }) => (
  <div key={label} className={active ? 'active' : ''} onClick={onSelect}>
    {label}
  </div>
)

const tabs = [
  { label: 'My Parcels', Component: MyAssets },
  { label: 'My Landlord Tokens', Component: MyFRights },
  { label: 'My Rental Tokens', Component: MyIRights },
]

export default connect((state) => state)(function ({ onTab, ...props }) {
  const [active, setActive] = useState(0)
  const { Component } = tabs[active]
  const tabLabels = tabs.map(({ label }) => label)

  return (
    <Accordion>
      <Tabs>
        {tabLabels.map((label, index) => (
          <Tab
            key={index}
            label={label}
            active={active === index}
            onSelect={() => setActive(index)}
          />
        ))}
      </Tabs>
      <div className="panel">
        {props.addresses ? (
          <Component onParent={onTab} onTab={setActive} {...props} isCV />
        ) : (
          <Spinner />
        )}
      </div>
    </Accordion>
  )
})

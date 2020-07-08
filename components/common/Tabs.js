import { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { intlTabs, intlInfo } from '~utils/translation'
import { FlexCenter } from '~components/common/Wrapper'
import MyAssets from '~components/Assets/MyAssets'
import MyFRights from '~components/Assets/MyFRights'
import MyIRights from '~components/Assets/MyIRights'
import Spinner from '~components/common/Spinner'

export const Accordion = styled.div`
  .panel {
    padding: 15px 0;
    min-height: 100px;
    position: relative;
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
    @media all and (max-width: 767px) {
      font-size: 12px;
      white-space: nowrap;
    }

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

const Tab = ({ active, label, onSelect }) => (
  <div key={label} className={active ? 'active' : ''} onClick={onSelect}>
    {label}
  </div>
)

export default connect((state) => state)(function ({ lang, onTab, ...props }) {
  const intl = intlTabs(lang)
  const info = intlInfo(lang)
  const tabs = [
    { label: intl.MyAssets, Component: MyAssets },
    // { label: intl.MyFRights, Component: MyFRights, info: info.fRight },
    { label: intl.MyIRights, Component: MyIRights, info: info.iRight },
  ]

  const [active, setActive] = useState(0)
  const { Component } = tabs[active]

  const tabProps = {
    lang,
    info: tabs[active].info,
    onParent: onTab,
    onTab: setActive,
  }

  return (
    <Accordion>
      <Tabs>
        {tabs.map(({ label }, index) => (
          <Tab key={index} active={active === index} label={label} onSelect={() => setActive(index)} />
        ))}
      </Tabs>
      <div className="panel">{props.web3 && props.address ? <Component {...tabProps} {...props} /> : <Spinner />}</div>
    </Accordion>
  )
})

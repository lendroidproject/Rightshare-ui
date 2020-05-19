import { useState } from 'react'
import { connect } from 'react-redux'

import { intlTabs } from '~utils/translation'
import MyAssets from '~components/MyAssets'
import MyFRights from '~components/MyFRights'
import MyIRights from '~components/MyIRights'
import Spinner from '~components/common/Spinner'

import { Accordion, Tabs, Tab } from './Parcels'

const lang = 'NFT'
const intl = intlTabs(lang)
const tabs = [
  { label: intl.MyAssets, Component: MyAssets },
  { label: intl.MyFRights, Component: MyFRights },
  { label: intl.MyIRights, Component: MyIRights },
]

export default connect((state) => state)(function ({ onTab, ...props }) {
  const [active, setActive] = useState(0)
  const { Component } = tabs[active]
  const tabLabels = tabs.map(({ label }) => label)

  return (
    <Accordion>
      <Tabs>
        {tabLabels.map((label, index) => (
          <Tab key={index} label={label} active={active === index} onSelect={() => setActive(index)} />
        ))}
      </Tabs>
      <div className="panel">
        {props.addresses ? <Component onParent={onTab} onTab={setActive} lang={lang} {...props} /> : <Spinner />}
      </div>
    </Accordion>
  )
})

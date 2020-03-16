import { useState } from 'react'
import styled from 'styled-components'

import { FlexCenter } from '~/components/common/Wrapper'
import Assets from '~components/Assets'

const Accordion = styled.div`
  width: 100%;

  .accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 20px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
  }

  .active,
  .accordion:hover {
    background-color: #ccc;
  }

  .panel {
    padding: 20px;
    background-color: white;
    overflow: hidden;
  }
`

const Tabs = styled(FlexCenter)`
  border-bottom: 1px solid #eee;

  > div {
    padding: 10px;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
  }
`

const Tab = ({ label, active, onSelect }) => (
  <div key={label} className={active ? 'active' : ''} onClick={onSelect}>
    {label}
  </div>
)

const tabs = [
  {
    label: 'My Assets',
    Component: Assets,
  },
  {
    label: 'My Tokens',
    Component: () => <div>Coming soon...</div>,
  },
]

export default function() {
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
        <Component />
      </div>
    </Accordion>
  )
}

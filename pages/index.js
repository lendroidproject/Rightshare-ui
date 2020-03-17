import { useState } from 'react'
import styled from 'styled-components'

import { FlexCenter } from '~/components/common/Wrapper'
import Intro from '~components/Intro'
import Assets from '~components/Assets'

const Accordion = styled.div`
  background: white;
  min-height: calc(100vh - 164px);
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 25px;
  border-radius: 5px;
  overflow: hidden;
  @media all and (max-width: 767px) {
    min-height: calc(100vh - 208px);
  }

  * {
    color: black;
  }

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

  .panel {
    padding: 20px;
    background-color: white;
    overflow: hidden;
  }
`

const Tabs = styled(FlexCenter)`
  border-bottom: 1px solid #eee;

  @media all and (max-width: 767px) {
    flex-wrap: wrap;

    > div {
      width: 50%;
      text-align: center;
    }
  }

  > div {
    padding: 10px;
    cursor: pointer;

    &:hover,
    &.active {
      background-color: #27a0f7;
      color: white;
    }
  }
`

const Tab = ({ label, active, onSelect }) => (
  <div key={label} className={active ? 'active' : ''} onClick={onSelect}>
    {label}
  </div>
)

const tabs = [
  {
    label: 'How it works',
    Component: Intro,
  },
  {
    label: 'My Assets',
    Component: Assets,
  },
  {
    label: 'My FRights',
    Component: () => <div>Coming soon...</div>,
  },
  {
    label: 'My IRights',
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

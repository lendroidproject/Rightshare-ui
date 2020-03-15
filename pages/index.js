import { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

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
    display: none;
    background-color: white;
    overflow: hidden;
  }

  .active + .panel {
    display: block;
  }
`

export default connect(state => state)(function(props) {
  const [active, setActive] = useState(0)

  return (
    <Accordion>
      <button className={`accordion ${active === 0 && 'active'}`} onClick={() => setActive(0)}>
        My Assets
      </button>
      <div className="panel">
        <Assets />
      </div>

      <button className={`accordion ${active === 1 && 'active'}`} onClick={() => setActive(1)}>
        Section 2
      </button>
      <div className="panel">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
      </div>

      <button className={`accordion ${active === 2 && 'active'}`} onClick={() => setActive(2)}>
        Section 3
      </button>
      <div className="panel">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
      </div>
    </Accordion>
  )
})

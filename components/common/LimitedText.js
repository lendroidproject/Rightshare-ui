import styled from 'styled-components'
import { createRef, useState, useEffect } from 'react'

const Wrapper = styled.div`
  position: relative;

  .input-wrapper {
    display: flex;

    .mask.input {
      position: absolute;
      border: 1px solid transparent;
      background: transparent;
      height: 100%;
      user-select: none;
      pointer-events: none;

      &.scroll {
        word-break: break-all;
        overflow: hidden scroll;
      }
    }

    .exceed {
      background: rgba(255, 0, 0, 0.24);
    }

    textarea {
      color: transparent !important;
      caret-color: var(--color-text);
      height: 40px;
      word-break: break-all;
    }
  }

  .counter {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    right: 3px;
    bottom: calc(100% + 3px);

    svg {
      width: 20px;
      height: 20px;
      transform: rotate(-85deg);
      transform-origin: center;

      &.large {
        width: 28px;
        height: 28px;
      }
    }

    span {
      font-size: 70%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
`

export default function LimitedText({ value = '', onChange, max, warn, exceed }) {
  const textarea = createRef()
  const mask = createRef()

  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    setScroll(textarea.current && textarea.current.scrollHeight > 40)
  }, [value])

  return (
    <Wrapper className="limited-text">
      <div className="input-wrapper">
        <div className={`mask input ${scroll ? 'scroll' : ''}`} ref={mask}>
          {value.substr(0, max)}
          {value.length > max && <span className="exceed">{value.substr(max)}</span>}
        </div>
        <textarea
          ref={textarea}
          value={value}
          onChange={onChange}
          onScroll={(e) => {
            if (textarea.current && mask.current) {
              mask.current.scrollTop = textarea.current.scrollTop
            }
          }}
        />
      </div>
      <div className="counter">
        <svg height="100%" viewBox="0 0 20 20" width="100%" className={value.length > max - warn ? 'large' : 'small'}>
          <circle cx="50%" cy="50%" fill="none" strokeWidth="2" r="9" stroke="#E6ECF0" />
          <circle
            cx="50%"
            cy="50%"
            fill="none"
            strokeWidth="2"
            r="9"
            stroke={value.length <= max - warn ? '#1DA1F2' : value.length > max ? '#E0245E' : '#FFAD1F'}
            strokeLinecap="round"
            style={{
              strokeDashoffset: (56.5487 * (max - Math.min(max, value.length))) / max,
              strokeDasharray: 56.5487,
            }}
          />
        </svg>
        {value.length > max - warn && <span>{max - value.length}</span>}
      </div>
    </Wrapper>
  )
}

import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1;
  @media all and (max-width: 767px) {
    position: fixed;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(22.5deg);
    }
    100% {
      transform: rotate(45deg);
    }
  }
  .spin > div {
    transform-origin: 50px 50px;
    animation: spin 0.2s infinite linear;
  }
  .spin > div div {
    position: absolute;
    width: 11px;
    height: 76px;
    background: var(--color-text);
    left: 50px;
    top: 50px;
    transform: translate(-50%, -50%);
  }
  .spin > div div:nth-child(1) {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .spin > div div:nth-child(6) {
    width: 40px;
    height: 40px;
    background: var(--color-bg);
    border-radius: 50%;
  }
  .spin > div div:nth-child(3) {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .spin > div div:nth-child(4) {
    transform: translate(-50%, -50%) rotate(90deg);
  }
  .spin > div div:nth-child(5) {
    transform: translate(-50%, -50%) rotate(135deg);
  }
  .loadingio-spinner {
    width: 60px;
    height: 60px;
    display: inline-block;
    overflow: hidden;
    background: transparent;
  }
  .spin {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(0.6);
    backface-visibility: hidden;
    transform-origin: 0 0;
  }
  .spin div {
    box-sizing: content-box;
  }
`

export default ({ className = '', children, ...props }) => (
  <Wrapper className={`spinner ${className}`} {...props}>
    <div className="loadingio-spinner">
      <div className="spin">
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
    {children && children}
  </Wrapper>
)

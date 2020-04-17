import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  @keyframes spin {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .spin div {
    left: 47.5px;
    top: 22.5px;
    position: absolute;
    animation: spin linear 1s infinite;
    background: #5e54ac;
    width: 5px;
    height: 15px;
    border-radius: 2.5px / 3px;
    transform-origin: 2.5px 27.5px;
  }
  .spin div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -0.9166666666666666s;
    background: #5e54ac;
  }
  .spin div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -0.8333333333333334s;
    background: #5e54ac;
  }
  .spin div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.75s;
    background: #5e54ac;
  }
  .spin div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.6666666666666666s;
    background: #5e54ac;
  }
  .spin div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.5833333333333334s;
    background: #5e54ac;
  }
  .spin div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.5s;
    background: #5e54ac;
  }
  .spin div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.4166666666666667s;
    background: #5e54ac;
  }
  .spin div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.3333333333333333s;
    background: #5e54ac;
  }
  .spin div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.25s;
    background: #5e54ac;
  }
  .spin div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.16666666666666666s;
    background: #5e54ac;
  }
  .spin div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.08333333333333333s;
    background: #5e54ac;
  }
  .spin div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
    background: #5e54ac;
  }
  .spin {
    width: 60px;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(0.6);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
  }
  .spin div {
    box-sizing: content-box;
  }
`

export default ({ className = '', ...props }) => (
  <Wrapper className={`spinner ${className}`} {...props}>
    <div className="spin">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </Wrapper>
)

import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
`

export const FlexInline = styled(Flex)`
  align-items: center;
`

export const FlexCenter = styled(FlexInline)`
  justify-content: center;
`

export const FlexWrap = styled(FlexCenter)`
  flex-wrap: wrap;
`

export const FlexCol = styled(Flex)`
  flex-direction: column;
`

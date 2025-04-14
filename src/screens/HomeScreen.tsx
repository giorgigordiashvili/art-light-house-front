'use client'
import styled from 'styled-components'

const StyledComponent = styled.div`
  background: red;
  height: 200px;
`

type Props = {}

function HomeScreen({}: Props) {
  return <StyledComponent>HomeScreen</StyledComponent>
}

export default HomeScreen

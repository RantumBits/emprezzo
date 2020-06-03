import React from "react"
import { css } from "styled-components"
import styled from '@emotion/styled'
import { Search } from "@styled-icons/fa-solid"
import { Algolia } from "@styled-icons/fa-brands"
export const Root = styled.div`
  position: relative;
  display: grid;
  grid-gap: 1em;
`
export const SearchIcon = styled(Search)`
  width: 1em;
  pointer-events: none;
`
const focus = css`
  background: white;
  color: ${props => props.theme.darkBlue};
  cursor: text;
  width: 5em;
  + ${SearchIcon} {
    color: ${props => ((props.variation && props.variation == "light") ? props.theme.colors.white.light :  props.theme.colors.primary.light)};
    margin: 0.5em;
  }
`
const collapse = css`
  width: 0;
  cursor: pointer;
  color: ${props => props.theme.lightBlue};
  + ${SearchIcon} {
    color: ${props => ((props.variation && props.variation == "light") ? props.theme.colors.white.light :  props.theme.colors.primary.light)};
  }
  ${props => props.focus && focus}
  margin-left: ${props => (props.focus ? `-1.6em` : `-1em`)};
  padding-left: ${props => (props.focus ? `1.6em` : `1em`)};
  ::placeholder {
    color: ${props => props.theme.gray};
  }
`
const expand = css`
  background: ${props => props.theme.veryLightGray};
  width: 6em;
  margin-left: -1.6em;
  padding-left: 1.6em;
  + ${SearchIcon} {
    margin: 0.3em;
  }
`

export const Input = styled.input`
  outline: none;
  border: 0.5px solid ${props => ((props.variation && props.variation == "light") ? props.theme.colors.white.light :  props.theme.colors.primary.light)};
  font-size: 1em;
  background: transparent;
  color: ${props => ((props.variation && props.variation == "light") ? props.theme.colors.white.light :  props.theme.colors.primary.light)};
  padding-left: 5px;
  margin-left: 5px;
  transition: ${props => props.theme.shortTrans};
  border-radius: ${props => props.theme.smallBorderRadius};
  {highlight-next-line}
  ${props => (props.collapse ? collapse : expand)};
`
export const Form = styled.form`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  text-align: center;
  justify-content: center;
  margin: 0px;
`

export const HitsWrapper = styled.div`
  display: ${props => (props.show ? `grid` : `none`)};
  max-height: 80vh;
  overflow: scroll;
  z-index: 999;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  right: ${props => (props.homepage ? `35%` : `25%`)};
  top: calc(100% + 0.5em);
  width: 80vw;
  max-width: 30em;
  box-shadow: 0 0 5px 0;
  padding: 0.7em 1em 0.4em;
  background: white;
  border-radius: ${props => props.theme.smallBorderRadius};
  @media (max-width: 500px) {
    right: 15%;
  }
  > * + * {
    padding-top: 1em !important;
    border-top: 2px solid ${props => props.theme.darkGray};
  }
  li + li {
    margin-top: 0.7em;
    padding-top: 0.7em;
    border-top: 1px solid ${props => props.theme.lightGray};
  }
  * {
    margin-top: 0;
    padding: 0;
  }
  ul {
    list-style: none;
  }
  mark {
    color: ${props => props.theme.lightBlue};
    background: ${props => props.theme.darkBlue};
  }
  header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3em;
    h3 {
      padding: 0.1em 0.4em;
      border-radius: 0.2em;
      background: ${props => props.theme.colors.black.blue};
      color: ${props => props.theme.colors.white.light};
    }
  }
  h3 {
    margin: 0 0 0.5em;
  }
  h4 {
    font-size: 1.1em;
    color: ${props => props.theme.colors.black.blue};
    margin-bottom: 0.3em;
  }
`
export const PoweredBy = () => (
  <span css="font-size: 0.6em; text-align: end; padding: 0;">

  </span>
)

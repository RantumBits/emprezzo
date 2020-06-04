import React, { useState, useEffect, createRef, useRef } from "react"
import {
  InstantSearch,
  Index,
  connectStateResults,
} from "react-instantsearch-dom"
import algoliasearch from "algoliasearch/lite"

import { Root, HitsWrapper, PoweredBy } from "./styles"
import Input from "./input"
import Hits from './hits'

const Results = connectStateResults(
  ({ searching, searchState, searchResults: res }) =>
    (searching && <div>Searching...</div>) ||
    (res && res.nbHits === 0 && <div>No results for &apos;{searchState.query}&apos;</div>)
)

const Stats = connectStateResults(
  ({ searchResults: res }) =>
    res && res.nbHits > 0 && `${res.nbHits} result${res.nbHits > 1 ? `s` : ``}`
)

export function useOnClickOutside(ref, handler, events) {
  if (!events) events = [`mousedown`, `touchstart`]
  const detectClickOutside = event =>
    ref.current && event && !ref.current.contains(event.target) && handler(event)
  useEventListener(events, detectClickOutside)
}

export function useEventListener(eventNames, handler, element) {
  // Create a ref that stores the handler.
  const savedHandler = useRef()
  if (!Array.isArray(eventNames)) eventNames = [eventNames]

  useEffect(() => (savedHandler.current = handler), [handler])

  useEffect(() => {
    if (!element || !element.addEventListener) return // Element doesn't support a listener, abort.

    // Create event listener that calls handler function stored in ref
    const listener = event => savedHandler.current(event)
    for (const e of eventNames) element.addEventListener(e, listener)
    return () => {
      for (const e of eventNames) element.removeEventListener(e, listener)
    }
  }, [element, eventNames])
}

export default function Search({ indices, collapse, homepage, hitsAsGrid, variation }) {
  const ref = createRef()
  const [query, setQuery] = useState(``)
  const [focus, setFocus] = useState(false)
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  )
  useOnClickOutside(ref, () => setFocus(false))
  return (
    <Root ref={ref}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indices[0].name}
        onSearchStateChange={({ query }) => setQuery(query)}
      >
        <Input onFocus={() => setFocus(true)} {...{ collapse, focus }} variation={variation} />
        <HitsWrapper show={query.length > 0 && focus} asGrid={hitsAsGrid} homepage={homepage}>
          {indices.map(({ name, title, type }) => (
            <Index key={name} indexName={name}>
              <header>
                <h3>{title}</h3>
                <Stats />
              </header>
              <Results />
              <Hits type={type} onClick={() => setFocus(false)} />
            </Index>
          ))}

        </HitsWrapper>
      </InstantSearch>
    </Root>
  )
}

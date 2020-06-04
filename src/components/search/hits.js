import { Link } from 'gatsby'
import React, { Fragment } from 'react'
import { Highlight, Snippet } from 'react-instantsearch-dom'
import { Tag } from 'styled-icons/octicons'
import { Calendar } from 'styled-icons/octicons'
import { connectHits } from 'react-instantsearch-dom'

const shopHit = hit => (
  <div>
    <Tag size="1em" />
    &nbsp;
    <Highlight attribute="tags" hit={hit} tagName="mark" />
  </div>
)

export default connectHits(function HitComp({ type, hits, onClick }) {
  const extend = { shopHit }[type]
  return hits.map(hit => (
    <div key={hit.objectID}>
      <Link to={`/shops/` + hit.slug} onClick={onClick}>
        <h4>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </h4>
      </Link>
      <Highlight attribute="about" hit={hit} tagName="mark" />
      <Snippet attribute="about" hit={hit} tagName="mark" />
    </div>
  ))
})

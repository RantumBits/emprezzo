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
  //console.log(hits)
  //adding the excertp of 140 characters to all the hits
  hits.map(hit => {
      if(hit._highlightResult.about){
        let text = hit._highlightResult.about.value;
        //remove the highlighting
        text = text.replace("<ais-highlight-0000000000>","");
        text = text.replace("</ais-highlight-0000000000>","");
        text = text.substring(0,140)+"...";
        //add the highlighting back
        text = text.replace(hit._highlightResult.about.matchedWords[0],"<ais-highlight-0000000000>"+hit._highlightResult.about.matchedWords[0]+"</ais-highlight-0000000000>")
        hit._highlightResult.about.value = text;
    }
  })

  return hits.map(hit => (
    <div key={hit.objectID}>
      <Link to={`/shops/` + hit.slug} onClick={onClick}>
        <h4>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </h4>
      </Link>
      <Highlight attribute="about" hit={hit} tagName="mark" />
    </div>
  ))
})

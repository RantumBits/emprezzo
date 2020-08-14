import React from 'react';
import { Link, useStaticQuery } from 'gatsby';
import styled from '@emotion/styled';
import Headroom from 'react-headroom';
import logo from '../../static/logo/logo.png';
import Search from '../components/search'

const searchIndices = [
  { name: `uncommonry`, title: `Shops`, type: `shopHit` },
]

const StyledLink = styled(Link)`
  display: flex;
  font-weight: 700;
  align-items: center;
`;

const NavWrapper = styled.div`

`

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  font-family: ${props => props.theme.fontFamily.body};
  font-weight: 500;
  font-size: 1.1rem;
  align-items: center;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.75rem;
    margin-left: -10px;
  }
  a {
    color: ${props => props.theme.colors.white.base};
    margin-left: 2rem;
    transition: all ${props => props.theme.transitions.default.duration};
    &:hover {
      color: ${props => props.theme.colors.white.grey};
    }
    @media (max-width: ${props => props.theme.breakpoints.s}) {
      margin-left: 0.5rem;
    }
  }

  /* The dropdown container */
  .dropdown {
    float: left;
    overflow: hidden;
    color: ${props => props.theme.colors.white.base};
    margin-left: 2rem;
    transition: all ${props => props.theme.transitions.default.duration};
    &:hover {
      color: ${props => props.theme.colors.white.grey};
      cursor: pointer;
    }
    @media (max-width: ${props => props.theme.breakpoints.s}) {
      margin-left: 0.5rem;
    }
  }

  /* Dropdown content (hidden by default) */
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    float: none;
    color: black;
    margin-left: 0rem;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
  }

  /* Add a grey background color to dropdown links on hover */
  .dropdown-content a:hover {
    background-color: #ddd;
  }

  /* Show the dropdown menu on hover */
  .dropdown:hover .dropdown-content {
    display: block;
  }

  input {
    @media (max-width: 600px) {
      width: 150px !important;
    }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
    display: grid;
    color: black;
    gap: 1em;
`;

const NavBar = () => {

  return (
    <Headroom calcHeightOnResize disableInlineStyles>
      <StyledLink to="/">
        <img src={logo} className="logo" title="emprezzo - Discover the best online shopping sites & direct to consumer brands" alt="emprezzo - Discover the best online shopping sites & direct to consumer brands" />
      </StyledLink>
      <NavWrapper>
        <Nav>
        <div className="dropdown">
          <Link to="/shops">Discover </Link>
          <div className="dropdown-content">
              <Link key="2" to="/top-shopify-stores">Top Shopify stores</Link>
              <Link key="3" to="/amazon-alternatives">Amazon alternatives</Link>
              <Link key="4" to="/stores-that-accept-paypal">Stores that accept Paypal</Link>
              <Link key="5" to="/buynow-paylater-stores">Buy now, pay later stores </Link>
              <Link key="6" to="/products">Shopify products</Link>
          </div>
        </div>
          <SearchWrapper>
            <Search collapse indices={searchIndices} variation={"light"} />
          </SearchWrapper>
        </Nav>
      </NavWrapper>
    </Headroom >
  );

}

export default NavBar;

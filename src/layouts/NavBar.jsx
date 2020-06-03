import React from 'react';
import { Link, useStaticQuery } from 'gatsby';
import styled from '@emotion/styled';
import Headroom from 'react-headroom';
import logo from '../../static/logo/header-logo.png';
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
      width: 85px !important;
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

  const { allGoogleSheetListRow } = useStaticQuery(
    graphql`
      query {
        allGoogleSheetListRow {
          edges {
            node {
              category
            }
          }
        }
      }
    `
  )

  // extracting unique categories from the page
  let uniqueCategories = []
  allGoogleSheetListRow.edges.forEach(({ node }) => {
    if (node.category) {
      const categoryList = node.category.split(',')
      categoryList.forEach(category => {
        if (uniqueCategories.indexOf(category) === -1) {
          uniqueCategories.push(category)
        }
      });
    }
  });

  let uniqueCategoriesMap = []
  uniqueCategories.forEach(cat => {
    let item = {
      text: cat,
      url: cat.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
    }
    uniqueCategoriesMap.push(item)
  })
  console.log(uniqueCategoriesMap);

  return (
    <Headroom calcHeightOnResize disableInlineStyles>
      <StyledLink to="/">
        <img src={logo} alt="uncommonry - discover & shop indepdent retailers & brands" />
      </StyledLink>
      <NavWrapper>
        <Nav>
          <div className="dropdown">
            <Link to="/shops">Discover </Link>
            <div className="dropdown-content">
              {uniqueCategoriesMap.map((item) => (
                <Link key={item.url} to={`/category/${item.url}`} > {item.text}</Link>
              ))}
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

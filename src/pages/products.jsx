import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import AlgoliaProductList from '../components/AlgoliaProductList';
import ProductCategoryItem from '../components/ProductCategoryItem';
import { Layout } from 'layouts';
import _ from 'lodash';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useMediaQuery } from 'react-responsive'
import LazyLoad from 'react-lazyload'

const CategoryHeading = styled.h1`
  margin-left: 4rem;
`;

const CategoryWrapper = styled.div`
  display: grid;
  margin: 0 auto;
  width: 90vw;
  grid-gap: 1rem;
  @media (min-width: 501px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  @media only screen and (max-width: 600px) {
    grid-template-columns: 100%;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 1rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 1rem 1rem 1rem 1rem;
  }
`;

const CarouselWrapper = styled.div`
  margin: 1rem 4rem 1rem 3rem;
  @media (max-width: 1000px) {
    margin: 1rem;
  }
  @media (max-width: 700px) {
    margin: 1rem;
  }
`;

const Products = ({ data, pageContext }) => {
  const rowallMysqlShopifyProductsAllEdges = data.allMysqlShopifyProductsAll ? data.allMysqlShopifyProductsAll.edges : [];
  const mainViewEdges = data.allMysqlMainView.edges;
  const maxFeaturedItems = 15;
  const maxProducts = 25;
  const [limit, setLimit] = React.useState(maxFeaturedItems);
  const [showMore, setShowMore] = React.useState(true);
  const [filter, setFilter] = React.useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  const maxItems = 25;
  const [sortBy, setSortBy] = React.useState("UpdateDate");
  const [sortOrder, setSortOrder] = React.useState("DESC");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [priceRangeMin, setPriceRangeMin] = React.useState();
  const [priceRangeMax, setPriceRangeMax] = React.useState();

  const changeSortBy = (e) => { setSortBy(e.target.value) }
  const changeSortOrder = (e) => { setSortOrder(e.target.value) }

  const changeCategoryFilter = (e) => { setCategoryFilter(e.target.value) }

  const allCategories = _.orderBy(_.uniq(Object.values(_.mapValues(mainViewEdges, ({ node }) => node.category))))

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const checkEdgesInProductView = (allEdges) => {
    let filteredProducts = [];
    allEdges.map((edge) => {
      const inputID = edge.node.AlexaURL;
      const result = _.filter(rowallMysqlShopifyProductsAllEdges, ({ node }) => node.VendorURL == inputID && node.Price > 20 && node.Title.toLowerCase().indexOf("gift") < 0 && node.Title.toLowerCase().indexOf("test") < 0 && node.Title.toLowerCase().indexOf("shipping") < 0)
      const sortedResult = _.sortBy(result, ({ node }) => -node.PublishedDate);
      const max2Results = _.slice(sortedResult, 0, 2);//max 2 products from a store
      //add shop details to products
      let combinedMax2Results = [];
      max2Results.map((maxedge) => {
        combinedMax2Results.push({
          node: {
            ...maxedge.node,
            ...edge.node,
          }
        });
      })
      filteredProducts = _.union(filteredProducts, combinedMax2Results)
    });
    return filteredProducts;
  }

  const getProductVariant = (node) => {
    let productVariant = null;
    //if(node.VariantTitle && node.VariantTitle!=="Default Title") productVariant = node.VariantTitle;
    return productVariant;
  }

  const getProductImage = (node) => {
    let productImage = node.VariantImageURL;
    if (!productImage) productImage = node.ImageURL;
    return productImage;
  }

  //get featured shops
  const featuredShopEdges = _.filter(mainViewEdges, ({ node }) => node.tags && node.tags.indexOf("featured") >= 0)

  //if filter is present then filter and show from all products, else just show products from featured shops
  const filteredFeaturedProducts = (filter && filter.length > 3) ? checkEdgesInProductView(mainViewEdges) : checkEdgesInProductView(featuredShopEdges);

  //Now limiting the featured items as per limit
  const visibleFeaturedProducts = _.slice(filteredFeaturedProducts, 0, maxFeaturedItems);

  const filteredProducts = checkEdgesInProductView(mainViewEdges);

  //Now limiting the featured items as per limit
  const visibleProducts = _.slice(filteredProducts, 0, maxItems);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  let listShopifyProductsAllEdges = [];
  //Creating a new dataset with original product nodes and shop columns from MainView
  rowallMysqlShopifyProductsAllEdges.map((edge) => {
    let newNode = {
      ...edge.node
    }
    const inputID = edge.node.VendorURL;
    var filteredMainViewEdges = _.filter(mainViewEdges, ({ node }) => (node.AlexaURL == inputID))
    if (filteredMainViewEdges.length > 0) {
      newNode = {
        ...newNode,
        ...filteredMainViewEdges[0].node
      }
    }
    listShopifyProductsAllEdges.push({
      node: {
        ...newNode
      }
    });
  })

  //Extracting sale products
  const filteredShopifySaleProducts = _.sortBy(_.filter(listShopifyProductsAllEdges, ({ node }) => node.DiscountPct > 0.20 && node.DiscountPct < 1), ({ node }) => -node.UpdateDate);
  const listShopifySaleProducts = _.slice(filteredShopifySaleProducts, 0, maxProducts);

  //Extracting gift cards
  const filteredShopifyGiftCards = _.sortBy(_.filter(listShopifyProductsAllEdges, ({ node }) => node.Title.toLowerCase().indexOf("gift card") >= 0), ({ node }) => -node.UpdateDate);
  const listShopifyGiftCards = _.slice(filteredShopifyGiftCards, 0, maxProducts);

  //applying category filter
  if (categoryFilter.length > 0) {
    listShopifyProductsAllEdges = _.filter(listShopifyProductsAllEdges, ({ node }) => node.category == categoryFilter)
  }

  //apply filter for slider on price
  if (priceRangeMin) {
    listShopifyProductsAllEdges = _.filter(listShopifyProductsAllEdges, ({ node }) => priceRangeMin <= node.Price)
  }
  if (priceRangeMax) {
    listShopifyProductsAllEdges = _.filter(listShopifyProductsAllEdges, ({ node }) => node.Price <= priceRangeMax)
  }

  //apply filtertext if its greater than 3 characters
  if (filter && filter.length > 3) {
    listShopifyProductsAllEdges = _.filter(listShopifyProductsAllEdges, ({ node }) => node.VendorName.toLowerCase().indexOf(filter.toLowerCase()) >= 0 || node.Title.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
  }

  //Now applying sorting
  listShopifyProductsAllEdges = _.sortBy(listShopifyProductsAllEdges, ({ node }) => sortOrder != "DESC" ? node[sortBy] : -node[sortBy])

  //Now limiting the items as per limit
  listShopifyProductsAllEdges = _.slice(listShopifyProductsAllEdges, 0, limit)

  if (listShopifyProductsAllEdges.length >= rowallMysqlShopifyProductsAllEdges.length) setShowMore(false);

  return (
    <Layout title={'Discover great products from independent brands'} description="Search thousands of products from independent stores and direct-to-consumer brands. Shop the emprezzo marketplace alternative to discover great products support independent businesses.">
      <Header title="emprezzo product marketplace" description="🧐 Discover great products from independent brands" />
      <div>
        <CategoryHeading>Discover great products</CategoryHeading>
        <SearchWrapper>
          <AlgoliaProductList
            facetsToShow={'category,brands,storeoffers'}
            showSearchBox={true}
            showClearFilter={true}
          />
        </SearchWrapper>



      </div>
    </Layout>
  );
};

export default Products;

export const query = graphql`
  query {
    allMysqlShopifyProductsAll {
      edges {
        node {
          DiscountAmt
          DiscountPct
          HasVariants
          ImageURL
          MaxPrice
          Position
          Price
          ProductID
          ProductURL
          PublishedDate
          Title
          UpdateDate
          VariantID
          VariantImageURL
          VariantTitle
          VariantUpdateDate
          VariantPrice
          VendorName
          VendorURL
          Description
        }
      }
    }
    allMysqlMainView {
      edges {
        node {
          AlexaURL
          UserName
          tags
          category
          name
          about
        }
      }
    }
  }
`;

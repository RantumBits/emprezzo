import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import ProductCategoryItem from '../components/ProductCategoryItem';
import { Layout } from 'layouts';
import _ from 'lodash';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Slider from '@material-ui/core/Slider';
import { useMediaQuery } from 'react-responsive'

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
  const maxFeaturedItems = 20;
  const [limit, setLimit] = React.useState(maxFeaturedItems);
  const [showMore, setShowMore] = React.useState(true);
  const [filter, setFilter] = React.useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
  const maxItems = 25;
  const [sortBy, setSortBy] = React.useState("UpdateDate");
  const [sortOrder, setSortOrder] = React.useState("DESC");
  const [sliderPrice, setSliderPrice] = React.useState([0, 0]);

  const changeSortBy = (e) => { setSortBy(e.target.value) }
  const changeSortOrder = (e) => { setSortOrder(e.target.value) }

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
      filteredProducts = _.union(filteredProducts, max2Results)
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

  const mainViewEdges = data.allMysqlMainView.edges;
  //get featured shops
  const featuredShopEdges = _.filter(mainViewEdges, ({ node }) => node.tags && node.tags.indexOf("featured") >= 0)

  //if filter is present then filter and show from all products, else just show products from featured shops
  const filteredFeaturedProducts = (filter && filter.length > 3) ? checkEdgesInProductView(mainViewEdges) : checkEdgesInProductView(featuredShopEdges);

  //Now limiting the featured items as per limit
  const visibleFeaturedProducts = _.slice(filteredFeaturedProducts, 0, maxItems);

  const filteredProducts = checkEdgesInProductView(mainViewEdges);

  //Now limiting the featured items as per limit
  const visibleProducts = _.slice(filteredProducts, 0, maxItems);

  const increaseLimit = () => {
    setLimit(limit + maxFeaturedItems);
  }
  let listShopifyProductsAllEdges = rowallMysqlShopifyProductsAllEdges;

  //apply filter for slider on price
  if (sliderPrice[0] == 0 && sliderPrice[1] == 0) {
    var minPrice = _.minBy(listShopifyProductsAllEdges, ({ node }) => node.Price)
    var maxPrice = _.maxBy(listShopifyProductsAllEdges, ({ node }) => node.Price)
    setSliderPrice([minPrice.node.Price, maxPrice.node.Price])
  }
  listShopifyProductsAllEdges = _.filter(listShopifyProductsAllEdges, ({ node }) => sliderPrice[0] <= node.Price && node.Price <= sliderPrice[1])

  //apply filtertext if its greater than 3 characters
  if (filter && filter.length > 3) {
    listShopifyProductsAllEdges = _.filter(listShopifyProductsAllEdges, ({ node }) => node.VendorName.toLowerCase().indexOf(filter.toLowerCase()) >= 0 || node.Title.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
  }

  //Now applying sorting
  listShopifyProductsAllEdges = _.sortBy(listShopifyProductsAllEdges, ({ node }) => sortOrder != "DESC" ? node[sortBy] : -node[sortBy])

  //Now limiting the items as per limit
  listShopifyProductsAllEdges = _.slice(listShopifyProductsAllEdges, 0, limit)

  if (listShopifyProductsAllEdges.length >= rowallMysqlShopifyProductsAllEdges.length) setShowMore(false);

  const handerSliderPriceChange = (event, newValue) => {
    setSliderPrice(newValue);
  }

  return (
    <Layout title={'Shopify Products | Disover great products from Shopify stores'} description="Discover the best Shopify products from hundreds of stores in one place. It's like a mini-Shopify marketplace.">
      <Header title="🧐 Disover great products from Shopify stores" />
      <div>
        <CategoryHeading>Featured Shopify Products</CategoryHeading>
        <CarouselWrapper>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            responsive={responsive}
            keyBoardControl={true}
          >
            {visibleFeaturedProducts.map(({ node }, index) => (
              <ProductCategoryItem
                key={index}
                cover={getProductImage(node)}
                path={`/shops/${node.UserName}`}
                vendorname={node.VendorName}
                title={node.Title}
                variant={getProductVariant(node)}
                price={node.Price}
              />
            ))}
          </Carousel>
        </CarouselWrapper>

        <CategoryHeading>New Shopify Products</CategoryHeading>
        <CarouselWrapper>
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={false}
            responsive={responsive}
            keyBoardControl={true}
          >
            {visibleProducts.map(({ node }, index) => (
              <ProductCategoryItem
                key={index}
                cover={getProductImage(node)}
                path={`/shops/${node.UserName}`}
                vendorname={node.VendorName}
                title={node.Title}
                variant={getProductVariant(node)}
                price={node.Price}
              />
            ))}
          </Carousel>
        </CarouselWrapper>

        <CategoryHeading>All Shopify Products</CategoryHeading>
        <SearchWrapper>
          Search
            <input
            placeholder="filter products"
            onChange={({ target: { value } }) => {
              setFilter(value);
            }}
          />
          <div style={{ width: "80%", display: "flex" }}>
            <span style={{ width: "15%" }}>Price Range : </span>
            <Slider
              value={sliderPrice}
              onChange={handerSliderPriceChange}
              min={0}
              max={sliderPrice[1] + 50}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider-avg"

            />
          </div>
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            Display by
            <select value={sortBy} onChange={changeSortBy}>
              <option value="Price">Price</option>
              <option value="UpdateDate">UpdateDate</option>
            </select>
            <select value={sortOrder} onChange={changeSortOrder}>
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
        </SearchWrapper>
        <CategoryWrapper>
          {listShopifyProductsAllEdges.map(({ node }, index) => (
            <ProductCategoryItem
              key={index}
              cover={getProductImage(node)}
              path={`/shops/${node.UserName}`}
              vendorname={node.VendorName}
              title={node.Title}
              variant={getProductVariant(node)}
              price={node.Price}
            />
          ))}
        </CategoryWrapper>
        {showMore && listShopifyProductsAllEdges.length > 0 &&
          <div className="center">
            <button className="button" onClick={increaseLimit} style={{ cursor: "pointer" }}>
              Load More
            </button>
          </div>
        }
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
          VendorName
          VendorURL
        }
      }
    }
    allMysqlMainView {
      edges {
        node {
          AlexaURL
          UserName
          tags
        }
      }
    }
  }
`;

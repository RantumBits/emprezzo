import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import theme from '../../config/theme';

const Wrapper = styled.article`
  margin-bottom: 2rem;
  position: relative;
  z-index: 100;
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.shadow.feature.small.default};
  transition: ${props => props.theme.transitions.boom.transition};
  height: 17rem;
  flex-basis: calc(99.9% * 1 / 3 - 1rem);
  max-width: calc(99.9% * 1 / 3 - 1rem);
  width: calc(99.9% * 1 / 3 - 1rem);

  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
    transform: scale(1.04);
  }

  @media (max-width: 1000px) {
    flex-basis: calc(99.9% * 1 / 2 - 1rem);
    max-width: calc(99.9% * 1 / 2 - 1rem);
    width: calc(99.9% * 1 / 2 - 1rem);
    height: 18rem;
  }

  @media (max-width: 700px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    height: 15rem;
  }
`;

const Image = styled.div`
  position: absolute;
  top: 0;
  overflow: hidden;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.default};
  img {
    border-radius: ${props => props.theme.borderRadius.default};
  }
  > div {
    position: static !important;
  }
  > div > div {
    position: static !important;
  }
`;

const StyledLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  z-index: 3;
  border-radius: ${props => props.theme.borderRadius.default};
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.7) 80%,
      rgba(0, 0, 0, 0.8) 100%
    );
    z-index: -10;
    border-radius: ${theme.borderRadius.default};
    transition: opacity ${theme.transitions.default.duration};
  }
`;

const Information = styled.div`
  color: ${props => props.theme.colors.white.light};
  margin: 0 1rem 1.25rem 1.25rem;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Vendor = styled.h5`
  margin: 0;
  margin-bottom: 0.6rem;
`;

const Title = styled.div`
  margin: 0;
  margin-bottom: 0.6rem;
`;
const SubTitle = styled.h5`
  margin: 0;
  margin-bottom: 0.6rem;
`;
const Price = styled.div`
  font-size: 1rem;
  margin: 0;
`;

const ProductList = ({ path, cover, title, vendorname, variant, price }) => (
    <Wrapper>
        <Image>
            <a href={path} title={title} target="_blank">
                {cover && typeof cover === 'object' &&
                    <Img fluid={cover || {} || [] || ''} />
                }
                {cover && typeof cover === 'string' &&
                    <img src={cover || {} || [] || ''} style={{ height: '100%', objectFit: 'fill' }} />
                }
            </a>
        </Image>
        <StyledLink to={path} title={vendorname} target="_blank">
            <Information>
                <Vendor>{vendorname}</Vendor>
                <Title>{title}</Title>
                <SubTitle>{variant}</SubTitle>
                <Price>${price}</Price>
            </Information>
        </StyledLink>
    </Wrapper>
);

export default ProductList;

import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import theme from '../../config/theme';

const Wrapper = styled.article`
  margin: 0.7rem;
  position: relative;
  z-index: 100;
  border-radius: ${props => props.theme.borderRadius.default};
  {/* box-shadow: ${props => props.theme.shadow.feature.small.default}; */}
  transition: ${props => props.theme.transitions.boom.transition};
  height: 17rem;

  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
    transform: scale(1.04);
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
      rgba(140, 82, 255, 0) 0%,
      rgba(140, 82, 255, 0.2) 30%,
      rgba(75, 40, 64, 0.6) 60%,
      rgba(75, 40, 64, 0.9) 100%
    );
    z-index: -10;
    border-radius: ${theme.borderRadius.default};
    transition: opacity ${theme.transitions.default.duration};
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
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.default};
  img {
   border-radius: 100%;
    padding: 10%;
  }
  > div {
    position: static !important;
  }
  > div > div {
    position: static !important;
  }
`;

const Info = styled.div`
  color: ${props => props.theme.colors.white.light};
  margin: 0px 0.75rem 0 0.75rem;
  position: absolute;
  bottom: 8px;
  left: 0;
  font-size: 0.8em;
`;

const Title = styled.h2`
  margin-bottom: 0.6rem;
  font-size: 1.25rem;
`;

const HomeCarouselItem = ({ id, cover, path, date, title, excerpt }) => {

  const defaultImageOnError = (e) => { e.target.src = "https://source.unsplash.com/600x600/?abstract,"+(Math.random()*1000) }

  return (
    <Wrapper id={id}>
      <Image>
        {cover && typeof cover === 'object' &&
          <Img fluid={cover} />
        }
        {cover && typeof cover === 'string' &&
          <img src={cover || {} || [] || ''} onError={defaultImageOnError} style={{ objectFit: 'fill' }} />
        }
      </Image>
      <StyledLink to={path}>
        <Info>
          <span>{date}</span>
          <Title>{title}</Title>
          <span>{excerpt}</span>
        </Info>
      </StyledLink>
    </Wrapper>
  );
}

export default HomeCarouselItem;

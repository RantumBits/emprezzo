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
  box-shadow: ${props => props.theme.shadow.feature.small.default};
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

const Image = styled.div`
  position: absolute;
  top: 0;
  overflow: hidden;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  object-fit: cover;
  text-align: center;
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

const Info = styled.div`
  color: ${props => props.theme.colors.white.light};
  margin: 0 1rem 1.25rem 1.25rem;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Title = styled.h2`
  margin-bottom: 0.6rem;
`;

const PostList5Col = ({ id, cover, path, date, title, excerpt }) => {

  return (
    <Wrapper id={id}>
      <Image>
        {cover && typeof cover === 'object' &&
          <Img fluid={cover} />
        }
        {cover && typeof cover === 'string' &&
          <img src={cover || {} || [] || ''} style={{ objectFit: 'fill' }} />
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

export default PostList5Col;

import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import _ from 'lodash';

const TagsContainer = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  a {
    margin: 0 1rem 1rem 0;
    color: ${props => props.theme.colors.black.blue};
    padding: 0.3rem 0.6rem;
    background: ${props => props.theme.colors.white.grey};
    border-radius: 10px;
    &:hover {
      color: ${props => props.theme.colors.white.light};
      background: ${props => props.theme.colors.primary.light};
      border: ${props => props.theme.colors.primary.light};
    }
  }
`;

const TagsBlock = ({ list }) => {

    return (
        <TagsContainer>
            {list && list.map((tag,index) => {
                const upperTag = tag.charAt(0).toUpperCase() + tag.slice(1);
                return (
                    <Link key={index} to={`/tags/${_.kebabCase(tag.trim())}`}>
                        <span>{upperTag}</span>
                    </Link>
                );
            })}
        </TagsContainer>
    )
};

export default TagsBlock;

TagsBlock.propTypes = {
  list: PropTypes.array,
};

import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import theme from '../../config/theme';
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

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

  @media (max-width: 1000px) {
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

const StyledLink = styled.a`
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

const ProductCategoryItem = ({ path, cover, title, vendorname, variant, price, node }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [dialogText, setDialogText] = React.useState();

  const openDialog = () => {
    let dialogContent = "";
    dialogContent += "<h1>" + node.title + "</h1>";
    if (cover && typeof cover === 'string') dialogContent += "<img src=" + cover + " height='100px' />";
    dialogContent += "<h1>" + node.title + "</h1>";
    dialogContent += "<a href='" + path + "'>Go to " + vendorname + "</a><br/><br/>";

    dialogContent = `
      <h1>${node.Title}</h1>
      <img src=${cover} height='300px' />
      <div>Max Price : $${node.MaxPrice || node.Price}</div>
      <div>Price : $${node.Price}</div>
      <br/>
      <div>Variants : <a href=${node.ProductURL} target="_blank">${node.VariantTitle}</a></div>
      <div>Go to Shop : <a href=${node.VendorURL} target="_blank">${node.VendorName}</a></div>
      <br/><br/>
    `;
    setDialogText(dialogContent);
    setShowDialog(true);
  }
  const closeDialog = () => setShowDialog(false);

  return (
    <Wrapper>
      <Dialog isOpen={showDialog} onDismiss={closeDialog}>
        <span dangerouslySetInnerHTML={{ __html: dialogText }} />
        <button onClick={closeDialog}>
          Close
        </button>
      </Dialog>
      <Image>
        <a href={path} title={title} target="_blank">
          {cover && typeof cover === 'object' &&
            <Img fluid={cover || {} || [] || ''} />
          }
          {cover && typeof cover === 'string' &&
            <img src={cover || {} || [] || ''} style={{ objectFit: 'fill' }} />
          }
        </a>
      </Image>
      <StyledLink href="javascript:void(0)" onClick={() => openDialog()} title={vendorname}>
        <Information>
          <Vendor>{vendorname}</Vendor>
          <Title>{title}</Title>
          <SubTitle>{variant}</SubTitle>
          <Price>${price}</Price>
        </Information>
      </StyledLink>
    </Wrapper>
  );
}

export default ProductCategoryItem;

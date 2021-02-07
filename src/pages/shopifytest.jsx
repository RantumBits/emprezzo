import React from 'react';
import Helmet from 'react-helmet';
import { Header } from 'components';
import { Layout, Container } from 'layouts';
import useGlobal from "../components/Cart/CartState";
import styled from 'styled-components';

const Grid = styled.div`
`;
const Row = styled.div`
  display: flex;
`;
const Col = styled.div`
  flex: ${(props) => props.size};
`;

const ShopifyTest = () => {

  const [globalState, globalActions] = useGlobal();

  const testuser = {
    "email": "user@example.com",
    "password": "HiZqFuDvDdQ7",
  }

  //globalActions.addToSavedShops();
  React.useEffect(() => {
    globalActions.getSavedShops();
  }, [globalState.cfSavedStoresList]);  

  return (
    <Layout>
      <Helmet title={'Shopify Test'} />
      <Header title="Shopify Test Page"></Header>
      <Container>
        
      </Container>
    </Layout>
  )
};

export default ShopifyTest;
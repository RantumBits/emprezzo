import React from 'react';
import Helmet from 'react-helmet';
import { Header } from 'components';
import { Layout, Container } from 'layouts';
import styled from '@emotion/styled';
import DisplaySavedStores from "../components/DisplaySavedStores"
import DisplaySavedProducts from "../components/DisplaySavedProducts"
import ShopifyAuthentication from "../components/Cart/ShopifyAuthentication"
import useGlobal from "../components/Cart/CartState";

const AuthWrapper = styled.div`
  display: flex;
  padding: 0rem 1.5rem;
  @media (max-width: 600px) {
    padding-top: 1rem;
    display: block;
  }
`;
const Section = styled.div`
  display: flex;
  padding: 3rem 1.5rem;
  @media (max-width: 600px) {
    display: block;
  }
`;

const SavedStores = () => {
  const [globalState, globalActions] = useGlobal();

  return (
    <Layout>
      <Helmet title={'Saved Stores and Products'} />
      <Header title="Saved Stores and Products"></Header>
      {globalState.authenticated &&
        <AuthWrapper>
          <button className="button" onClick={globalActions.signoutUser}>LogOut</button>
        </AuthWrapper>
      }
      {!globalState.authenticated &&
        <AuthWrapper>
          <button className="button" onClick={globalActions.openRegisterDialog}>Signup</button>
          <button className="button" onClick={globalActions.openAuthDialog}>Login</button>
          <ShopifyAuthentication />
        </AuthWrapper>
      }
      <Section>
        <DisplaySavedProducts />
        <DisplaySavedStores />
      </Section>
    </Layout>
  )
};

export default SavedStores;
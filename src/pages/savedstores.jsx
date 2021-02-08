import React from 'react';
import Helmet from 'react-helmet';
import { Header } from 'components';
import { Layout, Container } from 'layouts';
import styled from '@emotion/styled';
import DisplaySavedStores from "../components/DisplaySavedStores"
import DisplaySavedProducts from "../components/DisplaySavedProducts"

const Section = styled.div`
  display: flex;
  padding: 3rem 1.5rem;
  @media (max-width: 600px) {
    display: block;
  }
`;

const SavedStores = () => {

  return (
    <Layout>
      <Helmet title={'Saved Stores and Products'} />
      <Header title="Saved Stores and Products"></Header>
        <Section>
          <DisplaySavedProducts />
          <DisplaySavedStores />
        </Section>
    </Layout>
  )
};

export default SavedStores;
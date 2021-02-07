import React from 'react';
import Helmet from 'react-helmet';
import { Header } from 'components';
import { Layout, Container } from 'layouts';
import DisplaySavedStores from "../components/DisplaySavedStores"


const SavedStores = () => {

  return (
    <Layout>
      <Helmet title={'Saved Stores'} />
      <Header title="Saved Stores"></Header>
      <Container>
        <DisplaySavedStores />
      </Container>
    </Layout>
  )
};

export default SavedStores;
import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const SuccessPage = () => (
  <Layout>
    <Helmet title={'Thanks for your submission'} />
    <Header title="Thanks for your submission">🧐 Discover exceptional retailers & innovative brands<br/>🛒 Shop direct to support independent businesses</Header>
    <Container center={{center:"true"}}>
    <h3>Thanks for your submission!</h3>
    <p>We will email you once we've had a chance to manually review your submission.</p>
    </Container>
  </Layout>
);

export default SuccessPage;

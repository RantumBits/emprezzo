import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';
import Authentication from '../components/Blockstack/Authentication'

const About = center => (
  <Layout>
    <Helmet title={'Auth Test'} />
    <Header title="Auth Test Page">🧐 Discover exceptional retailers & innovative brands<br/>🛒 Shop direct to support independent businesses</Header>
    <Container center={center}>
      <Authentication />
    </Container>
  </Layout>
);

export default About;
import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const About = center => (
  <Layout>
    <Helmet title={'About'} />
    <Header title="About">🧐 Discover exceptional retailers & innovative brands<br/>🛒 Shop direct to support independent businesses</Header>
    <Container center={center}>
    <p>
    We help consumers discover, support& shop independent brands & retailers.
</p>  <p>
    Large platforms like Amazon and Target control an increasily large share of ecommerce sales. Platforms are convenient and great for deliveing basic goods. They are not good for find discovering the very best products
</p>  <p>
    Support innovation among indepndenent brands by shopping directly. 
</p>  <p>
    The list of shops is intended to grow over time, as is the functionality of the site. New submissions are always welcome.
</p>
    </Container>
  </Layout>
);

export default About;

About.propTypes = {
  center: PropTypes.object,
};

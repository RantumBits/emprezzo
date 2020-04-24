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
    We seeks to connect consumers directly with excpetional independent brands & retailers. Large platforms control an increasingly large share of transactions, while local retailers and small independent comnpanies have struggled to survive.
</p>  <p>
    Platforms are convenient and great for deliveing basic goods. They are not good for find discovering the very best products; they reward 'good enough' over 'great', take a large percentage of sales, and often promote their own substandard brands.
</p>  <p>
    We've created an easily-searchable list of exceptional brands and retailers where you can shop directly. As a consumer you can generally expect the same prices as on major platforms, additional incentives for shopping directly, and support great independent brands
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

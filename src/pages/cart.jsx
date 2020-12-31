import React from 'react';
import Helmet from 'react-helmet';
import { Layout, Container } from 'layouts';
import { Header } from 'components';
import DisplayCart from '../components/Cart/DisplayCart';

const Cart = () => (
  <Layout>
    <Helmet title={'Saved Products'} />
    <Header>Saved Products</Header>
    <DisplayCart />
  </Layout>
);

export default Cart;

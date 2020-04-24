import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const Submit = center => (
  <Layout>
    <Helmet title={'Submit Shop'} />
    <Header title="Submit a Shop">🧐 Discover exceptional retailers & innovative brands<br/>🛒 Shop direct to support independent businesses</Header>
    <Container center={center}>
    <form name="submit_shop" method="POST" action="/success" data-netlify="true" netlify-honeypot="bot-field">
    Submit a new independent shop to add to our list! <br/>All entries are manually reviewed. <br/><br/>
    <input type="hidden" name="bot-field" />
    Your contact info
    <div class="pair"><label><input type="text" name="name" placeholder="Your name" required /></label></div>
    <div class="pair"><label><input type="email" name="email" placeholder="hello@example.com" required /></label></div>
    <br/>Shop details
    <div class="pair"><label><input type="shop_name" placeholder="Shop name" name="shop_name" required /></label></div>
    <div class="pair"><label><input type="shop_category" placeholder="Category" name="shop_category" required /></label></div>
    <div class="pair"><label><input type="shop_website" placeholder="example.com" name="shop_website" required /></label></div>
    <div class="pair"><label><textarea name="message" placeholder="What makes this shop a good addition?" required></textarea></label></div>
    <input type="submit">Submit</input>
</form>
    </Container>
  </Layout>
);

export default Submit;

Submit.propTypes = {
  center: PropTypes.object,
};

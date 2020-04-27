import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const Submit = () => (
  <Layout>
    <Helmet title={'Submit Shop'} />
    <Header title="Submit a Shop">🧐 Discover exceptional retailers & innovative brands<br/>🛒 Shop direct to support independent businesses</Header>
    <Container center={{center:"true"}}>
    <form id="submit_shop" action="/success" method="post" role="form" data-netlify="true" data-netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="submit_shop" />
    Submit a new independent shop to add to our list! <br/>All entries are manually reviewed. <br/><br/>
    Your contact info
    <div className="pair"><label><input type="text" name="name" placeholder="Your name" required /></label></div>
    <div className="pair"><label><input type="email" name="email" placeholder="hello@example.com" required /></label></div>
    <br/>Shop details
    <div className="pair"><label><input type="text" placeholder="Shop name" name="shop_name" required /></label></div>
    <div className="pair"><label><input type="text" placeholder="Category" name="shop_category" required /></label></div>
    <div className="pair"><label><input type="text" placeholder="example.com" name="shop_website" required /></label></div>
    <div className="pair"><label><textarea name="message" placeholder="What makes this shop a good addition?" required></textarea></label></div>
    <input type="submit" value="Submit" />
</form>
    </Container>
  </Layout>
);

export default Submit;

Submit.propTypes = {
  center: PropTypes.object,
};

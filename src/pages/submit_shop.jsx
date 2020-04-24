import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const Submit = center => (
  <Layout>
    <Helmet title={'Submit Shop'} />
    <Header title="Submit a Shop">we help consumers discover & support exceptional independent brands & retailers</Header>
    <Container center={center}>
    <form name="submit_shop" method="POST" action="/" data-netlify="true" netlify-honeypot="bot-field">
    <input type="hidden" name="bot-field" />
    <label>Your name: <input type="text" name="name" placeholder="your name" required /></label>
    <label>Your email: <input type="email" name="email" placeholder="hello@example.com" required /></label>
    <label>Shop URL: <input type="shop_website" placeholder="example.com" name="shop_website" required /></label>
    <label>What makes this shop a good addition?<br/> <textarea name="message" required></textarea></label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>
    </Container>
  </Layout>
);

export default Submit;

Submit.propTypes = {
  center: PropTypes.object,
};

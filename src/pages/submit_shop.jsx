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
    <form name="submit_shop" method="POST" data-netlify="true">
  <p>
    <label>Your name: <input type="text" name="name" /></label>
  </p>
  <p>
    <label>Your email: <input type="email" name="email" /></label>
  </p>
  <p>
    <label>Shop URL: <input type="shop_website" name="shop_website" /></label>
  </p>
  <p>
    <label>What makes this shop a good fit for uncommonry?<br/> <textarea name="message"></textarea></label>
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

import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const Submit = () => (
  <Layout>
    <Helmet title={'Contact emprezzo'} />
    <Header title="Contact emprezzo">Submit questions, suggestions, partnership requests, etc</Header>

    <Container center={{center:"true"}}>
    <form id="contact" action="/success" method="post" role="form" data-netlify="true" data-netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact" />
    emprezzo <br/>329 Primrose #117181<br/> Burlingame, CA 94402
    <div className="pair"><label><input type="text" name="name" placeholder="Your name" required /></label></div>
    <div className="pair"><label><input type="email" name="email" placeholder="hello@example.com" required /></label></div>
    <div className="pair"><label><textarea name="message" placeholder="message" required></textarea></label></div>
    <input type="submit" value="Submit" />
</form>
    </Container>
  </Layout>
);

export default Submit;

Submit.propTypes = {
  center: PropTypes.object,
};

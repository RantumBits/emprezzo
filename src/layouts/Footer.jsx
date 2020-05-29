import React from 'react';
import { Link, useStaticQuery } from 'gatsby';
import styled from '@emotion/styled';
import logo from '../../static/logo/header-logo.png';

const Wrapper = styled.footer`
  position: relative;
  padding-top: 2rem;
  bottom: 0;
  box-shadow: ${props => props.theme.shadow.footer};
  background: ${props => props.theme.gradient.leftToRight};
  font-family: ${props => props.theme.fontFamily.body};
  font-weight: 500;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    padding-top: 7rem;
  }
`;

const Text = styled.div`
  margin: 0;
  padding-bottom: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.white.light};
`;

const Footer = () => (
  <Wrapper>
    <Text>
      <div>

        <img src={logo} width="200px" alt="uncommonry - discover & shop indepdent retailers & brands" />
        <div>💌<Link to="/submit_shop"> submit an uncommon business</Link><br/>
          🛒<Link to="/about"> about </Link> <br/>
        ⚒ by <a href="https://ecomloop.com" target="_blank">ecomloop</a> in 🥑 california</div>

      </div>
    </Text>
    <div className="cui-embed" data-cui-uid="e7T54e" data-cui-mode="pill" data-cui-pill-button-color="#0000FF"></div>
  </Wrapper>
);
export default Footer;

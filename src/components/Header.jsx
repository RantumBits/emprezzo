import React from 'react';
import styled from '@emotion/styled';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import { FaInstagram, FaFacebookSquare, FaPinterestSquare, FaTwitterSquare, FaYoutube } from 'react-icons/fa';
import Helmet from 'react-helmet';

const Wrapper = styled.header`
  -webkit-clip-path: polygon(100% 0, 0 0, 0 70%, 50% 100%, 100% 70%);
  clip-path: polygon(100% 0, 0 0, 0 70%, 50% 100%, 100% 70%);
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    -webkit-clip-path: polygon(100% 0, 0 0, 0 90%, 50% 100%, 100% 90%);
    clip-path: polygon(100% 0, 0 0, 0 90%, 50% 100%, 100% 90%);
  }
  background: ${props => props.theme.gradient.rightToLeft};
  height: 220px;
  @media (max-width: ${props => props.theme.breakpoints.m}) {
    height: 220px;
  }
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    height: 200px;
  }
  position: relative;
  overflow: hidden;
`;

const Text = styled.div`
  color: ${props => props.theme.colors.white.base};
  z-index: 0;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
  max-width: ${props => props.theme.layout.base};
  padding: 0 2rem;
  margin-bottom: 0rem;
  align-items: center;
  h1 {
    @media (max-width: ${props => props.theme.breakpoints.s}) {
      font-size: 1.4rem;
    }
    margin-bottom: 0rem;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  a {
    margin-right: 10px;
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.white.light};
`;

const Header = ({ children, title, date, subtitle, cover, socialDetails, likeEnabled }) => (
  <Wrapper>
    <Helmet>
      <script src="//w.likebtn.com/js/w/widget.js"></script>
    </Helmet>
    {cover && typeof cover === 'object' &&
      <Img fluid={cover || {} || [] || ''} />
    }
    {cover && typeof cover === 'string' &&
      <img src={cover || {} || [] || ''} style={{ width: '100%', objectFit: 'fill', objectPosition: '50% 50%' }} />
    }
    <Text>

 {likeEnabled &&
        <img src={likeEnabled.storeProfileImage} title={title} alt={title} style={{ 'margin-top': '4rem', 'max-height': '80px', 'textAlign': 'center', 'borderRadius': '0%' }} />
      }
      {likeEnabled &&
        <span
          className="likebtn-wrapper"
          data-theme="custom"
          data-icon_l="str1-o"
          data-icon_d="sgn9-f"
          data-icon_l_c="rgb(55,24,71)"
          data-icon_l_c_v="rgb(192,76,253)"
          data-icon_d_c="rgb(55,24,71)"
          data-icon_d_c_v="rgba(253,76,97,0.88)"
          data-bg_c="#ffffff"
          data-bg_c_v="#ffffff"
          data-f_family="Courier New"
          data-i18n_like="favorite"
          data-ef_voting="bounce"
          data-white_label="true"
          data-rich_snippet="true"
          data-identifier={likeEnabled.storeName}
          data-counter_count="true"
          data-popup_disabled="true"
          data-share_enabled="false"
          data-addthis_pubid="ra-5f7b9ff19ad7a3f6"
          data-item_url={likeEnabled.storeURL}
          data-item_title={likeEnabled.storeName}
          data-item_image={likeEnabled.storeProfileImage}
          data-lazy_load="false"
          data-tooltip_enabled="false"
          data-site_id="5f795f90943ec9bf477cbfbe"
        >
        </span>
      }
      <h3 style={{ 'margin-bottom': '0.5rem'}}>{title}</h3>
            <h4>{subtitle}</h4>
      {socialDetails &&
        <SocialIcons>
          {socialDetails.InstagramLink &&
            <a href={socialDetails.InstagramLink} target="_blank"><FaInstagram size="32" color="black" /></a>
          }
          {socialDetails.FacebookLink &&
            <a href={socialDetails.FacebookLink} target="_blank"><FaFacebookSquare size="32" color="black" /></a>
          }
          {socialDetails.PinterestLink &&
            <a href={socialDetails.PinterestLink} target="_blank"><FaPinterestSquare size="32" color="black" /></a>
          }
          {socialDetails.TwitterLink &&
            <a href={socialDetails.TwitterLink} target="_blank"><FaTwitterSquare size="32" color="black" /></a>
          }
          {socialDetails.YouTubeLink &&
            <a href={socialDetails.YouTubeLink} target="_blank"><FaYoutube size="32" color="black" /></a>
          }
        </SocialIcons>
      }

      {children && <Subtitle dangerouslySetInnerHTML={{ __html: children }} />}
    </Text>
  </Wrapper>
);

export default Header;

Header.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  cover: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool,
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool,
  ]),
};

Header.defaultProps = {
  children: false,
  cover: false,
  date: false,
  subtitle: false,
  title: false,
};

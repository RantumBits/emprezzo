import { css } from '@emotion/core';
import theme from '../../config/theme';

const headroom = css`
  .headroom-wrapper {
    position: fixed;
    width: 100%;
    z-index: 2000;
    top: 0;
  }
  .css-14za4wp.eqxxxtn1, .css-woc7hc.eqxxxtn0 {
    display: none;
}

p.center {
    text-align: center;
    margin: 25px;
}

  a{ color: #6f6add;}
  a.button{
    display:inline-block;
    padding:0.7em 1.4em;
    margin:0 0.3em 0.3em 0;
    border-radius:0.15em;
    box-sizing: border-box;
    text-decoration:none;
    text-transform:uppercase;
    font-weight:400;
    color:#FFFFFF;
    background-color:#6f6add;
    box-shadow:inset 0 -0.6em 0 -0.35em rgba(0,0,0,0.17);
    text-align:center;
    position:relative;
}
a.buttonalt{
  opacity: 50%;

}
.center{
  text-align: center;
  margin: 25px;
}

.search_main Input.e1kdxvpr2 {
  width: 33%;
  padding: 1em;
  border-radius: 10px;
  margin: 25px 0 0 10px;
}
a.button:hover{
  opacity:75%;
}
  .headroom {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 100vw;
    padding: 1rem 1.5rem;
    svg {
      height: 2.5rem;
      g {
        fill: ${theme.colors.white.base};
      }
    }
  }
  .headroom--unfixed {
    position: relative;
    transform: translateY(0);
    transition: ${theme.transitions.headroom.transition};
  }
  .headroom--scrolled {
    transition: ${theme.transitions.headroom.transition};
  }
  .headroom--unpinned {
    position: fixed;
    transform: translateY(-100%);
    transition: ${theme.transitions.headroom.transition};
  }
  .headroom--pinned {
    position: fixed;
    transform: translateY(0);
    transition: ${theme.transitions.headroom.transition};
    background-color: ${theme.colors.white.light};
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
    nav {
      a {
        color: ${theme.colors.black.base};
        &:hover {
          border-color: ${theme.colors.black.base};
          color: ${theme.colors.black.base};
        }
        &:focus {
          color: ${theme.colors.black.base};
        }
      }
      .dropdown {
        color: ${theme.colors.black.base};
        &:hover {
          border-color: ${theme.colors.black.base};
          color: ${theme.colors.black.base};
        }
        &:focus {
          color: ${theme.colors.black.base};
        }
      }

      input {
        border-color: ${theme.colors.black.base};
        color: ${theme.colors.black.base};
      }

      svg {
        color: ${theme.colors.black.base} !important;
      }
    }
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    svg {
      height: 2.5rem;
      g {
        fill: ${theme.colors.black.base};
      }
    }
    span {
      color: ${theme.colors.black.base};
    }
  }
`;

export default headroom;

import { css } from '@emotion/core';
import theme from '../../config/theme';

const headroom = css`
  .headroom-wrapper {
    position: fixed;
    width: 100%;
    z-index: 10;
    top: 0;
  }
  .css-14za4wp.eqxxxtn1, .css-woc7hc.eqxxxtn0 {
    display: none;
}
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@500&family=Overpass+Mono:wght@400&display=swap');
p.center {
    text-align: center;
    margin: 25px;
}
  a{ color: #C04CFD;}
  a.button{
    display:inline-block;
    padding:0.7em 1.4em;
    margin:0 0.3em 0.3em 0;
    border-radius:0.15em;
    box-sizing: border-box;
    text-decoration:none;
    text-transform:uppercase;
    font-weight:400;
    font-size: .8em;
    color:#5EFC8D;
    background-color:#C04CFD;
    box-shadow:inset 0 -0.6em 0 -0.25em rgba(0,0,0,0.17);
    text-align:center;
    position:relative;
}
a.buttonalt{
  opacity: 50%;
}

button.ais-RefinementList-showMore, .ais-RefinementList-showMore:focus:focus {
    background: #C04CFD;
    opacity: 40%;

}

button.ais-RefinementList-showMore:hover {
    background: #C04CFD;
    opacity: 80%;
}

[data-reach-dialog-overlay]{z-index: 10;}

h4 {margin: 1rem; font-size: .8rem;
font-family: 'Overpass Mono', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;}

li.ais-Hits-item {
  border: unset;
}

.lb-ef-bounce {
  -webkit-transform: unset !important;
    transform: unset !important;
}
.react-multiple-carousel__arrow { background: #4B2840;}
.react-multiple-carousel__arrow:hover {background: #C04CFD; }

.button {
    padding:0.7em 1.4em;
    margin:0 0.3em 0.3em 0;
    border-radius:0.15em;
    box-sizing: border-box;
    text-transform:uppercase;
    font-weight:400;
    font-size: .8em;
    color:#5EFC8D;
    background-color:#C04CFD;
    box-shadow:inset 0 -0.8em 0 -0.35em rgba(0,0,0,0.17);
    cursor: pointer;
}


.Header--Subtitle {
  text-transform: lowercase;
}

.profileimage{
  margin-bottom: 15px;

}
.profileimage img{
  border-radius: 20%;


}

.profile_left{
  max-width: 30%;

}
.stat_title{
  font-size: .8rem;
}
font-size: 0.6rem;
.logo{
  max-width: 50px;
}
.center{
  text-align: center;
  margin: 25px;
}
.search_main Input.e1kdxvpr2 {
  min-width: 33%;
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
    background-color: ${theme.colors.background.light};
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
    nav {
      a {
        color: ${theme.colors.white.base};
        &:hover {
          border-color: ${theme.colors.black.base};
          color: ${theme.colors.primary.base};
        }
        &:focus {
          color: ${theme.colors.white.base};
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
        border-color: ${theme.colors.white.base};
        color: ${theme.colors.white.base};
      }
      svg {
        color: ${theme.colors.white.base} !important;
      }
    }
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    svg {
      height: 2.5rem;
      g {
        fill: ${theme.colors.white.base};
      }
    }
    span {
      color: ${theme.colors.black.base};
    }
  }
`;

export default headroom;

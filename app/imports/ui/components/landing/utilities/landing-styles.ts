import { COLORS } from '../../../utilities/Colors';

export default {
  'landing-menu > .item, .landing-menu .right.menu > .item': {
    position: 'initial',
  },
  'inverted-section': {
    backgroundColor: COLORS.BLACK,
    paddingTop: 50,
    paddingBottom: 50,
  },
  'inverted-section-green': {
    backgroundColor: COLORS.GREEN,
    paddingTop: 40,
    paddingBottom: 40,
    marginTop: 0,
  },
  'section-9': {
    paddingTop: 40,
    paddingBottom: 40,
    marginTop: 0,
  },
  'ready-to-get-started': {
    paddingTop: 20,
    paddingBottom: 30,
    paddingLeft: 20,
    backgroundColor: COLORS.GREEN,
    color: COLORS.WHITE,
    borderRadius: 10,

  },
  'need-more-info': {
    paddingTop: 20,
    paddingBottom: 30,
    paddingLeft: 20,
    backgroundColor: COLORS.BLUE,
    color: COLORS.WHITE,
    borderRadius: 10,
  },
  'browse-explorers': {
    paddingTop: 20,
    paddingBottom: 30,
    paddingLeft: 20,
    backgroundColor: COLORS.OLIVE,
    color: COLORS.WHITE,
    borderRadius: 10,
  },
  'inverted-main-header': {
    color: COLORS.WHITE,
    fontSize: '4rem',
    lineHeight: 1,
    paddingBottom: 10,
  },
  'inverted-main-description': {
    color: COLORS.WHITE,
    fontSize: 20,
  },
  'landing-number-column': {
    textAlign: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    fontSize: '1.3rem',
  },
  'home-number': {
    color: COLORS.BLUE,
    fontSize: 90,
    fontWeight: 700,
    verticalAlign: 'middle',
    lineHeight: 0.6,
    textAlign: 'center',
  },
  'float-right': {
    float: 'right',
  },
  'float-left': {
    float: 'left',
  },
  'text-right': {
    textAlign: 'right',
  },
  'home-number-label': {
    color: COLORS.BLACK,
    fontSize: 20,
  },
  'main-header-ice': {
    textAlign: 'left',
    marginTop: 90,
    paddingBottom: 80,
  },
  'green-text': {
    color: COLORS.GREEN,
  },
  'landing-section-1 .container': {
    paddingTop: '5rem',
  },
  container: {
    paddingBottom: '5rem',
  },
  'landing-section-4, landing-section-6, landing-section-8': {
    paddingTop: 9,
    paddingBottom: 9,
    backgroundColor: COLORS.GREY2,
  },
  'landing-section-3 .grid, landing-section-4 .grid, landing-section-5 .grid, landing-section-6 .container, landing-section-7 .grid, landing-section-8 .container, landing-section-9 .container': {
    paddingBottom: '5rem',
  },
  'inverted-header': {
    color: COLORS.WHITE,
    fontSize: 45,
  },
  'inverted-header2': {
    color: COLORS.WHITE,
    fontSize: '1.7rem',
  },
  'mobile-header': {
    fontSize: 60,
  },
  'inverted-description': {
    color: COLORS.WHITE,
    fontSize: 18,
  },
  'inverted-description p > strong, .header-description p > strong': {
    color: COLORS.GREEN,

  },
  'header-text': {
    fontSize: '4.0rem',
  },
  'header-description': {
    fontSize: '1.3rem',
    textAlign: 'center',
    paddingRight: 100,
    paddingLeft: 100,
  },
  'header-section': {
    backgroundColor: COLORS.WHITE,
    paddingTop: 40,
    paddingBottom: 40,
  },
  'header-section-gray': {
    backgroundColor: COLORS.GREY2,
    paddingTop: 40,
    paddingBottom: 40,
  },
  'grey-section': {
    backgroundColor: COLORS.GREY2,
  },
  'vertical-align': {
    display: 'flex',
    alignItems: 'center',
  },
  'landing-stats': {
    marginTop: 10,
  },
  'landing-stats > .statistic': {
    margin: 0,
  },
  'landing-stats .statistic > .label': {
    fontSize: 16,
  },
  'footer-item:before, .footer-item': {
    color: COLORS.WHITE,
  },
  'landing-ice .column .radgrad-ice.menu .radgrad-ice-stat': {
    top: 15,
  },
  'main-header-ice .card .content': {
    paddingBottom: 0,
  },
  'footer-section': {
    backgroundColor: COLORS.BLACK,
    padding: '2rem 0',
    color: COLORS.WHITE,
  },
  'home-number-label a:link': {
    fontWeight: 100,
    fontcolor: COLORS.RED,
  },
  'explorer-dropdown':{
    marginRight: 10,
  },
} as React.CSSProperties;
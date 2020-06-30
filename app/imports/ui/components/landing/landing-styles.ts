import { toUpper } from '../shared/helper-functions';

export default {
    'landing-menu > .item, .landing-menu .right.menu > .item': {
        position: 'initial',
    },
    'inverted-section': {
        backgroundColor: 'rgba(0,0,0,.8)',
        paddingTop: 50,
        paddingBottom: 50,
    },
    'inverted-section-green': {
        backgroundColor: '#7CC154',
        paddingTop: 40,
        paddingBottom: 40,
        marginTop: 0,
    },
    'inverted-main-header': {
        color: 'white',
        fontSize: 55,
        lineHeight: 1,
        paddingBottom: 10,
    },
    'inverted-main-description': {
        color: 'rgba(255,255,255,.7)',
        fontSize: 20,
    },
    'home-number': {
        color: '#279474',
        fontSize: 65,
        fontWeight: 500,
        paddingRight: 10,
        verticalAlign: 'middle',
        lineHeight: 0.6,

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
        color: '#333333',
        fontSize: 18,
    },
    'home-number-label-last': {
        fontSize: 18,
        paddingLeft: 10,
        float: 'left',
        marginTop: -10,
    },
    'main-header-ice': {
        textAlign: 'left',
        marginTop: 90,
        paddingBottom: 80,
    },
    'green-text': {
        color: '#6FBE44',
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
        backgroundColor: '#f7f7f7',
    },
    'landing-section-3 .grid, landing-section-4 .grid, landing-section-5 .grid, landing-section-6 .container, landing-section-7 .grid, landing-section-8 .container, landing-section-9 .container': {
        paddingBottom: '5rem',
    },
    'inverted-header': {
        color: 'white',
        fontSize: 45,
    },
    'inverted-header2': {
        color: 'white',
        fontSize: 35,
    },
    'mobile-header': {
        fontSize: 60,
    },
    'inverted-description': {
        color: 'rgba(255,255,255,.7)',
        fontSize: 18,
    },
    'inverted-description p > strong, .header-description p > strong': {
        color: '#6FBE44',
    },
    'header-text': {
        fontSize: 45,
    },
    'header-description': {
        fontSize: 18,
    },
    'header-section': {
        backgroundColor: '#ffffff',
        paddingTop: 40,
        paddingBottom: 40,
    },
    'header-section-gray': {
        backgroundColor: '#eeeeee',
        paddingTop: 40,
        paddingBottom: 40,
    },
    'grey-section': {
        backgroundColor: '#f7f7f7',
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
        color: 'white',
    },
    'landing-ice .column .radgrad-ice.menu .radgrad-ice-stat': {
        top: 15,
    },
    'main-header-ice .card .content': {
        paddingBottom: 0,
    },
    'footer-section': {
        backgroundColor: '#252525',
        padding: '1rem 0',
        color: 'white',
        fontSize: 13,
    },
} as React.CSSProperties;

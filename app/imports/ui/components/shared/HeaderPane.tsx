import React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';

const invertedSection = {
  backgroundColor: 'rgba(0,0,0,.8)',
  paddingTop: 25,
  paddingBottom: 25,
  paddingLeft: '50px',
  paddingRight: '20px',
};
const titleStyle = { color: '#6FBE44', fontSize: '2rem', fontWeight: 700, fontFamily: 'Nunito' };
const lineStyle = { color: '#eeeeee', fontSize: '1rem', lineHeight:'2.0rem' };

export interface HeaderPaneProps {
  title: string,
  body: string,
  image?: string
  bodyButton?: React.ReactNode;
}

const HeaderPane: React.FC<HeaderPaneProps> = ({ title = 'Default title', body, image, bodyButton }) => (
  <div style={invertedSection}>
    <Grid stackable>
      <Grid.Column verticalAlign='middle' width={3}><Image src={image}  size="medium" /></Grid.Column>
      <Grid.Column verticalAlign='middle' width={13}>
        <div style={titleStyle}><ReactMarkdownWithHtml allowDangerousHtml source={title}/></div>
        { body ? <div style={lineStyle}><ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={body}/></div> : ''}
        { bodyButton ? <div style={lineStyle}>{bodyButton}</div> : '' }
      </Grid.Column>
    </Grid>
  </div>
);

export default HeaderPane;

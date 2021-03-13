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
const titleStyle = {color: '#ffffff', fontSize: '3rem', fontWeight: 300};
const lineStyle = {color: '#eeeeee', fontSize: '1.3rem', lineHeight:'3.0rem'};

export interface HeaderPaneProps {
  title: string,
  body: string,
  image?: string
}

const HeaderPane: React.FC<HeaderPaneProps> = ({title = 'Default title', body, image }) => (
  <div style={invertedSection}>
    <Grid stackable>
      <Grid.Column verticalAlign='middle' width={3}><Image src={`images/header-panel/${image || 'header-default.png'}`}  size="medium" /></Grid.Column>
      <Grid.Column width={13}>
       <div style={titleStyle}><ReactMarkdownWithHtml allowDangerousHtml source={title}/></div>
          { body ? <div style={lineStyle}><ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={body}/></div> : ''}
      </Grid.Column>
    </Grid>
  </div>
);

export default HeaderPane;

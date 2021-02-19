import React from 'react';
import { Grid } from 'semantic-ui-react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';

const invertedSection = {
  backgroundColor: 'rgba(0,0,0,.8)',
  paddingTop: 25,
  paddingBottom: 25,
  marginBottom: '10px',
  paddingLeft: '20px',
  paddingRight: '20px',
};
const titleStyle = {color: '#6FBE44', fontFamily: 'Nunito', fontSize: '45px', fontWeight: 600};
const lineStyle = {color: 'white', fontSize: '1.5rem', fontWeight: 400, paddingTop: '18px'};

export interface HeaderPaneProps {
  title: string,
  body: string,
  image: string
}

const HeaderPane: React.FC<HeaderPaneProps> = ({title = 'Default title', body, image }) => (
  <div style={invertedSection}>
    <Grid>
      <Grid.Column width={3}><Image src={image} size="medium" /></Grid.Column>
      <Grid.Column width={13}>
       <div style={titleStyle}><ReactMarkdownWithHtml allowDangerousHtml source={title}/></div>
      { body ? <div style={lineStyle}><ReactMarkdownWithHtml linkTarget="_blank" allowDangerousHtml source={body}/></div> : ''}
      </Grid.Column>
    </Grid>
  </div>
);

export default HeaderPane;

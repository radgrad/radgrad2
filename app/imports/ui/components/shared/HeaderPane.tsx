import React from 'react';
import {Container} from 'semantic-ui-react';
import ReactMarkdownWithHtml from 'react-markdown/with-html';

const invertedSection = {backgroundColor: 'rgba(0,0,0,.8)', paddingTop: 25, paddingBottom: 25, marginBottom: '10px'};
const titleStyle = { color: '#6FBE44', fontFamily: 'Nunito', fontSize: '45px', fontWeight: 600};
const lineStyle = {color: 'white', fontSize: '18px', fontWeight: 400, paddingTop: '18px'};

export interface HeaderPaneProps {
  title: string,
  body: string
}

const HeaderPane: React.FC<HeaderPaneProps> = ({title = 'Default title', body = 'Default body' }) => (
  <div style={invertedSection}>
    <Container>
      <div style={titleStyle}><ReactMarkdownWithHtml allowDangerousHtml source={title} /></div>
      <div style={lineStyle}><ReactMarkdownWithHtml allowDangerousHtml source={body} /></div>
    </Container>
  </div>
);

export default HeaderPane;

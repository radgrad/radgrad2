import React from 'react';
import {Container} from 'semantic-ui-react';

const invertedSection = {backgroundColor: 'rgba(0,0,0,.8)', paddingTop: 25, paddingBottom: 25, marginBottom: '10px'};
const titleStyle = { color: '#6FBE44', fontFamily: 'Nunito', fontSize: '45px', fontWeight: 600};
const lineStyle = {color: 'white', fontSize: '18px', fontWeight: 400, paddingTop: '18px'};

export interface HeaderPaneProps {
  title: string,
  line1: string,
  line2: string
}

const HeaderPane: React.FC<HeaderPaneProps> = ({title, line1, line2}) => (
  <div style={invertedSection}>
    <Container>
      <div style={titleStyle}>{title}</div>
      <div style={lineStyle}>{line1}</div>
      <div style={lineStyle}>{line2}</div>
    </Container>
  </div>
);

export default HeaderPane;

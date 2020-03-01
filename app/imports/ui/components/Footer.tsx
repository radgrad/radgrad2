import React from 'react';
import { Container, List } from 'semantic-ui-react';

/** The LandingFooter appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = {
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 15,
    backgroundColor: '#252525',
  };
  return (
    <footer>
      <div style={divStyle}>
        <Container textAlign="center">
          <List bulleted horizontal>
            <a className="footer-item item" href="http://radgrad.org/">
              About Us
            </a>
            <a className="footer-item item" href="http://radgrad.org/organization/contact.html">
              Contact
            </a>
          </List>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

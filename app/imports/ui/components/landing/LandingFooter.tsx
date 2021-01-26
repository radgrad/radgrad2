import React from 'react';
import { Container, List, Grid } from 'semantic-ui-react';
import styles from './utilities/landing-styles';

const LandingFooter: React.FC = () => (
  <footer>
    <div style={styles['footer-section']}>
      <Container>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>RadGrad @ 2020</Grid.Column>
            <Grid.Column textAlign="right">
              <List bulleted horizontal>
                <List.Item as="a" href="http://radgrad.org/" style={styles['footer-item:before, .footer-item']}>
                  About Us
                </List.Item>
                <List.Item as="a" href="http://radgrad.org/contact-us.html" style={styles['footer-item:before, .footer-item']}>
                  Contact
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  </footer>
);

export default LandingFooter;

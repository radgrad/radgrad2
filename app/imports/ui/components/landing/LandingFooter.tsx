import React from 'react';
import { Container, List, Grid } from 'semantic-ui-react';
import styles from './utilities/landing-styles';
import { buildVersion } from '../../../build-version';

interface LandingFooterProps {
  instanceName: string;
}
const LandingFooter: React.FC<LandingFooterProps> = ({ instanceName }) => (
  <footer>
    <div style={styles['footer-section']}>
      <Container>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              UHM/ICS RadGrad {`${buildVersion.version}`} (Deployed on {`${buildVersion.bugFix}`})

            </Grid.Column>
            <Grid.Column textAlign="right">
              <List bulleted horizontal>
                <List.Item as="a" href="http://radgrad.org/" target="_blank" style={styles['footer-item:before, .footer-item']}>
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

import React from 'react';
import { Container, List, Grid } from 'semantic-ui-react';
import styles from '../landing/utilities/landing-styles';
import { buildVersion } from '../../../build-version';

const instanceName = Meteor.settings.public.instanceName;

const PageFooter: React.FC = () => (
  <footer>
    <div style={styles['footer-section']}>
      <Container>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              RadGrad ({instanceName}) {`${buildVersion.version}`} (Deployed on {`${buildVersion.bugFix}`})
            </Grid.Column>
            <Grid.Column textAlign="right">
              <List bulleted horizontal>
                <List.Item as="a" href="http://radgrad.org/" target="_blank" style={styles['footer-item:before, .footer-item']}>
                  About Us
                </List.Item>
                <List.Item as="a" href="http://radgrad.org/docs/about/contact-us" style={styles['footer-item:before, .footer-item']}>
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

export default PageFooter;

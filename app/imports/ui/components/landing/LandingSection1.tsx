import * as React from 'react';
import { Card, Container, Grid, Header, Icon, Image, Label } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import MenuIceCircle from '../shared/MenuIceCircle';
import styles from './landing-styles';

// import './landing-section-1.css';

const headerStyle = { fontSize: '72px', display: 'inline' };
const LandingSection1 = () => (
      <div id="landing-section-1" style={styles['inverted-section']}>
        <Container textAlign={'center'}>
          <Header as="h1" inverted={true} style={styles['inverted-main-header']}>Welcome to <span color="green"><RadGradLogoText color={'green'} style={headerStyle}/></span></Header>
          <Header as="h2" inverted={true} className="mobile only" style={styles['mobile-header']}>Welcome to <span className="green-text"><RadGradLogoText/></span></Header>
          <br/>
          <span style={styles['inverted-main-description']}>Developing awesome computer scientists, <b>one</b> graduate at a time.</span>
          <Card.Group stackable={true} doubling={true} centered={true} itemsPerRow={4} style={styles['main-header-ice']}>
            <Card>
              <Card.Content>
                <Image size={'mini'} floated={'right'} src="/images/landing/yamakawa.jpg"/>
                <Card.Header>Kelsie Y.</Card.Header>
                <Card.Meta>
                  B.S. in Computer Science
                </Card.Meta>
                <Card.Description>
                  <Grid className="landing-ice" columns={3}>
                    <Grid.Column>
                      <MenuIceCircle earned={92} planned={100} type={'innov'}/>
                    </Grid.Column>
                    <Grid.Column>
                      <MenuIceCircle earned={81} planned={100} type={'comp'}/>
                    </Grid.Column>
                    <Grid.Column>
                      <MenuIceCircle earned={90} planned={100} type={'exp'}/>
                    </Grid.Column>
                  </Grid>
                </Card.Description>
              </Card.Content>
              <Card.Content extra={true} textAlign={'left'}>
                <Label size={'mini'}><Icon fitted={true} name="suitcase"/>Data Science</Label>
                <Label size={'mini'}><Icon fitted={true} name="suitcase"/>Databases</Label>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Image size={'mini'} floated={'right'} src="/images/landing/boado.jpg"/>
                <Card.Header>Brian B.</Card.Header>
                <Card.Meta>
                  B.A. in Info. &amp; Comp. Sci.
                </Card.Meta>
                <Card.Description>
                  <Grid className="landing-ice" columns={3}>
                    <Grid.Column>
                      <MenuIceCircle earned={68} planned={100} type={'innov'}/>
                    </Grid.Column>
                    <Grid.Column>
                      <MenuIceCircle earned={63} planned={100} type={'comp'}/>
                    </Grid.Column>
                    <Grid.Column>
                      <MenuIceCircle earned={70} planned={100} type={'exp'}/>
                    </Grid.Column>
                  </Grid>
                </Card.Description>
              </Card.Content>
              <Card.Content extra={true} textAlign={'left'}>
                <Label size={'mini'}><Icon fitted={true} name="suitcase"/>Software Engineering</Label>
                <Label size={'mini'} className="ui mini label"><Icon fitted={true} name="suitcase"/>Reseach</Label>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Image size={'mini'} floated={'right'} src="/images/landing/shimoda.jpg"/>
                <Card.Header>Michele S.</Card.Header>
                <Card.Meta>
                  B.S. in Computer Science
                </Card.Meta>
                <Card.Description>
                  <Grid className="landing-ice" columns={3}>
                    <Grid.Column>
                      <MenuIceCircle earned={86} planned={100} type={'innov'}/>
                    </Grid.Column>
                    <Grid.Column>
                      <MenuIceCircle earned={81} planned={100} type={'comp'}/>
                    </Grid.Column>
                    <Grid.Column>
                      <MenuIceCircle earned={95} planned={100} type={'exp'}/>
                    </Grid.Column>
                  </Grid>
                </Card.Description>
              </Card.Content>
              <Card.Content extra={true}>
                <Label size={'mini'}><Icon fitted={true} name="suitcase"/>Game Design</Label>
                <Label size={'mini'}><Icon fitted={true} name="star"/>Unity</Label>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                <Image size={'mini'} floated={'right'} src="/images/landing/morikawa.jpg"/>
                <Card.Header>Sy M.</Card.Header>
                <Card.Meta>
                  B.S. in Computer Science
                </Card.Meta>
                <Card.Description>
                  <Grid className="landing-ice" columns={3}>
                    <Grid.Column>
                      <MenuIceCircle earned={65} planned={100} type={'innov'}/>
                      {/* {{ > First_Menu_Ice earned="92" projected="100" iceType="innov" type='landing'}} */}
                    </Grid.Column>
                    <Grid.Column>
                      <MenuIceCircle earned={78} planned={100} type={'comp'}/>
                      {/* {{ > First_Menu_Ice earned="81" projected="100" iceType="comp" type='landing'}} */}
                    </Grid.Column>
                    <Grid.Column>
                      <MenuIceCircle earned={74} planned={100} type={'exp'}/>
                      {/* {{ > First_Menu_Ice earned="90" projected="100" iceType="exp" type='landing'}} */}
                    </Grid.Column>
                  </Grid>
                </Card.Description>
                <Card.Content extra={true}>
                  <Label size={'mini'}><Icon fitted={true} name="suitcase"/>Hardware</Label>
                  <Label size={'mini'}><Icon fitted={true} name="suitcase"/>Networks</Label>
                </Card.Content>
              </Card.Content>
            </Card>
          </Card.Group>
        </Container>
      </div>
);

export default LandingSection1;

import * as React from 'react';
import { Card, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import MenuIceCircle from '../shared/MenuIceCircle';

import './landing-section-1.css';

class LandingSection1 extends React.Component {
  public render() {
    const invertedSectionStyle = { backgroundColor: 'rgba(0,0,0,.8)',  paddingTop: '68px !important', paddingBottom: '9px !important', textAlign: 'center', marginTop: '0px', marginBottom: '0px' };
    const headerStyle = { fontSize: '72px', display: 'inline' };
    const mainDescriptionStyle = { color: 'rgba(255,255,255,.7)', fontSize: '20px' };
    return (
      <Segment id="landing-section-1" style={invertedSectionStyle}>
        <Header as="h1" inverted={true} style={headerStyle}>Welcome to <span color="green"><RadGradLogoText color={'green'} style={headerStyle}/></span></Header>
        <Header as="h2" className="inverted-main-header mobile only mobile-header">Welcome to <span className="green-text"><RadGradLogoText/></span></Header>
        <br/>
        <span style={mainDescriptionStyle}>Developing awesome computer scientists, <b>one</b> graduate at a time.</span>
        <Card.Group className="main-header-ice" centered={true} stackable={true}>
          <Card>
            <Card.Content>
              <Image size={'mini'} floated={'right'} src="/images/landing/yamakawa.jpg"/>
              <Card.Content header={'Kelsie Y.'}/>
              <Card.Meta>
                B.S. in Computer Science
              </Card.Meta>
              <Card.Description>
                <Grid className="landing-ice" columns={3}>
                  <Grid.Column>
                    <MenuIceCircle earned={92} planned={100} type={'innov'}/>
                    {/*{{ > First_Menu_Ice earned="92" projected="100" iceType="innov" type='landing'}}*/}
                  </Grid.Column>
                  <Grid.Column>
                    <MenuIceCircle earned={81} planned={100} type={'comp'}/>
                    {/*{{ > First_Menu_Ice earned="81" projected="100" iceType="comp" type='landing'}}*/}
                  </Grid.Column>
                  <Grid.Column>
                    <MenuIceCircle earned={90} planned={100} type={'exp'}/>
                    {/*{{ > First_Menu_Ice earned="90" projected="100" iceType="exp" type='landing'}}*/}
                  </Grid.Column>
                </Grid>
              </Card.Description>
              <div className="extra content">
                <div className="ui mini label"><Icon fitted={true} name="suitcase"/>Data Science</div>
                <div className="ui mini label"><Icon fitted={true} name="suitcase"/>Databases</div>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <Image size={'mini'} floated={'right'} src="/images/landing/boado.jpg"/>
              <Card.Content header={'Brian B.'}/>
              <Card.Meta>
                B.A. in Info. &amp; Comp. Sci.
              </Card.Meta>
              <Card.Description>
                <Grid className="landing-ice" columns={3}>
                  <Grid.Column>
                    <MenuIceCircle earned={68} planned={100} type={'innov'}/>
                    {/*{{ > First_Menu_Ice earned="92" projected="100" iceType="innov" type='landing'}}*/}
                  </Grid.Column>
                  <Grid.Column>
                    <MenuIceCircle earned={63} planned={100} type={'comp'}/>
                    {/*{{ > First_Menu_Ice earned="81" projected="100" iceType="comp" type='landing'}}*/}
                  </Grid.Column>
                  <Grid.Column>
                    <MenuIceCircle earned={70} planned={100} type={'exp'}/>
                    {/*{{ > First_Menu_Ice earned="90" projected="100" iceType="exp" type='landing'}}*/}
                  </Grid.Column>
                </Grid>
              </Card.Description>
              <div className="extra content">
                <div className="ui mini label"><Icon fitted={true} name="suitcase"/>Software Engineering</div>
                <div className="ui mini label"><Icon fitted={true} name="suitcase"/>Reseach</div>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <Image size={'mini'} floated={'right'} src="/images/landing/shimoda.jpg"/>
              <Card.Content header={'Michele S.'}/>
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
              <div className="extra content">
                <div className="ui mini label"><Icon fitted={true} name="suitcase"/>Game Design</div>
                <div className="ui mini label"><Icon fitted={true} name="star"/>Unity</div>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <Image size={'mini'} floated={'right'} src="/images/landing/morikawa.jpg"/>
              <Card.Content header={'Sy M.'}/>
              <Card.Meta>
                B.S. in Computer Science
              </Card.Meta>
              <Card.Description>
                <Grid className="landing-ice" columns={3}>
                  <Grid.Column>
                    <MenuIceCircle earned={65} planned={100} type={'innov'}/>
                    {/*{{ > First_Menu_Ice earned="92" projected="100" iceType="innov" type='landing'}}*/}
                  </Grid.Column>
                  <Grid.Column>
                    <MenuIceCircle earned={78} planned={100} type={'comp'}/>
                    {/*{{ > First_Menu_Ice earned="81" projected="100" iceType="comp" type='landing'}}*/}
                  </Grid.Column>
                  <Grid.Column>
                    <MenuIceCircle earned={74} planned={100} type={'exp'}/>
                    {/*{{ > First_Menu_Ice earned="90" projected="100" iceType="exp" type='landing'}}*/}
                  </Grid.Column>
                </Grid>
              </Card.Description>
              <div className="extra content">
                <div className="ui mini label"><Icon fitted={true} name="suitcase"/>Hardware</div>
                <div className="ui mini label"><Icon fitted={true} name="suitcase"/>Networks</div>
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </Segment>
    );
  }
}

export default LandingSection1;

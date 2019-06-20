import * as React from 'react';
import { Grid, Segment, Header, Button, Divider, Image } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { Link } from 'react-router-dom';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import InterestList from './InterestList';
import { Users } from '../../../api/user/UserCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';


interface IExplorerCareerGoalsWidgetProps {
  name: string;
  slug: string;
  descriptionPairs: any;
  item: object;
  socialPairs: any;
}

class ExplorerCareerGoalsWidget extends React.Component<IExplorerCareerGoalsWidgetProps> {
  constructor(props) {
    super(props);
  }

  /*
Because we are using react-router, the converted markdown hyperlinks won't be redirected properly. This is a solution.
See https://github.com/rexxars/react-markdown/issues/29#issuecomment-231556543
*/
  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href}>{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
  )

  private getCareerGoalName = () => this.props.name;

  private getDescriptionPair = () => this.props.descriptionPairs;

  private getSocialPair = () => this.props.socialPairs;

  private toUpper = (string) => string.toUpperCase();

  private isLabel = (descriptionPairLabel, comp) => descriptionPairLabel === comp;

  private userPicture = (user) => {
    const picture = Users.getProfile(user).picture;
    return picture || defaultProfilePicture;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const marginStyle = {
      marginTop: 5,
    };

    const imageStyle = {
      marginBottom: 7,
      marginLeft: 3.5,
      marginRight: 3.5,
    };

    const divPadding = {
      marginTop: 0,
      padding: 0,
    };
    const upperName = this.toUpper(this.getCareerGoalName());
    const descriptionPairs = this.getDescriptionPair();
    const socialPairs = this.getSocialPair();
    const item = this.props.item;
    return (
      <Grid container={true} stackable={true} style={marginStyle}>
        <Grid.Column width={16}>
          <Segment>
            <Segment basic clearing={true} vertical>
              <Grid.Row verticalAlign={'middle'}>
                <Button size={'mini'} color={'green'} floated={'right'} basic={true}>ADD TO CAREER GOALS</Button>
                <Header floated={'left'}>{upperName}</Header>
              </Grid.Row>
            </Segment>
            <Divider style={divPadding}/>
            <Grid.Column>
              {descriptionPairs.map((descriptionPair, index) => (
                <React.Fragment key={index}>
                  {
                    this.isLabel(descriptionPair.label, 'Description') ?
                      <React.Fragment>
                        <b>{descriptionPair.label}:<br/></b>
                        {
                          descriptionPair.value ?
                            <Markdown escapeHtml={false} source={descriptionPair.value}
                                      renderers={{ link: this.routerLink }}/>
                            :
                            'N/A'
                        }
                      </React.Fragment>
                      : ''
                  }

                  {
                    this.isLabel(descriptionPair.label, 'Interests') ?
                      <div style={{ marginTop: '5px' }}>
                        <InterestList item={item} size='mini' align={'vertical'}/>
                      </div>
                      : ''
                  }
                </React.Fragment>
              ))
              }
            </Grid.Column><br/>
            <Divider/>
            <Grid stackable={true} celled={'internally'} columns={'equal'}>
              {socialPairs.map((socialPair, index) => (
                <React.Fragment key={index}>
                  <Grid.Column textAlign={'center'} style={divPadding}>
                    <h5>{this.toUpper(socialPair.label)} - {socialPair.amount}</h5>
                    {socialPair.value.map((user, index2) => (
                      <Image src={this.userPicture(user)} circular size='mini' verticalAlign={'middle'} key={index2} style={imageStyle}/>
                    ))}
                  </Grid.Column>
                </React.Fragment>
              ))}
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const ExplorerCareerGoalsWidgetCon = withGlobalSubscription(ExplorerCareerGoalsWidget);
const ExplorerCareerGoalsWidgetContainer = withInstanceSubscriptions(ExplorerCareerGoalsWidgetCon);

export default ExplorerCareerGoalsWidgetContainer;

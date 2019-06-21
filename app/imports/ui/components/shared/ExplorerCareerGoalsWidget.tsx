import * as React from 'react';
import { Grid, Segment, Header, Button, Divider, Image } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import InterestList from './InterestList';
import { Users } from '../../../api/user/UserCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';


interface IExplorerCareerGoalsWidgetProps {
  name: string;
  slug: string;
  descriptionPairs: any;
  profile: any;
  item: { [key: string]: any };
  socialPairs: any;
  id: any;
  username: string;
  careerGoal: any;
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

  private getCareerGoal = () => this.props.careerGoal;

  private getDescriptionPair = () => this.props.descriptionPairs;

  private getSocialPair = () => this.props.socialPairs;

  private getID = () => this.props.id;

  private toUpper = (string) => string.toUpperCase();

  private isLabel = (descriptionPairLabel, comp) => descriptionPairLabel === comp;

  private userPicture = (user) => {
    const picture = Users.getProfile(user).picture;
    return picture || defaultProfilePicture;
  }

  private userStatus = (careerGoal) => {
    let ret = false;
    const profile = Users.getProfile(this.props.username);
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      ret = true;
    }
    return ret;
  }

  private handleAdd = (event) => {
    event.preventDefault();
    const profile = Users.getProfile(this.props.username);
    const id = this.getID();
    const studentItems = profile.careerGoalIDs;
    const collectionName = StudentProfiles.getCollectionNameForProfile(profile);
    const updateData: any = {};
    updateData.id = profile._id;
    studentItems.push(id);
    updateData.careerGoals = studentItems;
    console.log('update', collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error updating career goals', error);
      }
    });
  }

  private handleDelete = (event) => {
    event.preventDefault();
    const profile = Users.getProfile(this.props.username);
    const id = this.getID();
    let studentItems = profile.careerGoalIDs;
    const collectionName = StudentProfiles.getCollectionNameForProfile(profile);
    const updateData: { [key: string]: any } = {};
    updateData.id = profile._id;
    studentItems = _.without(studentItems, id);
    updateData.careerGoals = studentItems;
    console.log('update', collectionName, updateData);
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error updating career goals', error);
      }
    });
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
    const careerGoal = this.getCareerGoal();
    const socialPairs = this.getSocialPair();
    const item = this.props.item;
    const userStatus = this.userStatus(careerGoal);
    return (
      <Grid container={true} stackable={true} style={marginStyle}>
        <Grid.Column width={16}>
          <Segment>
            <Segment basic clearing={true} vertical>
              <Grid.Row verticalAlign={'middle'}>
                {
                  userStatus ?
                    <Button onClick={this.handleDelete} size={'mini'} color={'green'} floated={'right'} basic={true}>DELETE
                      FROM CAREER
                      GOALS</Button>
                    :
                    <Button size={'mini'} onClick={this.handleAdd} color={'green'} floated={'right'} basic={true}>ADD TO
                      CAREER GOALS</Button>
                }
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
                      <Image src={this.userPicture(user)} circular size='mini' verticalAlign={'middle'} key={index2}
                             style={imageStyle}/>
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

const ExplorerCareerGoalsWidgetContainer = withTracker((props) => {
  const profile = Users.getProfile(props.username);
  console.log('profile %o', profile);
  return {
    profile,
  };
})(ExplorerCareerGoalsWidget);
export default ExplorerCareerGoalsWidgetContainer;

import * as React from 'react';
import { Grid, Segment, Header, Button, Divider, Image, Popup } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import InterestList from './InterestList';
import { Users } from '../../../api/user/UserCollection';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { IProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { getUsername, renderLink } from './RouterHelperFunctions';
import WidgetHeaderNumber from './WidgetHeaderNumber';

interface IExplorerCareerGoalsWidgetProps {
  name: string;
  descriptionPairs: any;
  item: { [key: string]: any };
  socialPairs: any;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  profile: IProfile;
}

class ExplorerCareerGoalsWidget extends React.Component<IExplorerCareerGoalsWidgetProps> {
  constructor(props) {
    super(props);
  }

  private toUpper = (string) => string.toUpperCase();

  private isLabel = (descriptionPairLabel, comp) => descriptionPairLabel === comp;

  private userPicture = (user) => {
    const picture = Users.getProfile(user).picture;
    return picture || defaultProfilePicture;
  }

  private userStatus = (careerGoal) => {
    let ret = false;
    const profile = Users.getProfile(getUsername(this.props.match));
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      ret = true;
    }
    return ret;
  }

  private fullName = (user) => Users.getFullName(user);

  private handleAdd = (event) => {
    event.preventDefault();
    const profile = Users.getProfile(getUsername(this.props.match));
    const id = this.props.item._id;
    const studentItems = profile.careerGoalIDs;
    const collectionName = StudentProfiles.getCollectionNameForProfile(profile);
    const updateData: any = {};
    updateData.id = profile._id;
    studentItems.push(id);
    updateData.careerGoals = studentItems;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.log('Error updating career goals', error);
      }
    });
  }

  private handleDelete = (event) => {
    event.preventDefault();
    const profile = Users.getProfile(getUsername(this.props.match));
    const id = this.props.item._id;
    let studentItems = profile.careerGoalIDs;
    const collectionName = StudentProfiles.getCollectionNameForProfile(profile);
    const updateData: { [key: string]: any } = {};
    updateData.id = profile._id;
    studentItems = _.without(studentItems, id);
    updateData.careerGoals = studentItems;
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
    const imageGroupStyle = { overflow: 'visible' };
    const divPadding = {
      marginTop: 0,
      padding: 0,
    };
    const centerAlignedColumnStyle = { minWidth: '25%' };

    const { name, descriptionPairs, socialPairs, item, match } = this.props;
    const upperName = this.toUpper(name);
    const userStatus = this.userStatus(item);

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
                                      renderers={{ link: (props) => renderLink(props, match) }}/>
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
            <Grid stackable={true} celled={'internally'}>
              {socialPairs.map((socialPair, index) => (
                <Grid.Column key={index} textAlign={'center'} style={centerAlignedColumnStyle}>
                  <h5>{this.toUpper(socialPair.label)} <WidgetHeaderNumber inputValue={socialPair.amount}/></h5>

                  <Image.Group size="mini" style={imageGroupStyle}>
                    {socialPair.value.map((user) => <Popup
                      key={user._id}
                      trigger={<Image src={this.userPicture(user)} circular={true} bordered={true}/>}
                      content={this.fullName(user)}
                    />)}
                  </Image.Group>
                </Grid.Column>
              ))}
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const ExplorerCareerGoalsWidgetContainer = withTracker((props) => {
  const profile = Users.getProfile(props.match.params.username);

  return {
    profile,
  };
})(ExplorerCareerGoalsWidget);
export default withRouter(ExplorerCareerGoalsWidgetContainer);

import * as React from 'react';
import { Grid, Segment, Header, Image, Popup, Divider } from 'semantic-ui-react';
import * as Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import InterestList from './InterestList';
import { Users } from '../../../api/user/UserCollection';
import { IFavoriteCareerGoalDefine, IProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { renderLink, getUserIdFromRoute } from './RouterHelperFunctions';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import FavoritesButton from './FavoritesButton';
import { toUpper, isSame } from './helper-functions';
import { userToFullName, userToPicture } from './data-model-helper-functions';

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

const ExplorerCareerGoalsWidget = (props: IExplorerCareerGoalsWidgetProps) => {
  const marginStyle = {
    marginTop: 5,
  };
  const imageGroupStyle = { overflow: 'visible' };
  const divPadding = {
    marginTop: 0,
    padding: 0,
  };
  const centerAlignedColumnStyle = { minWidth: '25%' };

  const { name, descriptionPairs, socialPairs, item, match } = props;
  const upperName = toUpper(name);

  return (
    <Grid container={true} stackable={true} style={marginStyle}>
      <Grid.Column width={16}>
        <Segment>
          <Segment basic clearing={true} vertical>
            <Grid.Row verticalAlign={'middle'}>
              <FavoritesButton item={props.item} studentID={getUserIdFromRoute(props.match)} type='careerGoal'/>
              <Header floated={'left'}>{upperName}</Header>
            </Grid.Row>
          </Segment>
          <Divider style={divPadding}/>
          <Grid.Column>
            {descriptionPairs.map((descriptionPair, index) => (
              <React.Fragment key={index}>
                {
                  isSame(descriptionPair.label, 'Description') ?
                    <React.Fragment>
                      <b>{descriptionPair.label}:<br/></b>
                      {
                        descriptionPair.value ?
                          <Markdown escapeHtml={false} source={descriptionPair.value}
                                    renderers={{ link: (localProps) => renderLink(localProps, match) }}/>
                          :
                          'N/A'
                      }
                    </React.Fragment>
                    : ''
                }
                {
                  isSame(descriptionPair.label, 'Interests') ?
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
                <h5>{toUpper(socialPair.label)} <WidgetHeaderNumber inputValue={socialPair.amount}/></h5>

                <Image.Group size="mini" style={imageGroupStyle}>
                  {socialPair.value.map((user) => <Popup
                    key={user._id}
                    trigger={<Image src={userToPicture(user)} circular={true} bordered={true}/>}
                    content={userToFullName(user)}
                  />)}
                </Image.Group>
              </Grid.Column>
            ))}
          </Grid>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

const ExplorerCareerGoalsWidgetContainer = withTracker((props) => {
  const profile = Users.getProfile(props.match.params.username);

  return {
    profile,
  };
})(ExplorerCareerGoalsWidget);
export default withRouter(ExplorerCareerGoalsWidgetContainer);

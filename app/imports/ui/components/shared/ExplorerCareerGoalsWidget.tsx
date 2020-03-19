import React from 'react';
import { Grid, Segment, Header, Divider, Image, Popup, Embed } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import InterestList from './InterestList';
import { Users } from '../../../api/user/UserCollection';
import { IProfile } from '../../../typings/radgrad';
import { renderLink, getUserIdFromRoute } from './RouterHelperFunctions';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import FavoritesButton from './FavoritesButton';
import { toUpper, isSame } from './helper-functions';
import { userToFullName, userToPicture } from './data-model-helper-functions';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { explorerCareerGoalWidget } from './shared-widget-names';
import { Slugs } from '../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { toId } from '../../shared/description-pair-helpers';
import { FAVORITE_TYPE } from '../../../api/favorite/FavoriteTypes';

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
      careergoal: string;
    }
  };
  profile: IProfile;
}

const teaserUrlHelper = (props: IExplorerCareerGoalsWidgetProps): string => {
  const _id = Slugs.getEntityID(props.match.params.careergoal, 'CareerGoal');
  const careerGoal = CareerGoals.findDoc({ _id });
  const oppTeaser = Teasers.findNonRetired({ targetSlugID: careerGoal.slugID });
  // console.log(oppTeaser);
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};


const ExplorerCareerGoalsWidget = (props: IExplorerCareerGoalsWidgetProps) => {
  // console.log(props);
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
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: item.slugID }).length > 0;
  return (
    <Grid container stackable style={marginStyle} id={explorerCareerGoalWidget}>
      <Grid.Column width={16}>
        <Segment>
          <Segment basic clearing vertical>
            <Grid.Row verticalAlign="middle">
              <FavoritesButton
                item={props.item}
                studentID={getUserIdFromRoute(props.match)}
                type={FAVORITE_TYPE.CAREERGOAL}
              />
              <Header floated="left">{upperName}</Header>
            </Grid.Row>
          </Segment>
          <Divider style={divPadding} />
          <div style={{ marginTop: '5px' }}>
            <InterestList item={item} size="mini" align="vertical" />
          </div>
          {
            hasTeaser ?
              (
                <Grid stackable columns={2}>
                  <Grid.Column width={9}>
                    {descriptionPairs.map((descriptionPair) => (
                      <React.Fragment key={toId(descriptionPair)}>
                        {
                          isSame(descriptionPair.label, 'Description') ? (
                            <React.Fragment>
                              <b>
                                {descriptionPair.label}
                                :
                                <br />
                              </b>
                              {
                                descriptionPair.value ? (
                                  <Markdown
                                    escapeHtml={false}
                                    source={descriptionPair.value}
                                    renderers={{ link: (localProps) => renderLink(localProps, match) }}
                                  />
                                )
                                  :
                                  'N/A'
                              }
                            </React.Fragment>
                          )
                            : ''
                        }
                      </React.Fragment>
                    ))}
                  </Grid.Column>
                  <Grid.Column width={7}>
                    {
                      descriptionPairs.map((descriptionPair) => (
                        <React.Fragment key={toId(descriptionPair)}>
                          {
                            isSame(descriptionPair.label, 'Teaser') && teaserUrlHelper(props) ? (
                              <React.Fragment>
                                <b>
                                  {descriptionPair.label}
                                  :
                                </b>
                                {
                                  descriptionPair.value ? (
                                    <Embed
                                      active
                                      autoplay={false}
                                      source="youtube"
                                      id={teaserUrlHelper(props)}
                                    />
                                  )
                                    :
                                    <p> N/A </p>
                                }
                              </React.Fragment>
                            )
                              : ''
                          }
                        </React.Fragment>
                      ))
                    }
                  </Grid.Column>
                </Grid>
              )
              :
              (
                <Grid.Column>
                  {descriptionPairs.map((descriptionPair) => (
                    <React.Fragment key={toId(descriptionPair)}>
                      {
                        isSame(descriptionPair.label, 'Description') ? (
                          <React.Fragment>
                            <b>
                              {descriptionPair.label}
                              :
                              <br />
                            </b>
                            {
                              descriptionPair.value ? (
                                <Markdown
                                  escapeHtml={false}
                                  source={descriptionPair.value}
                                  renderers={{ link: (localProps) => renderLink(localProps, match) }}
                                />
                              )
                                :
                                'N/A'
                            }
                          </React.Fragment>
                        )
                          : ''
                      }
                    </React.Fragment>
                  ))}
                </Grid.Column>
              )
          }
          <br />
          <Divider />
          <Grid stackable celled="internally">
            {socialPairs.map((socialPair) => (
              <Grid.Column key={toId(socialPair)} textAlign="center" style={centerAlignedColumnStyle}>
                <h5>
                  {toUpper(socialPair.label)}
                  {' '}
                  <WidgetHeaderNumber inputValue={socialPair.amount} />
                </h5>

                <Image.Group size="mini" style={imageGroupStyle}>
                  {socialPair.value.map((user) => (
                    <Popup
                      key={user._id}
                      trigger={<Image src={userToPicture(user)} circular bordered />}
                      content={userToFullName(user)}
                    />
))}
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

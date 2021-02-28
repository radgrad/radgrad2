import React from 'react';
import { Grid, Segment, Header, Divider, Image, Popup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import InterestList from '../../../InterestList';
import { Users } from '../../../../../../api/user/UserCollection';
import { CareerGoal, DescriptionPair, SocialPair } from '../../../../../../typings/radgrad';
import { renderLink, getUserIdFromRoute } from '../../../utilities/router';
import WidgetHeaderNumber from '../../WidgetHeaderNumber';
import AddCareerGoalToProfileButton from '../AddCareerGoalToProfileButton';
import AddToProfileButton from '../AddToProfileButton';
import { toUpper, isSame } from '../../../utilities/general';
import { userToFullName, userToPicture } from '../../../utilities/data-model';
import { Teasers } from '../../../../../../api/teaser/TeaserCollection';
import { Slugs } from '../../../../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../../../../api/career/CareerGoalCollection';
import { toId } from '../course/utilities/description-pair';
import { PROFILE_ENTRY_TYPE } from '../../../../../../api/user/profile-entries/ProfileEntryTypes';
import TeaserVideo from '../../../TeaserVideo';
import { ProfileCareerGoals } from '../../../../../../api/user/profile-entries/ProfileCareerGoalCollection';

interface ExplorerCareerGoalProps {
  name: string;
  descriptionPairs: DescriptionPair[];
  item: CareerGoal;
  socialPairs: SocialPair[];
}

const teaserUrlHelper = (careerGoalSlug): string => {
  const _id = Slugs.getEntityID(careerGoalSlug, 'CareerGoal');
  const careerGoal = CareerGoals.findDoc({ _id });
  const oppTeaser = Teasers.findNonRetired({ targetSlugID: careerGoal.slugID });
  if (oppTeaser.length > 1) {
    return undefined;
  }
  return oppTeaser && oppTeaser[0] && oppTeaser[0].url;
};

const ExplorerCareerGoal: React.FC<ExplorerCareerGoalProps> = ({ name, descriptionPairs, socialPairs, item }) => {
  const marginStyle = {
    marginTop: 5,
  };
  const imageGroupStyle = { overflow: 'visible' };
  const divPadding = {
    marginTop: 0,
    padding: 0,
  };
  const centerAlignedColumnStyle = { minWidth: '25%' };

  const match = useRouteMatch();
  const upperName = toUpper(name);
  const hasTeaser = Teasers.findNonRetired({ targetSlugID: item.slugID }).length > 0;
  const { careergoal, username } = useParams();
  const profile = Users.getProfile(username);
  const added = ProfileCareerGoals.findNonRetired({ userID: profile.userID, careerGoalID: item._id }).length > 0;
  return (
    <Grid container stackable style={marginStyle} id="explorerCareerGoalWidget">
      <Grid.Column width={16}>
        <Segment>
          <Segment basic clearing vertical>
            <Grid.Row verticalAlign="middle">
              <AddCareerGoalToProfileButton careerGoal={item} userID={getUserIdFromRoute(match)} added={added} />
              <Header floated="left">{upperName}</Header>
            </Grid.Row>
          </Segment>
          <Divider style={divPadding} />
          <div style={{ marginTop: '5px' }}>
            <InterestList item={item} size="mini" />
          </div>
          {hasTeaser ? (
            <Grid stackable columns={2}>
              <Grid.Column width={9}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={toId(descriptionPair)}>
                    {isSame(descriptionPair.label, 'Description') ? (
                      <React.Fragment>
                        <b>
                          {descriptionPair.label}
                          :
                          <br />
                        </b>
                        {descriptionPair.value ? <Markdown escapeHtml={false} source={`${descriptionPair.value}`} renderers={{ link: (localProps) => renderLink(localProps, match) }} /> : 'N/A'}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </Grid.Column>
              <Grid.Column width={7}>
                {descriptionPairs.map((descriptionPair) => (
                  <React.Fragment key={toId(descriptionPair)}>
                    {isSame(descriptionPair.label, 'Teaser') && teaserUrlHelper(careergoal) ? (
                      <React.Fragment>
                        <b>{descriptionPair.label}:</b>
                        {descriptionPair.value ? <TeaserVideo id={teaserUrlHelper(careergoal)} /> : <p> N/A </p>}
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </Grid.Column>
            </Grid>
          ) : (
            <Grid.Column>
              {descriptionPairs.map((descriptionPair) => (
                <React.Fragment key={toId(descriptionPair)}>
                  {isSame(descriptionPair.label, 'Description') ? (
                    <React.Fragment>
                      <b>
                        {descriptionPair.label}
                        :
                        <br />
                      </b>
                      {descriptionPair.value ? <Markdown escapeHtml={false} source={`${descriptionPair.value}`} renderers={{ link: (localProps) => renderLink(localProps, match) }} /> : 'N/A'}
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </React.Fragment>
              ))}
            </Grid.Column>
          )}
          <br />
          <Divider />
          <Grid stackable celled="internally">
            {socialPairs.map((socialPair) => (
              <Grid.Column key={toId(socialPair)} textAlign="center" style={centerAlignedColumnStyle}>
                <h5>
                  {toUpper(socialPair.label)} <WidgetHeaderNumber inputValue={socialPair.amount} />
                </h5>

                <Image.Group size="mini" style={imageGroupStyle}>
                  {socialPair.value.map((user) => (
                    <Popup key={user._id} trigger={<Image src={userToPicture(user)} circular bordered />} content={userToFullName(user)} />
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

export default ExplorerCareerGoal;

import React from 'react';
import { Card, Image, Grid, Dimmer } from 'semantic-ui-react';
import _ from 'lodash';
import { FavoriteInterests } from '../../../app/imports/api/favorite/FavoriteInterestCollection';
import { BaseProfile } from '../../../app/imports/typings/radgrad';
import { defaultProfilePicture } from '../../../app/imports/api/user/BaseProfileCollection';
import { ROLE } from '../../../app/imports/api/role/Role';
import InterestList from '../../../app/imports/ui/components/shared/InterestList';
import { capitalizeFirstLetter } from '../../issue-412/general';

interface ExplorerUsersWidgetProps {
  userProfile: BaseProfile;
  isActive: boolean;
  handleClose: any;
}

const isRole = (userProfile, compareRole: string, ...otherRoles: string[]): boolean => userProfile.role === compareRole || _.includes(otherRoles, userProfile.role);

/**
 * This component is a placeholder in case an individual explorer is created for users. It offers
 * little more than the UserProfileCard, with the most notable differences being a full website
 * being displayed instead of a button and the BaseProfile.motivation field being displayed if it exists.
 * @param userProfile {BaseProfile} User profile to be displayed
 * @param isActive {boolean} This component expects the parent to manage state
 * @param handleClose {function} Handler to close component (dimmer) when clicking outside of the component
 * @return {Dimmer} */
const ExplorerUsersWidget: React.FC<ExplorerUsersWidgetProps> = ({ userProfile, isActive, handleClose }) => {
  if (!userProfile) return undefined;
  const overflowStyle: React.CSSProperties = { overflow: 'scroll' };
  const cardStyle: React.CSSProperties = {
    textAlign: 'left',
    color: 'black',
    lineHeight: '1.5',
    width: '400px',
  };
  const p = userProfile;
  const level = p.level;
  let sharedUsername;
  if (isRole(userProfile, ROLE.STUDENT, ROLE.ALUMNI)) {
    sharedUsername = p.shareUsername ? (
      <React.Fragment>
        {p.username}
        <br />
      </React.Fragment>
    ) : undefined;
  }
  const favInterests = FavoriteInterests.findNonRetired({ userID: p.userID });
  const interestIDs = _.map(favInterests, (f) => f.interestID);
  const fakeP = {
    interestIDs,
  };
  return (
    <Dimmer style={overflowStyle} active={isActive} onClickOutside={handleClose} page id="explorerUserWidget">
      <Grid centered>
        <Grid.Column width={12}>
          <Card fluid style={cardStyle}>
            <Card.Content>
              <Image src={p.picture ? p.picture : defaultProfilePicture} floated="right" size="tiny" />
              <Card.Header>{`${p.firstName} ${p.lastName}`}</Card.Header>
              <Card.Meta>
                {capitalizeFirstLetter(p.role)}
                <br />
                {level ? <Image style={{ padding: '5px' }} size="mini" src={`/images/level-icons/radgrad-level-${level}-icon.png`} /> : undefined}
                {isRole(userProfile, ROLE.ADVISOR, ROLE.FACULTY) ? (
                  <React.Fragment>
                    {p.username}
                    <br />
                  </React.Fragment>
                ) : undefined}
                {sharedUsername}
                <br />
              </Card.Meta>
              {p.website ? (
                <a href={p.website} target="_blank" rel="noopener noreferrer">
                  {p.website}
                </a>
              ) : undefined}
              {p.motivation || undefined}
            </Card.Content>
            <Card.Content extra>
              <InterestList item={fakeP} size="mini" />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </Dimmer>
  );
};

export default ExplorerUsersWidget;

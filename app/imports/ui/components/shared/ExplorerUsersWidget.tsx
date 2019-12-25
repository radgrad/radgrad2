import React from 'react';
import { Card, Image, Grid, Dimmer } from 'semantic-ui-react';
import _ from 'lodash';
// eslint-disable-next-line no-unused-vars
import { IBaseProfile, IUserProfileCard } from '../../../typings/radgrad';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { ROLE } from '../../../api/role/Role';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import InterestList from './InterestList';
import UserAnswersComponent from './UserAnswersComponent';
import { capitalizeFirstLetter } from './helper-functions';
import { explorerUserWidget } from './shared-widget-names';

interface IExplorerUsersWidgetProps {
  userProfile: IBaseProfile;
  isActive: boolean;
  handleClose: any;
}

const isRole = (props: IExplorerUsersWidgetProps, compareRole: string, ...otherRoles: string[]): boolean => props.userProfile.role === compareRole || _.includes(otherRoles, props.userProfile.role);

/**
 * This component is a placeholder in case an individual explorer is created for users. It offers
 * little more than the UserProfileCard, with the most notable differences being a full website
 * being displayed instead of a button and the IBaseProfile.motivation field being displayed if it exists.
 * @param userProfile {IBaseProfile} User profile to be displayed
 * @param isActive {boolean} This component expects the parent to manage state
 * @param handleClose {()=>any} Handler to close component (dimmer) when clicking outside of the component
 * @return {Dimmer} */
const ExplorerUsersWidget = (props: IExplorerUsersWidgetProps) => {
  if (!(props.userProfile)) return undefined;
  const cardStyle = { textAlign: 'left', color: 'black', lineHeight: '1.5', width: '300px' };
  const p = props.userProfile;
  const level = p.level;
  const planID = p.academicPlanID;
  const degreeID = planID ? AcademicPlans.findDoc(planID).degreeID : undefined;
  const desiredDegree = degreeID ? DesiredDegrees.findDoc(degreeID) : undefined;
  let sharedUsername;
  if (isRole(props, ROLE.STUDENT, ROLE.ALUMNI)) {
    sharedUsername = p.shareUsername ? <React.Fragment>{p.username}<br/></React.Fragment> : undefined;
  }

  return (
    <Dimmer active={props.isActive} onClickOutside={props.handleClose} page={true} id={explorerUserWidget}>
      <Grid centered={true}><Grid.Column width={12}><Card fluid style={cardStyle}>
        <Card.Content>
          <Image src={p.picture ? p.picture : defaultProfilePicture} floated={'right'} size={'tiny'}/>
          <Card.Header>{`${p.firstName} ${p.lastName}`}</Card.Header>
          <Card.Meta>
            {capitalizeFirstLetter(p.role)}<br/>
            {desiredDegree ? <React.Fragment>{desiredDegree.shortName}<br/></React.Fragment> : undefined}
            {level ?
              <Image style={{ padding: '5px' }} size={'mini'}
                     src={`/images/level-icons/radgrad-level-${level}-icon.png`}/> : undefined}
            {isRole(props, ROLE.ADVISOR, ROLE.FACULTY, ROLE.MENTOR) ?
              <React.Fragment>{p.username}<br/></React.Fragment> : undefined}
            {sharedUsername}
            <br/>
          </Card.Meta>
          {p.website ?
            <a rel={'noopener noreferrer'} href={p.website} target={'_blank'}>{p.website}</a> : undefined}
          {p.motivation || undefined}
        </Card.Content>
        {isRole(props, ROLE.MENTOR) ? <UserAnswersComponent userID={p.userID}/> : undefined}
        <Card.Content extra>
          <InterestList item={p} size={'mini'}/>
        </Card.Content>
      </Card></Grid.Column></Grid>
    </Dimmer>
  );
};

export default ExplorerUsersWidget;

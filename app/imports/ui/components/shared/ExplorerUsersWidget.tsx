import * as React from 'react';
import { Card, Image, Grid, Dimmer } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
// eslint-disable-next-line no-unused-vars
import { IBaseProfile, IUserProfileCard } from '../../../typings/radgrad';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
// eslint-disable-next-line no-unused-vars
import { ROLE } from '../../../api/role/Role';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import InterestList from './InterestList';
import UserAnswersComponent from './UserAnswersComponent';
import { capitalizeFirstLetter } from './helper-functions';

/* global window */

interface IExplorerUsersWidgetProps {
  userProfile: IBaseProfile;
  isActive: boolean;
  handleClose: any;
}

/**
 * This component is a placeholder in case an individual explorer is created for users. It offers
 * little more than the UserProfileCard, with the most notable differences being a full website
 * being displayed instead of a button and the IBaseProfile.motivation field being displayed if it exists.
 * @param userProfile {IBaseProfile} User profile to be displayed
 * @param isActive {boolean} This component expects the parent to manage state
 * @param handleClose  Handler to close component (dimmer) when clicking outside of the component
 * @return {Dimmer} */
class ExplorerUsersWidget extends React.Component<IExplorerUsersWidgetProps> {
  private isRole = (compareRole: string, ...otherRoles: string[]): boolean => this.props.userProfile.role === compareRole || _.includes(otherRoles, this.props.userProfile.role);

  private openInNewTab = () => {
    const win = window.open(this.props.userProfile.website, '_blank');
    win.focus();
  }

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    if (!(this.props.userProfile)) return undefined;
    const cardStyle = { textAlign: 'left', color: 'black', lineHeight: '1.5', width: '300px' };
    const p = this.props.userProfile;
    const level = p.level;
    const planID = p.academicPlanID;
    const degreeID = planID ? AcademicPlans.findDoc(planID).degreeID : undefined;
    const desiredDegree = degreeID ? DesiredDegrees.findDoc(degreeID) : undefined;
    let sharedUsername;
    if (this.isRole(ROLE.STUDENT, ROLE.ALUMNI)) {
      sharedUsername = p.shareUsername ? <React.Fragment>{p.username}<br/></React.Fragment> : undefined;
    }

    return (
      <Dimmer active={this.props.isActive} onClickOutside={this.props.handleClose} page={true}>
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
              {this.isRole(ROLE.ADVISOR, ROLE.FACULTY, ROLE.MENTOR) ?
                <React.Fragment>{p.username}<br/></React.Fragment> : undefined}
              {sharedUsername}
              <br/>
            </Card.Meta>
            {p.website ?
              <a rel={'noopener noreferrer'} href={p.website} target={'_blank'}>{p.website}</a> : undefined}
            {p.motivation || undefined}
          </Card.Content>
          {this.isRole(ROLE.MENTOR) ? <UserAnswersComponent userID={p.userID}/> : undefined}
          <Card.Content extra>
            <InterestList item={p} size={'mini'}/>
          </Card.Content>
        </Card></Grid.Column></Grid>
      </Dimmer>
    );
  }
}

export default ExplorerUsersWidget;

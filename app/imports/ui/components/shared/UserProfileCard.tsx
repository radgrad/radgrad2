import * as React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import * as _ from 'lodash';
import { IUserProfileCard } from '../../../typings/radgrad';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
import { ROLE } from '../../../api/role/Role';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import InterestList from './InterestList';
import UserAnswersComponent from './UserAnswersComponent';
import ExplorerUsersWidget from './ExplorerUsersWidget';
import { capitalizeFirstOnly } from './helper-functions';

/* global window */

interface IUserProfileCardState {
  isActive: boolean;
}

/**
 * Component that displays a <Card> given a user profile. Although the interface accepts type <b>any</b>,
 * this component expects an <b>IBaseProfile</b> and will not render without certain required information.
 * @param item {IBaseProfile} A user profile to process for display on the card
 * @return {Card} */

class UserProfileCard extends React.Component<IUserProfileCard, IUserProfileCardState> {
  constructor(props) {
    super(props);
    this.state = { isActive: false };
  }

  private isRole = (compareRole: string, ...otherRoles: string[]): boolean => this.props.item.role === compareRole || _.includes(otherRoles, this.props.item.role);

  private openInNewTab = () => {
    const win = window.open(this.props.item.website, '_blank');
    win.focus();
  }

  private toggleFullSize = () => {
    this.setState({ isActive: !this.state.isActive });
  }

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    if (!(this.props.item)) return undefined;
    const p = this.props.item;
    const level = p.level;
    const planID = p.academicPlanID;
    const degreeID = planID ? AcademicPlans.findDoc(planID).degreeID : undefined;
    const desiredDegree = degreeID ? DesiredDegrees.findDoc(degreeID) : undefined;
    let sharedUsername;
    if (this.isRole(ROLE.STUDENT, ROLE.ALUMNI)) {
      sharedUsername = p.shareUsername ? <React.Fragment>{p.username}<br/></React.Fragment> : undefined;
    }

    return (
      <Card fluid>
        <Card.Content>
          <Image src={p.picture ? p.picture : defaultProfilePicture} floated={'right'} size={'tiny'}/>
          <Card.Header>{`${p.firstName} ${p.lastName}`}</Card.Header>
          <Card.Meta>
            {capitalizeFirstOnly(p.role)}<br/>
            {desiredDegree ? <React.Fragment>{desiredDegree.shortName}<br/></React.Fragment> : undefined}
            {level ?
              <Image style={{ padding: '5px' }} size={'mini'}
                     src={`/images/level-icons/radgrad-level-${level}-icon.png`}/> : undefined}
            {this.isRole(ROLE.ADVISOR, ROLE.FACULTY, ROLE.MENTOR) ?
              <React.Fragment>{p.username}<br/></React.Fragment> : undefined}
            {sharedUsername}
            <br/>
          </Card.Meta>
          {p.website ? <Button basic compact color={'green'} size={'small'}
                               content={'WEBSITE'} onClick={this.openInNewTab}/> : undefined}
        </Card.Content>
        {this.isRole(ROLE.MENTOR) ? <UserAnswersComponent userID={p.userID}/> : undefined}
        <Card.Content extra>
          <InterestList item={p} size={'mini'}/>
        </Card.Content>
        <Button onClick={this.toggleFullSize} content={'View Profile'}/>
        <ExplorerUsersWidget userProfile={this.props.item} isActive={this.state.isActive}
                             handleClose={this.toggleFullSize}/>
      </Card>
    );
  }
}

export default UserProfileCard;

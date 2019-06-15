import * as React from 'react';
import { Card, Image } from 'semantic-ui-react';
// eslint-disable-next-line no-unused-vars
import { IUserProfileCard } from '../../../typings/radgrad';
import { defaultProfilePicture } from '../../../api/user/BaseProfileCollection';
// eslint-disable-next-line no-unused-vars
import { ROLE } from '../../../api/role/Role';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import InterestList from './InterestList';

class UserProfileCard extends React.Component<IUserProfileCard> {

  private isRole = (compareRole: string, ...otherRoles: string[]): boolean => this.props.profile.role === compareRole || otherRoles.includes(this.props.profile.role);

  // private renderIfStudentShared = (profile, shareProp: string, component): profile is IStudentProfile => (profile[shareProp] ? component : undefined);

  // private getValidProp = <T, K extends keyof T>(profile: T, prop: string): K | undefined => (profile[prop] ? profile[prop] : undefined);

  private capitalizeFirstOnly = (str) => {
    const firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1).toLowerCase();
  };

  render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    if (!(this.props.profile)) return undefined;
    const p = this.props.profile;
    const level = p.level;
    const planID = p.academicPlanID;
    const degreeID = planID ? AcademicPlans.findDoc(planID).degreeID : undefined;
    const desiredDegree = degreeID ? DesiredDegrees.findDoc(degreeID) : undefined;

    console.log('Profile of: ', p.username, '; Role: ', p.role);

    return (
      <Card fluid>
        <Card.Content>
          <Image src={p.picture ? p.picture : defaultProfilePicture} floated={'right'} size={'tiny'}/>
          <Card.Header>{`${p.firstName} ${p.lastName}`}</Card.Header>
          <Card.Meta>
            {this.capitalizeFirstOnly(p.role)}<br/>
            {desiredDegree ? <p>{desiredDegree.shortName}</p> : undefined}
            {level ? <Image size={'mini'} src={`/images/level-icons/radgrad-level-${level}-icon.png`}/> : undefined}
            {this.isRole(ROLE.ADVISOR, ROLE.FACULTY, ROLE.MENTOR) ? p.username : undefined}<br/>
            {() => {
              if (this.isRole(ROLE.STUDENT, ROLE.ALUMNI)) {
                return p.shareUsername ? p.username : undefined;
              }
              return undefined;
            }}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <InterestList item={p} size={'mini'}/>
        </Card.Content>
      </Card>
    );
  }
}

export default UserProfileCard;

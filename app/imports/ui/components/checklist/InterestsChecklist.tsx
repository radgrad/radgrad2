import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ChecklistState } from '../../../api/checklist/ChecklistState';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import { EXPLORER, URL_ROLES } from '../../layouts/utilities/route-constants';
import ProfileInterestList from '../shared/ProfileInterestList';
import { Checklist } from './Checklist';
import '../../../../client/style.css';


export class InterestsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(name: string, student: string) {
    super(name);
    this.profile = Users.getProfile(student);
    // console.log('InterestChecklist', this.profile, StudentProfiles.findDoc(student));
    this.updateState();
  }

  public updateState(): void {
    const interests = Users.getInterestIDs(this.profile.userID);
    if (interests.length < 3) {
      // console.log('not enough interests');
      this.state = 'Improve';
    } else if (this.profile.lastVisitedInterests) {
      const lastVisit = moment(this.profile.lastVisitedInterests, 'YYYY-MM-DD', true);
      // console.log(this.profile.lastVisitedInterests, PublicStats.getPublicStat(PublicStats.interestsUpdateTime));
      if (lastVisit.isBefore(moment(PublicStats.getPublicStat(PublicStats.interestsUpdateTime), 'YYYY-MM-DD-HH-mm-ss'))) {
        this.state = 'Review';
      } else if (this.isSixMonthsOld(this.profile.lastVisitedInterests)) {
        this.state = 'Review';
      } else {
        this.state = 'Awesome';
      }
    } else {
      // console.log('no last visited page');
      this.state = 'Review';
    }
    // console.log('updatestate', this.state);
  }

  public getTitle(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Awesome':
        return <Header as='h1'>Your <strong>Interests</strong> appear to be OK</Header>;
      case 'Review':
        return <Header as='h1'>Please confirm that your current <strong>Interests</strong> are OK</Header>;
      case 'Improve':
        return <Header as='h1'>Please add at least <strong>Three Interests</strong> to your profile</Header>;
      default:
        return <React.Fragment />;
    }
  }

  public getDescription(state: ChecklistState): JSX.Element {
    switch (state) {
      case 'Awesome':
        return <p>Congrats!  You have at least three Interests in your profile, and you&apos;ve reviewed them within the past six months to be sure they are up to date.</p>;
      case 'Review':
        if (this.isSixMonthsOld(this.profile.lastVisitedInterests)) {
          return <p>You have at least three Interests in your profile, but it&apos;s been at least six months since you&apos;ve reviewed them. So, we want to check that they actually reflect your current Interests.</p>;
        }
        return <p>There are new Interests since you last reviewed your Interests. Perhaps you want to add them?</p>;
      case 'Improve':
        return <p>For RadGrad to provide you with useful recommendations for Courses and Opportunities, we need you to add at least three Interests to your profile.  Don&apos;t worry, you can (and should!) change them at any time in the future as you become interested in new things.</p>;
      default:
        return <React.Fragment />;
    }
  }

  public getDetails(state: ChecklistState): JSX.Element {
    const interests = Users.getInterestIDs(this.profile.userID);
    if (interests.length === 0) {
      return <p>You have not yet added any Interests to your profile</p>;
    }
    return <div className='highlightBox'><p>Here are your current interests:&nbsp;</p><ProfileInterestList profile={this.profile} size="medium" /></div>;
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(state: ChecklistState): JSX.Element {
    const handleVerification = () => {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.lastVisitedInterests = moment().format('YYYY-MM-DD');
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed to update lastVisitedInterests', error);
        }
      });
    };
    switch (state) {
      case 'Awesome':
        return <div className='centeredBox'><p>Click this button to go to the Interests Explorer if you want to look for new Interests anyway.&nbsp;
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.INTERESTS}`}>Go To Interests Explorer</Button> </p></div>;
      case 'Review':
        return <div className='centeredBox'>
          <p>Clicking either button sets the timestamp for the last time this item was reviewed, so it will
          move into the OK state and won&apos;t move back into the Review state for another six months.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.INTERESTS}`}>Go To Interests Explorer</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' onClick={handleVerification}>My Interests are OK</Button>
        </div>;
      case 'Improve':
        return <div className='centeredBox'><p>Click &quot;Go To Interest Explorer&quot; to search for the Interests and add at least three to
          your Profile.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.INTERESTS}`}>Go To Interests Explorer</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }
}

import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ProfileCareerGoals } from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile, StudentProfileUpdate } from '../../../typings/radgrad';
import { EXPLORER, URL_ROLES } from '../../layouts/utilities/route-constants';
import ProfileCareerGoalList from '../shared/ProfileCareerGoalList';
import { Checklist, CHECKSTATE } from './Checklist';
import '../../../../client/style.css';


export class CareerGoalsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Career Goals';
    this.profile = Users.getProfile(student);
    this.iconName = 'briefcase';
    // Specify title for each state.
    this.title[CHECKSTATE.OK] = 'Your Career Goals appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please confirm that your current Career Goals are OK';
    this.title[CHECKSTATE.IMPROVE] = 'Please add at least three Career Goals to your profile';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats!  You have at least three Career Goals in your profile, 
      and you've reviewed them within the past six months to be sure they are up to date.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisitedCareerGoals)) ?
      `You have at least three Career Goals in your profile, but it's been at least six months 
      since you've reviewed them. So, we want to check that they actually reflect your current Career Goals.` :

      'There are new Career Goals since you last reviewed your Career Goals. Perhaps you want to add them?';

    this.description[CHECKSTATE.IMPROVE] = `For RadGrad to provide you with useful recommendations for Courses and Opportunities, 
      we need you to add at least three Career Goals to your profile.  Don't worry, you can (and should!) change them at any time 
      in the future as you become interested in new things.`;
    this.updateState();
  }

  public updateState(): void {
    const userID = this.profile.userID;
    const careerGoals = ProfileCareerGoals.findNonRetired({ userID });
    if (careerGoals.length < 3) {
      // console.log('not enough careergoals');
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisitedCareerGoals) {
      const lastVisit = moment(this.profile.lastVisitedCareerGoals, 'YYYY-MM-DD', true);
      // console.log(this.profile.lastVisitedCareerGoals, PublicStats.getPublicStat(PublicStats.Career GoalsUpdateTime));
      if (lastVisit.isBefore(moment(PublicStats.getPublicStat(PublicStats.careerGoalsUpdateTime), 'YYYY-MM-DD-HH-mm-ss'))) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisitedCareerGoals)) {
        this.state = CHECKSTATE.REVIEW;
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else {
      // console.log('no last visited page');
      this.state = CHECKSTATE.REVIEW;
    }
    // console.log('updatestate', this.state);
  }

  public getDetails(state: CHECKSTATE): JSX.Element {
    const userID = this.profile.userID;
    const careerGoals = ProfileCareerGoals.findNonRetired({ userID });
    if (careerGoals.length === 0) {
      return <p>You have not yet added any Career Goals to your profile</p>;
    }
    return <div className='highlightBox'><p>Here are your current Career Goals:&nbsp;</p><ProfileCareerGoalList profile={this.profile} size="medium" /></div>;
  }

  /**
   * Returns the actions section of the checklist item.
   * @return {JSX.Element}
   */
  public getActions(state: CHECKSTATE): JSX.Element {
    const handleVerification = () => {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = this.profile._id;
      updateData.lastVisitedCareerGoals = moment().format('YYYY-MM-DD');
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed to update lastVisitedCareerGoals', error);
        }
      });
    };
    switch (state) {
      case CHECKSTATE.OK:
        return <div className='centeredBox'><p>Click this button to go to the Career Goals Explorer if you want to look for new Career Goals anyway.&nbsp;
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`}>Go To Career Goals Explorer</Button> </p></div>;
      case CHECKSTATE.REVIEW:
        return <div className='centeredBox'>
          <p>Clicking either button sets the timestamp for the last time this item was reviewed, so it will
          move into the OK state and won&apos;t move back into the Review state for another six months.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`}>Go To Career Goals Explorer</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' onClick={handleVerification}>My Career Goals are OK</Button>
        </div>;
      case CHECKSTATE.IMPROVE:
        return <div className='centeredBox'><p>Click &quot;Go To Interest Explorer&quot; to search for the Career Goals and add at least three to
          your Profile.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.CAREERGOALS}`}>Go To Career Goals Explorer</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }
}

import moment from 'moment';
import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import {updateMethod} from '../../../api/base/BaseCollection.methods';
import {PublicStats} from '../../../api/public-stats/PublicStatsCollection';
import {StudentProfiles} from '../../../api/user/StudentProfileCollection';
import {Users} from '../../../api/user/UserCollection';
import {StudentProfile, StudentProfileUpdate} from '../../../typings/radgrad';
import {EXPLORER, URL_ROLES} from '../../layouts/utilities/route-constants';
import ProfileInterestList from '../shared/ProfileInterestList';
import {Checklist, CHECKSTATE} from './Checklist';
import '../../../../client/style.css';
import {DetailsBox} from "./DetailsBox";
import ProfileFutureCoursesList from "../shared/ProfileFutureCoursesList";

export class InterestsChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Interests';
    this.profile = Users.getProfile(student);
    this.iconName = 'star';
    // Specify title for each state
    this.title[CHECKSTATE.OK] = 'Your Interests appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please confirm that your Interests are OK';
    this.title[CHECKSTATE.IMPROVE] = 'Please add at least 3 Interests to your profile';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats!  You have at least three Interests in your profile, and you've reviewed 
      them within the past six months to be sure they are up to date.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisitedInterests)) ?
      `You have at least three Interests in your profile, but it's been at least six months since you've reviewed them. 
      So, we want to check that they actually reflect your current Interests.`
      :
      'There are new Interests since you last reviewed your Interests. Perhaps you want to add them?';

    this.description[CHECKSTATE.IMPROVE] = `For RadGrad to provide you with useful recommendations for Courses and Opportunities, 
      we need you to add at least three Interests to your profile.  Don't worry, you can (and should!) change them at any 
      time in the future as you become interested in new things.`;
    this.updateState();
  }

  public updateState(): void {
    const interests = Users.getInterestIDs(this.profile.userID);
    if (interests.length < 3) {
      // console.log('not enough interests');
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisitedInterests) {
      const lastVisit = moment(this.profile.lastVisitedInterests, 'YYYY-MM-DD', true);
      // console.log(this.profile.lastVisitedInterests, PublicStats.getPublicStat(PublicStats.interestsUpdateTime));
      if (lastVisit.isBefore(moment(PublicStats.getPublicStat(PublicStats.interestsUpdateTime), 'YYYY-MM-DD-HH-mm-ss'))) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisitedInterests)) {
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
    const interests = Users.getInterestIDs(this.profile.userID);
    return ((interests.length === 0) ?
        <DetailsBox description='Note: You have not yet added any Interests to your profile.'/> :
        <DetailsBox description='Here are your current Interests:'>
          <ProfileInterestList profile={this.profile} size="medium" />
        </DetailsBox>
    );
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
      updateData.lastVisitedInterests = moment().format('YYYY-MM-DD');
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed to update lastVisitedInterests', error);
        }
      });
    };
    switch (state) {
      case CHECKSTATE.OK:
        return <div className='centeredBox'><p>Click this button to go to the Interests Explorer if you want to look for new Interests anyway.&nbsp;
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.INTERESTS}`}>Go To Interests Explorer</Button> </p></div>;
      case CHECKSTATE.REVIEW:
        return <div className='centeredBox'>
          <p>Clicking either button sets the timestamp for the last time this item was reviewed, so it will
          move into the OK state and won&apos;t move back into the Review state for another six months.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.INTERESTS}`}>Go To Interests Explorer</Button>&nbsp;&nbsp;
          <Button basic size='huge' color='teal' onClick={handleVerification}>My Interests are OK</Button>
        </div>;
      case CHECKSTATE.IMPROVE:
        return <div className='centeredBox'><p>Click &quot;Go To Interest Explorer&quot; to search for the Interests and add at least three to
          your Profile.</p>
          <Button size='huge' color='teal' as={Link} to={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.INTERESTS}`}>Go To Interests Explorer</Button>
        </div>;
      default:
        return <React.Fragment />;
    }
  }
}

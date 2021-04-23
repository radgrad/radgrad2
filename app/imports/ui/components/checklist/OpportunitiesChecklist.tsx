import moment from 'moment';
import React from 'react';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { updateLastVisited } from '../../../api/user/BaseProfileCollection.methods';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Ice, StudentProfile } from '../../../typings/radgrad';
import { DEGREEPLANNER, EXPLORER, ICE, URL_ROLES } from '../../layouts/utilities/route-constants';
import { PAGEIDS } from '../../utilities/PageIDs';
import { Checklist, CHECKSTATE } from './Checklist';
import ProfileFutureOpportunitiesList from '../shared/ProfileFutureOpportunitiesList';
import { DetailsBox } from './DetailsBox';
import { ActionsBox } from './ActionsBox';
import { ChecklistButtonAction, ChecklistButtonLink } from './ChecklistButtons';

export class OpportunitiesChecklist extends Checklist {
  private profile: StudentProfile;

  constructor(student: string) {
    super();
    this.name = 'Opportunities';
    this.profile = Users.getProfile(student);
    this.iconName = 'lightbulb';
    this.title[CHECKSTATE.OK] = 'The Opportunities in your Degree Plan appear to be OK';
    this.title[CHECKSTATE.REVIEW] = 'Please confirm that the Opportunities in your Degree Plan are correct';
    this.title[CHECKSTATE.IMPROVE] = 'Please add Opportunities to your degree plan so that you are on track to earn 100 Innovation and 100 Experience points';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = `Congrats! Your Degree Plan contains Opportunities that should eventually earn you at 
      least 100 Innovation and 100 Experience points, and you've reviewed your Degree Plan within the past six months to be 
      sure it is up to date.`;
    this.description[CHECKSTATE.REVIEW] = (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.OPPORTUNITY_BROWSER])) ?
      `It's been at least six months since you last reviewed your Degree Plan. So, we want to check that the Degree Planner 
      reflects your future Opportunity plans.` :

      'There are new Opportunities since you last reviewed your Career Goals. Perhaps you want to add them?';

    this.description[CHECKSTATE.IMPROVE] = `Specifying the Opportunities you plan to take in the future helps you in several ways.
      First, it helps you balance your curricular and extracurricular activities each semester. Second, it tells RadGrad what 
      interests you are developing skills in, which helps RadGrad to provide recommendations.`;
    this.updateState();
  }

  public updateState(): void {
    const username = this.profile.username;
    const projectedICE: Ice = StudentProfiles.getProjectedICE(username);
    const lastUpdate = PublicStats.getLastUpdateTimestamp(PublicStats.opportunitiesUpdateTime);
    if (projectedICE.i < 100 || projectedICE.e < 100) {
      this.state = CHECKSTATE.IMPROVE;
    } else if (this.profile.lastVisited[PAGEIDS.OPPORTUNITY_BROWSER]) {
      const lastVisit = moment(this.profile.lastVisited[PAGEIDS.OPPORTUNITY_BROWSER], 'YYYY-MM-DD', true);
      if (lastVisit.isBefore(lastUpdate)) {
        this.state = CHECKSTATE.REVIEW;
      } else if (this.isSixMonthsOld(this.profile.lastVisited[PAGEIDS.OPPORTUNITY_BROWSER])) {
        this.state = CHECKSTATE.REVIEW;
        // TODO check for new opportunity reviews for future opportunity instances.
      } else {
        this.state = CHECKSTATE.OK;
      }
    } else {
      // No lastVisitedOpportunities
      this.state = CHECKSTATE.REVIEW;
    }
  }

  public getDetails(): JSX.Element {
    const upcomingOpportunities = OpportunityInstances.findNonRetired({ studentID: this.profile.userID, verified: false });
    return ((upcomingOpportunities.length === 0) ?
        <DetailsBox description='Note: You have no upcoming opportunities. You probably want to add some!'/> :
        <DetailsBox description='Here are your upcoming Opportunities:'>
          <ProfileFutureOpportunitiesList profile={this.profile} size="medium"/>
        </DetailsBox>
    );
  }

  public getActions(): JSX.Element {
    const handleVerification = () => {
      updateLastVisited.callPromise({ pageID: PAGEIDS.OPPORTUNITY_BROWSER });
    };
    switch (this.state) {
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox description='Go to the Opportunity Explorer to find and add Opportunities to your profile. Go to the Degree Planner to add Opportunities from your profile to your degree plan:'>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.OPPORTUNITIES}`} label='Opportunity Explorer'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`} label='Degree Planner'/>
          </ActionsBox>
        );
      case CHECKSTATE.REVIEW:
        return (
          <ActionsBox description={`Go to the Opportunities Explorer to review available Opportunities and add them to your profile. Or, go to the Degree Planner to add Opportunities from your profile to your degree plan, or to remove Opportunities from your degree plan that you no longer plan to participate in. 
      
You can go to the ICE Page to learn more about how Opportunities earn you Innovation and/or Experience points. Finally, you can click "Opportunities are OK" to confirm that the Opportunities in your Degree Plan are OK.`} >
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${EXPLORER.OPPORTUNITIES}`} label='Opportunities Explorer'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${DEGREEPLANNER}`} label='Degree Planner'/>
            <ChecklistButtonLink url={`/${URL_ROLES.STUDENT}/${this.profile.username}/${ICE}`} label='ICE Page'/>
            <ChecklistButtonAction onClick={handleVerification} label='Opportunities are OK'/>
          </ActionsBox>
        );
      default:
        return <React.Fragment/>;
    }
  }
}

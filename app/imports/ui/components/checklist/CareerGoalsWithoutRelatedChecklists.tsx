import React from 'react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Users } from '../../../api/user/UserCollection';
import { CareerGoal, Profile } from '../../../typings/radgrad';
import { Checklist, CHECKSTATE } from './Checklist';
import ChecklistCareerGoalList from './ChecklistCareerGoalList';
import { DetailsBox } from './DetailsBox';

export class CareerGoalsWithoutRelatedChecklists extends Checklist {
  private profile: Profile;
  private careerGoalsWoRelated: CareerGoal[];

  constructor(username: string) {
    super();
    this.name = 'Career Goals without related courses or opportunities';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'briefcase';
    this.careerGoalsWoRelated = [];
    // Specify title for each state
    this.title[CHECKSTATE.OK] = 'All Career Goals have related courses or opportunities';
    this.title[CHECKSTATE.IMPROVE] = 'Please update the interests of the Career Goals';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Congrats!  All RadGrad Career Goals have related courses or opportunities.';
    this.description[CHECKSTATE.IMPROVE] = 'All RadGrad Career Goals should have related courses or opportunities. If they don&apos;t, then that career goal is not useful for the students.';
    this.updateState();
  }

  public updateState(): void {
    const careerGoals = CareerGoals.findNonRetired();
    careerGoals.forEach((goal) => {
      const relatedCourses = CareerGoals.findRelatedCourses(goal._id);
      const relatedOpportunities = CareerGoals.findRelatedOpportunities(goal._id);
      if (relatedCourses.length === 0 && relatedOpportunities.length === 0) { // TODO relatedInternships?
        this.careerGoalsWoRelated.push(goal);
      }
    });
    if (this.careerGoalsWoRelated.length > 0) {
      this.state = CHECKSTATE.IMPROVE;
    } else {
      this.state = CHECKSTATE.OK;
    }
  }

  public getDetails(): JSX.Element {
    return (
      <DetailsBox description='Career Goals without related courses or opportunities are:'>
        <ChecklistCareerGoalList careerGoals={this.careerGoalsWoRelated} size='mini' profile={this.profile} />
      </DetailsBox>
    );
  }
}

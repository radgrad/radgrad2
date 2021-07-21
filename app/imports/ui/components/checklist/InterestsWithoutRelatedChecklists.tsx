import React from 'react';
import { Interests } from '../../../api/interest/InterestCollection';
import { Users } from '../../../api/user/UserCollection';
import { Interest, Profile } from '../../../typings/radgrad';
import { Checklist, CHECKSTATE } from './Checklist';
import ChecklistInterestList from './ChecklistInterestList';
import { DetailsBox } from './DetailsBox';

export class InterestsWithoutRelatedChecklists extends Checklist {
  private profile: Profile;
  private interestsWoRelated: Interest[];

  constructor(username: string) {
    super();
    this.name = 'Interests without related courses or opportunities';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'heart';
    this.interestsWoRelated = [];
    // Specify title for each state
    this.title[CHECKSTATE.OK] = 'All Interests have related courses or opportunities';
    this.title[CHECKSTATE.IMPROVE] = 'Please add interests to courses or opportunities';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Congrats!  All RadGrad Interests have related courses or opportunities.';
    this.description[CHECKSTATE.IMPROVE] = 'All RadGrad Interests should have related courses or opportunities. If they don&apos;t, then that interest is not useful for the students.';
    this.updateState();
  }

  public updateState(): void {
    const interests = Interests.findNonRetired();
    interests.forEach((interest) => {
      const relatedCourses = Interests.findRelatedCourses(interest._id);
      const relatedOpportunities = Interests.findRelatedOpportunities(interest._id);
      if (relatedCourses.length === 0 && relatedOpportunities.length === 0) { // TODO relatedInternships?
        this.interestsWoRelated.push(interest);
      }
    });
    if (this.interestsWoRelated.length > 0) {
      this.state = CHECKSTATE.IMPROVE;
    } else {
      this.state = CHECKSTATE.OK;
    }
  }

  public getDetails(): JSX.Element {
    return (
      <DetailsBox description='Interests without related courses or opportunities are:'>
        <ChecklistInterestList interests={this.interestsWoRelated} size='mini' profile={this.profile} />
      </DetailsBox>
    );
  }
}

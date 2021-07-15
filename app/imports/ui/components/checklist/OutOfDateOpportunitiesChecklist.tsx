import moment from 'moment';
import React from 'react';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../api/user/UserCollection';
import { AdvisorOrFacultyProfile, Opportunity } from '../../../typings/radgrad';
import { MANAGE } from '../../layouts/utilities/route-constants';
import OpportunityList from '../shared/OpportunityList';
import { ActionsBox } from './ActionsBox';
import { DetailsBox } from './DetailsBox';
import { Checklist, CHECKSTATE } from './Checklist';
import { ChecklistButtonLink } from './ChecklistButtons';

export class OutOfDateOpportunitiesChecklist extends Checklist {
  private profile: AdvisorOrFacultyProfile;
  private outOfDate: Opportunity[];

  constructor(username: string) {
    super();
    this.name = 'Out-of-Date Opportunities';
    this.profile = Users.getProfile(username);
    this.role = this.profile.role;
    this.iconName = 'lightbulb outline';
    this.title[CHECKSTATE.OK] = 'Thanks! Your sponsored Opportunities are up to date';
    this.title[CHECKSTATE.REVIEW] = 'Please review your sponsored Opportunities';
    // Specify the description for each state.
    this.description[CHECKSTATE.OK] = 'Thanks for reviewing your visibility settings.';
    this.description[CHECKSTATE.REVIEW] = `RadGrad is designed to support well rounded students. 
    Part of that is offering extracurricular opportunities.`;
    this.outOfDate = [];
    this.updateState();
  }

  private checkDates(now, check): boolean {
    if (check.isBefore(now)) {
      return true;
    }
    return false;
  }

  public updateState(): void {
    const opportunities = Opportunities.findNonRetired({ sponsorID: this.profile.userID });
    const now = moment();
    opportunities.forEach((opportunity) => {
      let count = 1;
      while (count < 5) {
        const eventDate = opportunity[`eventDate${count}`];
        if (eventDate) {
          if (this.checkDates(now, moment(eventDate))) {
            this.outOfDate.push(opportunity);
            break;
          }
        }
        count++;
      }
    });
    this.outOfDate.length > 0 ? this.state = CHECKSTATE.REVIEW : this.state = CHECKSTATE.OK;
  }

  public getDetails(): JSX.Element {
    return (
      <DetailsBox description='Your out-of-date opportunities are:'>
        <OpportunityList opportunities={this.outOfDate} size='medium' keyStr='out-of-date' userID={this.profile.userID} />
      </DetailsBox>
    );
  }

  public getActions(): JSX.Element {
    switch (this.state) {
      case CHECKSTATE.REVIEW:
      case CHECKSTATE.OK:
      case CHECKSTATE.IMPROVE:
        return (
          <ActionsBox
            description='Use the Manage Opportunities page to review and adjust your sponsored opportunities:'>
            <ChecklistButtonLink url={`/${this.role.toLowerCase()}/${this.profile.username}/${MANAGE.OPPORTUNITIES}`}
              label='Manage Opportunities Page' />
          </ActionsBox>
        );
      default:
        return <React.Fragment />;
    }
  }

}

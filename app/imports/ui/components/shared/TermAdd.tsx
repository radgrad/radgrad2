import React from 'react';
import { Button, Icon, Menu, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { getUsername } from './RouterHelperFunctions';

interface ITermAddProps {
  item: any;
  type: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const isTypeCourse = (props: ITermAddProps) => props.type === EXPLORER_TYPE.COURSES;

const nextYears = (amount) => {
  const years = [];
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  let currentYear = currentTerm.year;
  for (let i = 0; i < amount; i += 1) {
    years.push(currentYear);
    currentYear += 1;
  }
  return years;
};

// This was originally in a ui/utilities/template-helpers.js (radgrad1) file called opportunitySemesters
// Should move it to one if one is made - Gian.
const opportunityTerms = (opportunityInstance) => {
  const academicTermIDs = opportunityInstance.termIDs;
  const upcomingAcademicTerms = _.filter(academicTermIDs, termID => AcademicTerms.isUpcomingTerm(termID));
  return _.map(upcomingAcademicTerms, termID => AcademicTerms.toString(termID));
};

const itemTerms = (props: ITermAddProps) => {
  let ret = [];
  if (isTypeCourse(props)) {
    // do nothing
  } else {
    ret = opportunityTerms(props.item);
  }
  return ret.slice(0, 8);
};

// FIXME: Needs to support quarter system.
const yearTerms = (year) => [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`];

const handleAddToPlan = (props: ITermAddProps) => (e) => {
  e.preventDefault();
  const term = e.target.text;
  const { item } = props;
  const itemSlug = Slugs.findDoc({ _id: item.slugID });
  const termSplit = term.split(' ');
  const termSlug = `${termSplit[0]}-${termSplit[1]}`;
  const username = getUsername(props.match);

  if (isTypeCourse(props)) {
    const definitionData = {
      academicTerm: termSlug,
      course: itemSlug,
      verified: false,
      note: item.number,
      grade: 'B',
      student: username,
    };
    defineMethod.call({ collectionName: 'CourseInstanceCollection', definitionData }, (error) => {
      if (error) {
        console.log('Error defining CourseInstance', error);
      }
    });
  } else {
    const definitionData = {
      academicTerm: termSlug,
      opportunity: itemSlug.name,
      verified: false,
      student: username,
    };
    defineMethod.call({ collectionName: 'OpportunityInstanceCollection', definitionData }, (error) => {
      if (error) {
        console.log('Error defining CourseInstance', error);
      }
    });
  }
};

const TermAdd = (props: ITermAddProps) => (
  <React.Fragment>
    {
      isTypeCourse(props) ? (
        <Popup
          className="transition"
          trigger={(
            <Button>
              <Icon name="plus" />
              <br />
              Add to Plan
            </Button>
          )}
          on="click"
        >
          <Popup.Content>
            <Menu size="mini" secondary vertical>
              {
                nextYears(4).map((year) => (
                  <React.Fragment key={year}>
                    <Popup
                      trigger={(
                        <Menu.Item as="a" className="chooseSemester">
                          {year}
                        </Menu.Item>
                      )}
                      on="click"
                    >
                      <Popup.Content>
                        <Menu size="mini" secondary vertical>
                          {
                            yearTerms(year).map((term) => (
                              <Menu.Item
                                as="a"
                                className={`${props.item}`}
                                key={term}
                                onClick={handleAddToPlan(props)}
                              >
                                {term}
                              </Menu.Item>
                            ))
                          }
                        </Menu>
                      </Popup.Content>
                    </Popup>
                  </React.Fragment>
                ))
              }
            </Menu>
          </Popup.Content>
        </Popup>
      )
        : (
          <Popup
            trigger={(
              <Button>
                <Icon name="plus" />
                <br />
                Add to Plan
              </Button>
          )}
            on="click"
          >
            <Popup.Content position="right center">
              <Menu size="mini" secondary vertical>
                {
                itemTerms(props).map((term) => (
                  <Menu.Item key={term} as="a" onClick={handleAddToPlan(props)}>
                    {term}
                  </Menu.Item>
                ))
              }
              </Menu>
            </Popup.Content>
          </Popup>
      )
}
  </React.Fragment>
);

export default withRouter(TermAdd);

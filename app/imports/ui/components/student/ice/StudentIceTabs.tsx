import React from 'react';
import { Segment, Grid, Header, Menu, Tab } from 'semantic-ui-react';
import { Ice, CourseInstance, ProfileInterest, OpportunityInstance } from '../../../../typings/radgrad';
import { STUDENT_VERIFICATION, URL_ROLES } from '../../../layouts/utilities/route-constants';
import { ButtonLink } from '../../shared/button/ButtonLink';
import MenuIceCircle from '../../shared/MenuIceCircle';
import StudentIceColumn from './StudentIceColumn';
import PageIceCircle from './PageIceCircle';

/* Technical Debt:
 *   * L33: Consolidate type so it is consistently referred to as "Innovation".
 *   * L35: Pass in earnedICS and projectedICE to avoid redundant computation.
 */

export interface StudentIceWidgetProps {
  username: string;
  earnedICE: Ice;
  projectedICE: Ice;
  profileInterests: ProfileInterest[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
}

const StudentIceTabs: React.FC<StudentIceWidgetProps> = ({
  username,
  earnedICE,
  projectedICE,
  profileInterests,
  courseInstances,
  opportunityInstances,
}) => {
  const styleInfo: React.CSSProperties = { textAlign: 'left', paddingTop: 10 };
  const panes = [
    {
      menuItem: <Menu.Item><MenuIceCircle earned={earnedICE.i} planned={projectedICE.i}
                                          type="innov" /> INNOVATION</Menu.Item>,
      render: () => (<Segment basic>
        <PageIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov" />
        <Header as="h3" textAlign="center" className="ice-innovation-color">
          INNOVATION
        </Header>
        <StudentIceColumn type="Innovation" profileInterests={profileInterests} courseInstances={courseInstances}
                          opportunityInstances={opportunityInstances} earnedICE={earnedICE}
                          projectedICE={projectedICE} />
        <div style={styleInfo}>
          You earn innovation points by completing opportunities that involve &#8220; innovation &#8220;, such
          as <strong>research projects, hackathons,</strong> or{' '}
          <strong>other activities producing new insights or technologies.</strong>
        </div>
      </Segment>),
    },
    {
      menuItem: <Menu.Item><MenuIceCircle earned={earnedICE.c} planned={projectedICE.c}
                                          type="comp" /> COMPETENCY</Menu.Item>,
      render: () => (<Segment basic>
        <PageIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp" />
        <Header as="h3" textAlign="center" className="ice-competency-color">
          COMPETENCY
        </Header>
        <StudentIceColumn type="Competency" profileInterests={profileInterests} courseInstances={courseInstances}
                          opportunityInstances={opportunityInstances} earnedICE={earnedICE}
                          projectedICE={projectedICE} />
        <div style={styleInfo}>
          You earn competency points by completing classes. The number of competency points depends upon your grade: you
          get <strong>10 points for any kind of A, 6 points for any kind of B, and no points for a C or below</strong>.
        </div>
      </Segment>),
    },
    {
      menuItem: <Menu.Item><MenuIceCircle earned={earnedICE.e} planned={projectedICE.e}
                                          type="exp" /> EXPERIENCE</Menu.Item>,
      render: () => (<Segment basic>
        <PageIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp" />
        <Header as="h3" textAlign="center" className="ice-experience-color">
          Experience
        </Header>
        <StudentIceColumn type="Experience" profileInterests={profileInterests} courseInstances={courseInstances}
                          opportunityInstances={opportunityInstances} earnedICE={earnedICE}
                          projectedICE={projectedICE} />
        <div style={styleInfo}>
          You earn experience points by completing opportunities that provide &#8220;real world experience&#8220;, such
          as <strong>internships</strong> or <strong>business plan competitions</strong>.
        </div>
      </Segment>),
    },
  ];
  return (
    <Segment padded id="studentIceWidget">
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3">The ICE Circle, explained</Header>
            <p>Your current ICE status is displayed graphically with a circle that appears in your navigation bar at the
              top of each RadGrad page, and also in annotated form on this page. The circle indicates several
              things:</p>
            <p>
              <strong> First, your current number of verified points for this ICE measure. </strong>This appears as a
              number in the center of the circle. It is also represented by the darkly colored portion of the circle. In
              this example,
              the student has 5 verified Innovation points, which appears as a number in the center of the circle and
              with 5% of the circle colored with a dark green line.
            </p>
            <p>
              <strong> Second, your current number of unverified points for this ICE measure. </strong>This appears as
              the lightly colored portion of the circle. In this example, the student has 90 unverified innovation
              points, which
              typically indicates the points she will receive for opportunities she has planned to participate at some
              future date in her degree program. So, 90% of the circle is colored with a light green line.
            </p>
            <p>
              <strong> Third, whether or not you have planned enough courses or opportunities to achieve 100 points for
                this ICE measure. </strong>If any portion of the circle is light grey, that indicates that you have not
              yet planned
              enough courses or opportunities. In this example, the student has only added enough opportunities to her
              degree plan to achieve 95 Innovation points. So, 5% of the circle is colored with a light grey line.
            </p>
            <Header as="h3">Verification</Header>
            <p>
              {' '}
              The RadGrad ICE score would not be meaningful if the points do not accurately represent the actual degree
              program experience. Therefore, all ICE points must be verified in order to count. Otherwise, someone could
              get
              competency points for courses they didn&#8216;t take, or experience points for internships they
              didn&#8216;t actually do.
            </p>
            <p>
              To verify your coursework, visit an ICS advisor after each academic term to ask them to upload your
              current STAR data to RadGrad. You will receive verified competency points for each course in your STAR
              data that appears in
              RadGrad.
            </p>
            <p>
              Opportunities are verified in many different ways. Visit the Verification Page <ButtonLink url={`/${URL_ROLES.STUDENT}/${username}/${STUDENT_VERIFICATION}`} label='Verification Page' size='mini' />
            </p>
            <p />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Tab panes={panes} />
    </Segment>
  );
};

export default StudentIceTabs;

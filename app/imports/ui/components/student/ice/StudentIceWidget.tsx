import React from 'react';
import { Segment, Grid, Header } from 'semantic-ui-react';
import { Ice, CourseInstance, FavoriteInterest, OpportunityInstance } from '../../../../typings/radgrad';
import StudentIceColumn from './StudentIceColumn';
import PageIceCircle from './PageIceCircle';


export interface StudentIceWidgetProps {
  earnedICE: Ice;
  projectedICE: Ice;
  favoriteInterests: FavoriteInterest[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
}

const StudentIceWidget: React.FC<StudentIceWidgetProps> = ({ earnedICE, projectedICE, favoriteInterests, courseInstances, opportunityInstances }) => {
  const innovationColumnStyle: React.CSSProperties = { paddingLeft: 0 };
  const experienceColumnStyle: React.CSSProperties = { paddingRight: 0 };

  const styleInfo: React.CSSProperties = { textAlign: 'left', paddingTop: 10 };
  return (
    <>
      <Segment padded id="studentIceWidget">
        <Header as="h4" dividing>YOUR ICE POINTS</Header>
        <Grid stackable columns="equal" celled="internally">
          <Grid.Row>
            <Grid.Column style={innovationColumnStyle}>
              <Segment basic>
                {/* TODO Consolidate type so it is consistent to be 'innovation' */}
                <PageIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov" />
                <Header as="h3" textAlign="center" className="ice-innovation-color">INNOVATION</Header>
                {/* TODO pass in earnedICE and projectedICE */}
                <StudentIceColumn
                  type="Innovation"
                  favoriteInterests={favoriteInterests}
                  courseInstances={courseInstances}
                  opportunityInstances={opportunityInstances}
                  earnedICE={earnedICE}
                  projectedICE={projectedICE}
                />
                <div style={styleInfo}>
                  You earn innovation points by completing opportunities that involve &#8220; innovation &#8220;, such
                  as <strong>research projects, hackathons,</strong> or <strong>other activities producing new insights
                    or technologies.</strong>
                </div>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment basic>
                <PageIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp" />
                <Header as="h3" textAlign="center" className="ice-competency-color">COMPETENCY</Header>
                <StudentIceColumn
                  type="Competency"
                  favoriteInterests={favoriteInterests}
                  courseInstances={courseInstances}
                  opportunityInstances={opportunityInstances}
                  earnedICE={earnedICE}
                  projectedICE={projectedICE}
                />
                <div style={styleInfo}>
                  You earn competency points by completing classes. The number of competency points depends upon your
                  grade: you get <strong>10 points for any kind of A, 6 points for any kind of B, and no points for a C
                    or below</strong>.
                </div>
              </Segment>
            </Grid.Column>

            <Grid.Column style={experienceColumnStyle}>
              <Segment basic>
                <PageIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp" />
                <Header as="h3" textAlign="center" className="ice-experience-color">Experience</Header>
                <StudentIceColumn
                  type="Experience"
                  favoriteInterests={favoriteInterests}
                  courseInstances={courseInstances}
                  opportunityInstances={opportunityInstances}
                  earnedICE={earnedICE}
                  projectedICE={projectedICE}
                />
                <div style={styleInfo}>
                  You earn experience points by completing opportunities that provide &#8220;real world
                  experience&#8220;, such as <strong>internships</strong> or <strong>business plan competitions</strong>.
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header as="h3">The ICE Circle, explained</Header>
            <p>
              Your current ICE status is displayed graphically with a circle that appears in your navigation bar at the
              top of each RadGrad page, and also in annotated form on this page. The circle indicates several things:
            </p>
            <p>
              <strong> First, your current number of verified points for this ICE measure. </strong>This appears as a
              number in the center of the circle. It is also represented by the darkly colored portion of the circle. In
              this example, the student has 5 verified Innovation points, which appears as a number in the center of the
              circle and with 5% of the circle colored with a dark green line.
            </p>
            <p>
              <strong> Second, your current number of unverified points for this ICE measure. </strong>This appears as
              the lightly colored portion of the circle. In this example, the student has 90 unverified innovation
              points, which typically indicates the points she will receive for opportunities she has planned to
              participate at some future date in her degree program. So, 90% of the circle is colored with a light green
              line.
            </p>
            <p>
              <strong> Third, whether or not you have planned enough courses or opportunities to achieve 100 points for
                this ICE measure. </strong>If any portion of the circle is light grey, that indicates that you have not
              yet planned enough courses or opportunities. In this example, the student has only added enough
              opportunities to her degree plan to achieve 95 Innovation points. So, 5% of the circle is colored with a
              light grey line.
            </p>
            <Header as="h3">Verification</Header>
            <p> The RadGrad ICE score would not be meaningful if the points do not accurately represent the actual
              degree program experience. Therefore, all ICE points must be verified in order to count. Otherwise,
              someone could get competency points for courses they didn&#8216;t take, or experience points for
              internships they didn&#8216;t actually do.
            </p><p>
              To verify your coursework, visit an ICS advisor after each academic term to ask them to upload your current
              STAR data to RadGrad. You will receive verified competency points for each course in your STAR data that
              appears in RadGrad.
            </p><p>
              Opportunities are verified in many different ways. Each opportunity description lists the mechanism for
              verification. For example, for some opportunities it may be as simple as taking a selfie with the organizer
              and then showing that picture to an ICS advisor or faculty member.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default StudentIceWidget;

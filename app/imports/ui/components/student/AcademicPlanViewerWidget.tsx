import React from 'react';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { IAcademicPlan } from '../../../typings/radgrad';
import AcademicPlanYearView from '../shared/AcademicPlanYearView';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { passedCourse } from '../../../api/degree-plan/AcademicPlanUtilities';
import { Users } from '../../../api/user/UserCollection';

interface IAcademicPlanViewerWidgetProps {
  academicPlan: IAcademicPlan;
  username: string;
  takenSlugs: string[];
}

const AcademicPlanViewerWidget = (props: IAcademicPlanViewerWidgetProps) => {
  const fiveYear = (props.academicPlan.coursesPerAcademicTerm.length % 5) === 0;
  let yearNumber = 0;
  const littlePadding = {
    paddingLeft: 2,
    paddingRight: 2,
  };
  return (
    <Grid>
      <Grid.Row columns={fiveYear ? 5 : 4}>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView
            yearNumber={yearNumber++}
            academicPlan={props.academicPlan}
            username={props.username}
            takenSlugs={props.takenSlugs}
          />
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView
            yearNumber={yearNumber++}
            academicPlan={props.academicPlan}
            username={props.username}
            takenSlugs={props.takenSlugs}
          />
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView
            yearNumber={yearNumber++}
            academicPlan={props.academicPlan}
            username={props.username}
            takenSlugs={props.takenSlugs}
          />
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView
            yearNumber={yearNumber++}
            academicPlan={props.academicPlan}
            username={props.username}
            takenSlugs={props.takenSlugs}
          />
        </Grid.Column>
        {fiveYear ?
          (
            <Grid.Column style={littlePadding}>
              <AcademicPlanYearView
                yearNumber={yearNumber++}
                academicPlan={props.academicPlan}
                username={props.username}
                takenSlugs={props.takenSlugs}
              />
            </Grid.Column>
          )
          : ''}
      </Grid.Row>
    </Grid>
  );
};

function takenSlugs(courseInstances) {
  const passedCourseInstances = _.filter(courseInstances, (ci) => passedCourse(ci));
  return _.map(passedCourseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    return Slugs.getNameFromID(doc.slugID);
  });
}

const AcademicPlanViewerWidgetContainer = withTracker((props) => {
  const profile = Users.findProfileFromUsername(props.username);
  const courseInstances = CourseInstances.findNonRetired({ studentID: profile.userID });
  return {
    takenSlugs: takenSlugs(courseInstances),
    ...props,
  };
})(AcademicPlanViewerWidget);
export default AcademicPlanViewerWidgetContainer;

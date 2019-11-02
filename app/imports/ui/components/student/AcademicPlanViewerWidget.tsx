import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IAcademicPlan } from '../../../typings/radgrad'; // eslint-disable-line
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
          <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.academicPlan}
                                username={props.username} takenSlugs={props.takenSlugs}/>
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.academicPlan}
                                username={props.username} takenSlugs={props.takenSlugs}/>
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.academicPlan}
                                username={props.username} takenSlugs={props.takenSlugs}/>
        </Grid.Column>
        <Grid.Column style={littlePadding}>
          <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.academicPlan}
                                username={props.username} takenSlugs={props.takenSlugs}/>
        </Grid.Column>
        {fiveYear ? (
          <Grid.Column style={littlePadding}>
            <AcademicPlanYearView yearNumber={yearNumber++} academicPlan={props.academicPlan}
                                  username={props.username} takenSlugs={props.takenSlugs}/>
          </Grid.Column>
        ) : ''}
      </Grid.Row>
    </Grid>
  );
};

function takenSlugs(courseInstances) {
  const passedCourseInstances = _.filter(courseInstances, (ci) => passedCourse(ci));
  // console.log(courseInstances, passedCourseInstances);
  return _.map(passedCourseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    return Slugs.getNameFromID(doc.slugID);
  });
}

const AcademicPlanViewerWidgetContainer = withTracker((props) => {
  // console.log('AcademicPlanViewerWidget props = %o', props);
  const profile = Users.findProfileFromUsername(props.username);
  // console.log(profile);
  const courseInstances = CourseInstances.find({ studentID: profile.userID }).fetch();
  return {
    takenSlugs: takenSlugs(courseInstances),
    ...props,
  };
})(AcademicPlanViewerWidget);
export default AcademicPlanViewerWidgetContainer;

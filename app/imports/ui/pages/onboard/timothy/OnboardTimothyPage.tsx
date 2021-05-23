import { Meteor } from 'meteor/meteor';
import React from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import { Label } from 'semantic-ui-react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import PageLayout from '../../PageLayout';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { itemToSlugName } from '../../../components/shared/utilities/data-model';
import CareerGoalLabel from '../../../components/shared/label/CareerGoalLabel';
import InterestLabel from '../../../components/shared/label/InterestLabel';
import CourseLabel from '../../../components/shared/label/CourseLabel';
import OpportunityLabel from '../../../components/shared/label/OpportunityLabel';
import UserLabel from '../../../components/shared/profile/UserLabel';


const headerPaneTitle = "Timothy's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

interface OnBoardVar {
  user: string;
  urlName: string;
  TotalCareerGoals: [];
  TotalInterests: [],
  TotalCourses: [],
  TotalOpportunities: [],
  TotalStudents: [],
  randomName: string;
  randomDescription: string;
}

const OnboardTimothyPage: React.FC<OnBoardVar> = ({ user, urlName, TotalCareerGoals, TotalInterests, TotalCourses, TotalOpportunities, TotalStudents, randomName, randomDescription }) => {
  const style = {
    marginBottom: 30,
  };

  const CareerGoalList = () => {
    const profile = Users.getProfile(user);
    return (
            <Label.Group size="medium">
                {TotalCareerGoals.map((careerGoal) => {
                  const slug = itemToSlugName(careerGoal);
                  return (
                        <CareerGoalLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
                  );
                })}
            </Label.Group>
    );
  };

  const InterestList = () => {
    const profile = Users.getProfile(user);
    return (
            <Label.Group size="medium">
                {TotalInterests.map((interest) => {
                  const slug = itemToSlugName(interest);
                  return (
                        <InterestLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
                  );
                })}
            </Label.Group>
    );
  };

  const CourseList = () => {
    const profile = Users.getProfile(user);
    return (
            <Label.Group size="medium">
                {TotalCourses.map((course) => {
                  const slug = itemToSlugName(course);
                  return (
                        <CourseLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
                  );
                })}
            </Label.Group>
    );
  };

  const OpportunityList = () => {
    const profile = Users.getProfile(user);
    return (
            <Label.Group size="medium">
                {TotalOpportunities.map((opportunity) => {
                  const slug = itemToSlugName(opportunity);
                  return (
                        <OpportunityLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
                  );
                })}
            </Label.Group>
    );
  };

  const StudentList = () => (
          <Label.Group size="medium">
              {TotalStudents.map((student) => (
                      <UserLabel size="small" username={student}  />
              ))}
          </Label.Group>
  );

  const profileItems = TotalCareerGoals.length;
  return (
        <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
                    headerPaneImage={headerPaneImage}>
            <div style={style}>
                <RadGradSegment header={<RadGradHeader title='TASK 4: LABELS' icon='tags'/>}>
                    <h3 className='ui header' style={{ marginBottom: '1em' }}> Career Goals </h3>
                    <CareerGoalList/>
                    <h3 className='ui header' style={{ marginBottom: '1em' }}> Courses </h3>
                    <CourseList/>
                    <h3 className='ui header' style={{ marginBottom: '1em' }}> Interests </h3>
                    <InterestList/>
                    <h3 className='ui header' style={{ marginBottom: '1em' }}> Opportunities </h3>
                    <OpportunityList/>
                    <h3 className='ui header' style={{ marginBottom: '1em' }}> Students </h3>
                    <StudentList/>
                </RadGradSegment>
            </div>
            <div style={style}>
                <RadGradSegment header={<RadGradHeader title='TASK 3: A RANDOM CAREER GOAL (REFRESH FOR A NEW ONE)' icon='database'/>}>
                    <div className='ui vertical segment'>
                        <h3 className='ui header' style={{ marginBottom: '1em' }}> {randomName} </h3>
                        <Markdown escapeHtml source={randomDescription} />
                    </div>
                    <div className='ui vertical segment'>
                        Note: The total number of career goals is: {profileItems}
                    </div>
                </RadGradSegment>
            </div>
            <div className='ui two column grid'>
                <div className='column'>
                    <RadGradSegment header={<RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas'/>}>
                        Hello World
                    </RadGradSegment>
                </div>
                <div className='column'>
                    <RadGradSegment header={<RadGradHeader title='TASK 2: WHO IS THE USER?' icon='user graduate'/>}>
                        <p style={style}>The current logged in user is: {user}</p>
                        <p style={style}>The username appearing in the URL is: {urlName}</p>
                        <p style={style}>In RadGrad, these are not necessarily the same!</p>
                    </RadGradSegment>
                </div>
            </div>
        </PageLayout>
  );
};

export default withTracker(() => {
  const user = Meteor.user() ? Meteor.user().username : '';
  const { username } = useParams();
  const TotalCareerGoals = CareerGoals.findNonRetired();
  const TotalInterests = Interests.findNonRetired();
  const TotalCourses = Courses.findNonRetired();
  const TotalOpportunities = Opportunities.findNonRetired();
  const TotalStudents = _.map(StudentProfiles.find({}).fetch(), 'username');
  const random = _.sample(TotalCareerGoals);
  const randomName  = random.name;
  const randomDescription = random.description;
  const urlName = Users.getProfile(username).username;
  return {
    user,
    urlName,
    TotalCareerGoals,
    TotalInterests,
    TotalCourses,
    TotalOpportunities,
    TotalStudents,
    randomName,
    randomDescription,
  };
})(OnboardTimothyPage);

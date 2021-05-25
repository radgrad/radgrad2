import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import { Header, Label } from 'semantic-ui-react';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, SubmitField, SelectField } from 'uniforms-semantic';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { StudentProfiles } from '../../../../api/user/StudentProfileCollection';
import Task6EditDescription from './Task6EditDescription';
import PageLayout from '../../PageLayout';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import { docToName, itemToSlugName } from '../../../components/shared/utilities/data-model';
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
  totalCareerGoals: [];
  totalInterests: [],
  totalCourses: [],
  totalOpportunities: [],
  totalStudents: [],
  randomName: string;
  randomDescription: string;
}

const OnboardTimothyPage: React.FC<OnBoardVar> = ({ user, urlName, totalCareerGoals, totalInterests, totalCourses, totalOpportunities, totalStudents, randomName, randomDescription }) => {

  const style = {
    marginBottom: 30,
  };

  // Task 6
  const interestNameList = totalInterests.map(docToName);
  const schema = new SimpleSchema({
    interest: {
      type: String,
      allowedValues: interestNameList,
    },
  });
  const [selectInterest, setSelectInterest] = useState(() =>'');
  const formSchema = new SimpleSchema2Bridge(schema);

  const Submit = (data) => {
    const { interest } = data;
    setSelectInterest(interest);
  };

  const DisplayInterest = () => {
    const interestName = selectInterest;
    const interestDesc = _.map(Interests.find({ name: interestName }).fetch(), 'description')[0];
    return (
    <div>
      <Task6EditDescription interestDesc={interestDesc} interestName={interestName}/>
    </div>
    );
  };

  // Task 5
  const entitiesList = (entity) => {
    const profile = Users.getProfile(user);
    switch (entity) {
      case totalCareerGoals:
        return (
          <Label.Group size="medium">
            {totalCareerGoals.map((careerGoal) => {
              const slug = itemToSlugName(careerGoal);
              return (
              <CareerGoalLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
              );
            })}
          </Label.Group>
        );
      case totalInterests:
        return (
          <Label.Group size="medium">
            {totalInterests.map((interest) => {
              const slug = itemToSlugName(interest);
              return (
              <InterestLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
              );
            })}
          </Label.Group>
        );
      case totalCourses:
        return (
          <Label.Group size="medium">
            {totalCourses.map((course) => {
              const slug = itemToSlugName(course);
              return (
              <CourseLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
              );
            })}
          </Label.Group>
        );
      case totalOpportunities:
        return (
          <Label.Group size="medium">
            {totalOpportunities.map((opportunity) => {
              const slug = itemToSlugName(opportunity);
              return (
              <OpportunityLabel key={slug} size="medium" slug={slug} userID={profile.userID} />
              );
            })}
          </Label.Group>
        );
      case totalStudents:
        return (
          <Label.Group size="medium">
            {totalStudents.map((student) => (
            <UserLabel size="small" username={student}  />
            ))}
          </Label.Group>
        );
      default:
        return <React.Fragment />;
    }
  };

  const CareerGoalList = () => entitiesList(totalCareerGoals);

  const InterestList = () => entitiesList(totalInterests);

  const CourseList = () => entitiesList(totalCourses);

  const OpportunityList = () => entitiesList(totalOpportunities);

  const StudentList = () => entitiesList(totalStudents);

  const CareerGoalLength = totalCareerGoals.length;

  return (
        <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
                    headerPaneImage={headerPaneImage}>
          <div style={style}>
            <RadGradSegment header={<RadGradHeader title='TASK 6: EDIT THE DESCRIPTION' icon='file alternate outline'/>}>
              <Header dividing>Add Career Goal</Header>
              {/* eslint-disable-next-line no-return-assign */}
              <AutoForm schema={formSchema} onSubmit={data => Submit(data)}>
                <SelectField name="interest" placeholder="(Select interest)"/>
                <SubmitField className="mini basic green" value='Display Description'/>
              </AutoForm>
              <DisplayInterest/>
            </RadGradSegment>
          </div>
            <div style={style}>
                <RadGradSegment header={<RadGradHeader title='TASK 4: LABELS' icon='tags'/>}>
                    <h3 className='ui header'> Career Goals </h3>
                    <CareerGoalList/>
                    <h3 className='ui header'> Courses </h3>
                    <CourseList/>
                    <h3 className='ui header'> Interests </h3>
                    <InterestList/>
                    <h3 className='ui header'> Opportunities </h3>
                    <OpportunityList/>
                    <h3 className='ui header'> Students </h3>
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
                        Note: The total number of career goals is: {CareerGoalLength}
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
  const totalCareerGoals = CareerGoals.findNonRetired();
  const totalInterests = Interests.findNonRetired();
  const totalCourses = Courses.findNonRetired();
  const totalOpportunities = Opportunities.findNonRetired();
  const totalStudents = _.map(StudentProfiles.find({}).fetch(), 'username');
  const random = _.sample(totalCareerGoals);
  const randomName  = random.name;
  const randomDescription = random.description;
  const urlName = Users.getProfile(username).username;
  return {
    user,
    urlName,
    totalCareerGoals,
    totalInterests,
    totalCourses,
    totalOpportunities,
    totalStudents,
    randomName,
    randomDescription,
  };
})(OnboardTimothyPage);

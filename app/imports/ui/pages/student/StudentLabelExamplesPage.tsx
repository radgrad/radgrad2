import moment from 'moment';
import React from 'react';
import {Header} from 'semantic-ui-react';
import {useParams} from 'react-router-dom';
import {withTracker} from 'meteor/react-meteor-data';
import {updateMethod} from '../../../api/base/BaseCollection.methods';
import {ROLE} from '../../../api/role/Role';
import {StudentProfiles} from '../../../api/user/StudentProfileCollection';
import {Users} from '../../../api/user/UserCollection';
import {StudentProfile, StudentProfileUpdate} from '../../../typings/radgrad';
import PageLayout from '../PageLayout';
import ProfileLabel from '../../components/shared/profile/ProfileLabel';
import ProfileCard from '../../components/shared/profile/ProfileCard';
import StudentProfileModalLabel from '../../components/shared/profile/StudentProfileModalLabel';
import StudentProfileCard from '../../components/shared/profile/StudentProfileCard';
import CareerGoalLabel from '../../components/shared/label/CareerGoalLabel';
import InterestLabel from '../../components/shared/label/InterestLabel';
import CourseLabel from '../../components/shared/label/CourseLabel';
import OpportunityLabel from '../../components/shared/label/OpportunityLabel';
import UserLabel from "../../components/shared/profile/UserLabel";

const headerPaneTitle = 'Control what others see about you';
const headerPaneBody = `
This page allows you to control what aspects of your profile are visible to other RadGrad community members.

Providing access to information about your profile allows RadGrad to help you find similarly minded community members. You can opt-in or opt-out at any time.
`;
const headerPaneImage = 'header-privacy.png';

interface StudentPrivacyPageProps {
  profile: StudentProfile;
}

const StudentPrivacyPage: React.FC<StudentPrivacyPageProps> = ({profile}) => {
  const name = 'Philip Johnson';
  const email = 'johnson@hawaii.edu';
  const image = 'https://philipmjohnson.github.io/images/philip2.jpeg';
  const website = 'https://philipmjohnson.org';
  const interests = ['Algorithms', 'Android', 'Angular'];
  const careerGoals = ['Data Scientist', 'Database Administrator', 'DevOps Engineer', 'Full Stack Developer', 'Game Developer'];
  const courses = ['ICS 111', 'ICS 211', 'ICS 241', 'ICS 311', 'ICS 314'];
  const opportunities = ['ACM ICPC', 'ACM Manoa', 'ALLNET', 'Asteroid Detection', 'HACC'];
  return (
    <PageLayout id="student-privacy-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>

      <hr style={{marginTop: '200px'}} />
      <Header>Profile Card Examples</Header>

      <div style={{paddingBottom: '20px'}}>
        <UserLabel username={profile.username}/>
        <UserLabel username='johnson@hawaii.edu'/>
      </div>

      <div style={{paddingBottom: '20px'}}>
        <StudentProfileModalLabel studentProfile={profile}/>
        <StudentProfileCard studentProfile={profile}/>
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileCard name={name} email={email} image={image} level={5} website={website} interests={interests} careerGoals={careerGoals} courses={courses} opportunities={opportunities} ice={{i: 56, c: 51, e: 123}}/>
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileCard name={name} email={email}  website={website} interests={interests} careerGoals={careerGoals} />
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileCard name={name} email={email} image={image} level={5} ice={{i: 56, c: 51, e: 123}}/>
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileCard name={name} email={email} level={2} ice={{i: 56, c: 51, e: 123}}/>
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileCard name={name} email={email} image={image} level={4}/>
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileCard name={name} email={email} image={image}/>
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileCard name={name} email={email}/>
      </div>



      <Header>Profile Label Examples</Header>
      <div style={{paddingBottom: '20px'}}>
        <ProfileLabel image={image} name={name} level={1}/>
        <ProfileLabel image={image} name={name} level={2}/>
        <ProfileLabel image={image} name={name} level={3}/>
        <ProfileLabel image={image} name={name} level={4}/>
        <ProfileLabel image={image} name={name} level={5}/>
        <ProfileLabel image={image} name={name} level={6}/>
      </div>
      <div style={{paddingBottom: '20px'}}>
        <ProfileLabel  name={name} level={1}/>
        <ProfileLabel  name={name} level={2}/>
        <ProfileLabel  name={name} level={3}/>
        <ProfileLabel  name={name} level={4}/>
        <ProfileLabel  name={name} level={5}/>
        <ProfileLabel  name={name} level={6}/>
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileLabel image={image} name={name} />
      </div>

      <div style={{paddingBottom: '20px'}}>
        <ProfileLabel name={name} />
      </div>

      <Header>Entity Label Examples (default size and style)</Header>
      <div style={{paddingBottom: '20px'}}>
        <CareerGoalLabel slug='software-developer' userID={profile.userID}/>
        <CareerGoalLabel slug='robotics-engineer' userID={profile.userID}/>
      </div>
      <div style={{paddingBottom: '20px'}}>
        <InterestLabel slug='algorithms' userID={profile.userID}/>
        <InterestLabel slug='angular' userID={profile.userID}/>
      </div>
      <div style={{paddingBottom: '20px'}}>
        <CourseLabel slug='ics_101' userID={profile.userID}/>
        <CourseLabel slug='ics_102' userID={profile.userID}/>
      </div>
      <div style={{paddingBottom: '20px'}}>
        <OpportunityLabel slug='hawaii-hacker-hours' userID={profile.userID}/>
        <OpportunityLabel slug='acm-manoa' userID={profile.userID}/>
      </div>
      <Header>Use the size parameter to adjust size</Header>
      <div style={{paddingBottom: '20px'}}>
        <div><CareerGoalLabel slug='robotics-engineer' userID={profile.userID} size='small' /></div>
      </div>
      <Header>Use the style parameter to adjust width (or anything else)</Header>
      <div style={{paddingBottom: '20px'}}>
        <div><CareerGoalLabel slug='robotics-engineer' userID={profile.userID} style={{width: '50%'}} /></div>
      </div>




    </PageLayout>
  );
};


export default withTracker(() => {
  const {username} = useParams();
  const profile = Users.getProfile(username) as StudentProfile;
  if (profile.role === ROLE.STUDENT) {
    const lastVisited = moment().format('YYYY-MM-DD');
    if (lastVisited !== profile.lastVisitedPrivacy) {
      const collectionName = StudentProfiles.getCollectionName();
      const updateData: StudentProfileUpdate = {};
      updateData.id = profile._id;
      updateData.lastVisitedPrivacy = lastVisited;
      updateMethod.call({collectionName, updateData}, (error, result) => {
        if (error) {
          console.error('Error updating StudentProfile', collectionName, updateData, error);
        }
      });
    }
  }
  return {
    profile,
  };
})(StudentPrivacyPage);

import React from 'react';
import { Tab } from 'semantic-ui-react';
import { StudentProfile } from '../../../../typings/radgrad';
import LevelInfoTab from './LevelInfoTab';
import RadGradSegment from '../../shared/RadGradSegment';
import RadGradHeader from '../../shared/RadGradHeader';

export interface AllLevelsInfoProps {
  profile: StudentProfile;
  allProfiles: StudentProfile[];
}

const getStudentsAtLevel = (currentProfile, level: number, profiles = []): StudentProfile[] => {
  const students = [];
  profiles.forEach((profile) => {
    if (profile.level === level) {
      if (profile.userID !== currentProfile.userID) {
        students.push(profile);
      }
    }
  });
  return students;
};

const header = <RadGradHeader title='ABOUT THE LEVELS' />;

const AllLevelsInfo: React.FC<AllLevelsInfoProps> = ({ profile, allProfiles }) => {
  const level1Students = getStudentsAtLevel(profile, 1, allProfiles);
  const level2Students = getStudentsAtLevel(profile, 2, allProfiles);
  const level3Students = getStudentsAtLevel(profile, 3, allProfiles);
  const level4Students = getStudentsAtLevel(profile, 4, allProfiles);
  const level5Students = getStudentsAtLevel(profile, 5, allProfiles);
  const level6Students = getStudentsAtLevel(profile, 6, allProfiles);
  const panes = [
    { menuItem: 'Level 1', render: () => <LevelInfoTab level={1} students={level1Students} /> },
    { menuItem: 'Level 2', render: () => <LevelInfoTab level={2} students={level2Students} /> },
    { menuItem: 'Level 3', render: () => <LevelInfoTab level={3} students={level3Students} /> },
    { menuItem: 'Level 4', render: () => <LevelInfoTab level={4} students={level4Students} /> },
    { menuItem: 'Level 5', render: () => <LevelInfoTab level={5} students={level5Students} /> },
    { menuItem: 'Level 6', render: () => <LevelInfoTab level={6} students={level6Students} /> },
  ];
  return (
    <RadGradSegment header={header}>
      <Tab panes={panes} />
    </RadGradSegment>
  );
};

export default AllLevelsInfo;

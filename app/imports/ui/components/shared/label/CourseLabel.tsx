import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import * as Router from '../utilities/router';
import { EntityLabel, EntityLabelPublicProps } from './EntityLabel';
import { Courses } from '../../../../api/course/CourseCollection';
import { ProfileCourses } from '../../../../api/user/profile-entries/ProfileCourseCollection';

/**
 * Returns a React Component representing a Course label.
 * @param slug Required slug. Error if not found.
 * @param userID Optional userID. If provided, then Label will colored if present in the user's profile.
 * @param size Optional size. Defaults to 'Large'.
 */
const CourseLabel: React.FC<EntityLabelPublicProps> = ({ slug, userID, size, style, rightside }) => {
  let inProfile = false;
  const match = useRouteMatch();
  let route = `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${slug}`;
  const name = Courses.findDocBySlug(slug).num; // will throw an error if slug is undefined.
  if (userID) {
    route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${slug}`);
    // TODO does this need to be reactive? If so then it needs to be a property of the label and calculated elsewhere.
    // Calculate inProfile.
    const profileEntityIDs = ProfileCourses.findNonRetired({ userID });
    const id = Courses.findIdBySlug(slug);
    // console.log(profileEntityIDs, id);
    inProfile = (profileEntityIDs.map(doc => doc.courseID)).includes(id);
  }
  return (
    <EntityLabel slug={slug} inProfile={inProfile} icon='book' name={name} route={route} size={size} style={style} rightside={rightside}/>
  );
};

export default CourseLabel;

import React from 'react';
import _ from 'lodash';
import {useRouteMatch} from 'react-router-dom';
import {EXPLORER_TYPE} from '../../../layouts/utilities/route-constants';
import * as Router from '../utilities/router';
import {EntityLabel, EntityLabelPublicProps} from './EntityLabel';
import {Courses} from '../../../../api/course/CourseCollection';
import {ProfileCourses} from '../../../../api/user/profile-entries/ProfileCourseCollection';

/**
 * Returns a React Component representing a Course label.
 * @param slug Required slug. Error if not found.
 * @param userID Optional userID. If provided, then Label will colored if present in the user's profile.
 * @param size Optional size. Defaults to 'Large'.
 */
const CourseLabel: React.FC<EntityLabelPublicProps> = ({slug, userID, size, style}) => {
  let inProfile = false;
  const match = useRouteMatch();
  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${slug}`);
  const name = Courses.findDocBySlug(slug).num; // will throw an error if slug is undefined.
  if (userID) {
    // Calculate inProfile and route.
    const profileEntityIDs = ProfileCourses.findNonRetired({userID: userID});
    const id = Courses.findIdBySlug(slug);
    console.log(profileEntityIDs, id);
    inProfile = _.includes(profileEntityIDs.map(doc => doc.courseID), id);
  }
  return (
    <EntityLabel slug={slug} inProfile={inProfile} icon='book' name={name} route={route} size={size} style={style}/>
  );
};

export default CourseLabel;

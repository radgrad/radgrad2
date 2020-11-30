import React from 'react';
import _ from 'lodash';
import { useParams, useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon, Popup, Image } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { IPlanCard } from '../../../../../typings/radgrad';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import AcademicPlanStaticViewer from '../AcademicPlanStaticViewer';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import * as Router from '../../utilities/router';
import {
  docToName,
  docToShortDescription,
  itemToSlugName, profileIDToFullname,
  profileIDToPicture,
  studentsParticipating,
} from '../../utilities/data-model';
import { interestedStudents } from '../utilities/explorer';
import { Users } from '../../../../../api/user/UserCollection';
import { CourseInstances } from '../../../../../api/course/CourseInstanceCollection';
import { passedCourse } from '../../../../../api/degree-plan/AcademicPlanUtilities';
import { Slugs } from '../../../../../api/slug/SlugCollection';

const AcademicPlanCard: React.FC<IPlanCard> = ({ type, item }) => {
  const match = useRouteMatch();
  const { username } = useParams();
  const profile = Users.findProfileFromUsername(username);
  const courseInstances = CourseInstances.findNonRetired({ studentID: profile.userID });
  const passedCourseInstances = _.filter(courseInstances, (ci) => passedCourse(ci));
  const takenSlugs = _.map(passedCourseInstances, (ci) => {
    const doc = CourseInstances.getCourseDoc(ci._id);
    return Slugs.getNameFromID(doc.slugID);
  });
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const numberStudents = studentsParticipating(item);
  const itemSlug = itemToSlugName(item);
  const interested = interestedStudents(item, type);
  const route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${itemSlug}`);
  // console.log(interested);
  // TODO Why do Advisors see the interested students, but faculty don't?
  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
      </Card.Content>

      <Card.Content>
        <Markdown
          escapeHtml
          source={`${itemShortDescription}...`}
          renderers={{ link: (p) => Router.renderLink(p, match) }}
        />
        <AcademicPlanStaticViewer plan={item} takenSlugs={takenSlugs} />
      </Card.Content>

      <Card.Content>
        <span>
          STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents} />
        </span>
        <Image.Group size="mini">
          {interested.map((student) => (
            <Popup
              key={student._id}
              trigger={<Image src={profileIDToPicture(student.userID)} circular bordered />}
              content={profileIDToFullname(student.userID)}
            />
          ))}
        </Image.Group>
      </Card.Content>

      <Link className="ui button" to={route}>
        <Icon name="chevron circle right" />
        <br />
        View More
      </Link>
    </Card>
  );
};

export default AcademicPlanCard;

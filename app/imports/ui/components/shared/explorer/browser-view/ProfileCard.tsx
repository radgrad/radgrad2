import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Card, Icon, Image, Popup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import * as Router from '../../utilities/router';
import WidgetHeaderNumber from '../WidgetHeaderNumber';
import {
  docToName,
  docToShortDescription, itemToSlugName, profileIDToFullname,
  profileIDToPicture,
  studentsParticipating,
} from '../../utilities/data-model';
import { interestedStudents } from '../utilities/explorer';
import { buildExplorerSlugRoute } from '../../utilities/router';

interface IProfileCardProps {
  item: {
    _id: string;
    name: string;
  };
  type: string;
}

// TODO Why is this called ProfileCard?

const ProfileCard = (props: IProfileCardProps) => {
  const { item, type } = props;
  const match = useRouteMatch();
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const numberStudents = studentsParticipating(item);
  const interested = interestedStudents(item, type);
  const slugName = itemToSlugName(item);
  // console.log(interested);
  return (
    <Card className="radgrad-interest-card">
      <Card.Content>
        <Card.Header>{itemName}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Markdown
          escapeHtml
          source={`${itemShortDescription}...`}
          renderers={{ link: (localProps) => Router.renderLink(localProps, match) }}
        />
      </Card.Content>
      <Card.Content>
        <span>
          STUDENTS PARTICIPATING <WidgetHeaderNumber inputValue={numberStudents} />
        </span>
        <Image.Group size="mini">
          {interested.map((student) => (
            <Popup
              key={`${item._id}${student._id}`}
              trigger={<Image src={profileIDToPicture(student.userID)} circular bordered />}
              content={profileIDToFullname(student.userID)}
            />
          ))}
        </Image.Group>
      </Card.Content>
      <Link to={buildExplorerSlugRoute(match, type, slugName)} className="ui button">
        <Icon name="chevron circle right" />
        <br />
        View More
      </Link>
    </Card>
  );
};

export default ProfileCard;
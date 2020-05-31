import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Card, Icon, Image, Popup } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import * as Router from './RouterHelperFunctions';
import WidgetHeaderNumber from './WidgetHeaderNumber';
import {
  docToName,
  docToShortDescription, profileIDToFullname,
  profileIDToPicture,
  studentsParticipating,
} from './data-model-helper-functions';
import { buildExplorerRoute, interestedStudents } from './explorer-helper-functions';

interface IProfileCardProps {
  item: {
    _id: string;
    name: string;
  };
  type: string;
  canAdd: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  profile: object;
}

const ProfileCard = (props: IProfileCardProps) => {
  const { item, type, match } = props;
  const itemName = docToName(item);
  const itemShortDescription = docToShortDescription(item);
  const numberStudents = studentsParticipating(item);
  const interested = interestedStudents(item, type);

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
              key={student._id}
              trigger={<Image src={profileIDToPicture(student.userID)} circular bordered />}
              content={profileIDToFullname(student.userID)}
            />
))}
        </Image.Group>
      </Card.Content>
      <Link to={buildExplorerRoute(props.item, props)} className="ui button">
        <Icon name="chevron circle right" />
        <br />
        View More
      </Link>
    </Card>
  );
};


export default withRouter(ProfileCard);

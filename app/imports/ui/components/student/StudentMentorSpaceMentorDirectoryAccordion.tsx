import React, { useState } from 'react';
import { Accordion, Divider, Icon, Image, List, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { IMentorProfile } from '../../../typings/radgrad';

interface IStudentMentorSpaceMentorDirectoryAccordionProps {
  profiles: IMentorProfile[];
  index: number;
}

const StudentMentorSpaceMentorDirectoryAccordion = (props: IStudentMentorSpaceMentorDirectoryAccordionProps) => {
  const [activeIndexState, setActiveIndex] = useState(-1);

  const handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const newIndex = activeIndexState === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  return (
    <div>
      {_.map(props.profiles, (p, ind) => {
        const mentor = MentorProfiles.findDoc(p._id);
        return (
          <Accordion fluid styled key={ind}>
            <Accordion.Title active={activeIndexState === ind} index={ind} onClick={handleClick}>
              <List>
                <List.Item>
                  <Icon name="dropdown" />
                  <Image src={mentor.picture} size="mini" />
                  <List.Content>
                    <a href="#">
                      {mentor.firstName} {mentor.lastName}
                    </a>
                    <List.Description>
                      {mentor.career}, {mentor.company}
                    </List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Accordion.Title>
            <Accordion.Content active={activeIndexState === ind}>
              <Divider />
              <Segment basic size="tiny">
                {`"${mentor.motivation}"`}
                <br />
              </Segment>
              <Segment basic size="tiny">
                {mentor.firstName} {mentor.lastName} is based in {mentor.location}
                <br />
                <Icon name="mail" /> <a href={`mailto:${mentor.username}`}>{mentor.username}</a>
                <br />
                <Icon name="linkedin" />
                <a href={`https://www.linkedin.com/in/${mentor.linkedin}`}>{mentor.linkedin}</a>
                <br />
              </Segment>

            </Accordion.Content>
          </Accordion>
        );
      })}
    </div>
  );
};

const StudentMentorSpaceMentorDirectoryAccordionContainer = withTracker(() => {
  const profiles = MentorProfiles.find({}).fetch();
  return {
    profiles,
  };
})(StudentMentorSpaceMentorDirectoryAccordion);
export default StudentMentorSpaceMentorDirectoryAccordionContainer;

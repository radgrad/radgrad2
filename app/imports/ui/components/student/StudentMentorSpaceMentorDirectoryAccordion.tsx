import * as React from 'react';
import { Accordion, Divider, Icon, Image, List, Segment } from 'semantic-ui-react';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { IMentorProfile } from '../../../typings/radgrad';

interface IStudentMentorSpaceMentorDirectoryAccordionState {
  activeIndex: number;
}

interface IStudentMentorSpaceMentorDirectoryAccordionProps {
  profiles: IMentorProfile[];
  index: number;
}

class StudentMentorSpaceMentorDirectoryAccordion extends React.Component<IStudentMentorSpaceMentorDirectoryAccordionProps, IStudentMentorSpaceMentorDirectoryAccordionState> {
  constructor(props) {
    super(props);
    this.state = { activeIndex: -1 };
  }

  public handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  public render() {
    const { activeIndex } = this.state;
    return (
      <div>
        {_.map(this.props.profiles, (p, ind) => {
          const mentor = MentorProfiles.findDoc(p._id);
          return (
            <Accordion fluid={true} styled={true} key={ind}>
              <Accordion.Title active={activeIndex === ind} index={ind} onClick={this.handleClick}>
                <List>
                  <List.Item>
                    <Icon name="dropdown"/>
                    <Image src={mentor.picture} size={'mini'}/>
                    <List.Content>
                      <a href="#">{mentor.firstName} {mentor.lastName} </a>
                      <List.Description>
                        {mentor.career}, {mentor.company}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                </List>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === ind}>
                <Divider/>
                <Segment basic={true} size='tiny'>
                  {`"${mentor.motivation}"`}<br/>
                </Segment>
                <Segment basic={true} size='tiny'>
                  {mentor.firstName} {mentor.lastName} is based in {mentor.location}<br/>
                    <Icon name="mail"/> <a href={`mailto:${mentor.username}`}>{mentor.username}</a><br/>
                  <Icon name="linkedin"/> <a href={`https://www.linkedin.com/in/${mentor.linkedin}`}>{mentor.linkedin}</a><br/>
                </Segment>

              </Accordion.Content>
            </Accordion>
          );
        })}
      </div>
    );
  }
}

const StudentMentorSpaceMentorDirectoryAccordionContainer = withTracker(() => {
  const profiles = MentorProfiles.find().fetch();
  // console.log('StudentMentorSpaceMentorDirectoryAccordion withTracker items=%o', answers);
  return {
    profiles,
  };
})(StudentMentorSpaceMentorDirectoryAccordion);
export default StudentMentorSpaceMentorDirectoryAccordionContainer;

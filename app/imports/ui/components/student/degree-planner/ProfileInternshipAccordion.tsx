import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import IceHeader from '../../shared/IceHeader';
import NamePill from './NamePill';
import { DraggableColors, getDraggableInternshipPillStyle } from './utilities/styles';

const ProfileInternshipAccordion: React.FC = () => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };
  const droppableID = 'foo-bar-baz';
  const slug = 'foo';
  const color = DraggableColors.INTERNSHIP;
  return (
    <Accordion fluid styled>
      <Accordion.Title active={active} onClick={handleClick}>
        <IceHeader ice={{ i: 0, c: 0, e: 25 }} />
        Front-end developer internship
        <Icon name="dropdown" />
      </Accordion.Title>
      <Accordion.Content active={active}>
        <Droppable droppableId={droppableID}>
          {(provided) => (
            <div ref={provided.innerRef}>
              <Draggable key={slug} draggableId={slug} index={0}>
                {(prov, snap) => (
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={getDraggableInternshipPillStyle(snap.isDragging, prov.draggableProps.style)}>
                    <NamePill name='Front-end developer internship' color={color} icon='hot mug' />
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
              Drag into your plan
            </div>
          )}
        </Droppable>
      </Accordion.Content>
    </Accordion>
  );
};

export default ProfileInternshipAccordion;

import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

interface IAdminDatabaseAccordionProps {
  index: number;
  name: string;
  contents: string[];
}

const AdminDatabaseAccordion = (props: IAdminDatabaseAccordionProps) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (e, titleProps) => {
    e.preventDefault();
    // console.log(titleProps);
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const prettyPrint = () => {
    let returnString = '';
    props.contents.forEach((s) => {
      returnString += `${JSON.stringify(s, null, 0)}\n`;
    });
    // console.log(props.contents, returnString);
    return returnString;
  };

  return (
    <Accordion styled fluid>
      <Accordion.Title active={activeIndex === props.index} index={props.index} onClick={handleClick}>
        <Icon name="dropdown" /> {props.name} ({props.contents.length})
      </Accordion.Title>
      <Accordion.Content active={activeIndex === props.index}>
        {prettyPrint()}
      </Accordion.Content>
    </Accordion>
  );
};

export default AdminDatabaseAccordion;

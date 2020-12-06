import React from 'react';
import ScrollUpButton from 'react-scroll-up-button';
import { Button, Icon } from 'semantic-ui-react';

const BackToTopButton: React.FC = () => {
  const style = {
    position: 'fixed',
    right: '-500px',
  };
  const toggledStyle = {
    margin: 0,
    position: 'fixed',
    bottom: '40px',
    right: '5px',
    zIndex: 999,
  };

  return (
    <ScrollUpButton style={style} ToggledStyle={toggledStyle}>
      <Button size="big" circular icon>
        <Icon name="arrow up" />
      </Button>
    </ScrollUpButton>
  );
};

export default BackToTopButton;

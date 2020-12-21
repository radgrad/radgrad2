import React from 'react';
import { Label } from 'semantic-ui-react';

interface CoursePillProps {
  name: string;
}

const CoursePill: React.FC<CoursePillProps> = ({ name }) => (<Label basic color="green">{name}</Label>);

export default CoursePill;

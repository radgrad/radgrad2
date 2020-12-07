import React from 'react';
import { Label } from 'semantic-ui-react';

interface ICoursePillProps {
  name: string;
}

const CoursePill: React.FC<ICoursePillProps> = ({ name }) => (<Label basic color="green">{name}</Label>);

export default CoursePill;

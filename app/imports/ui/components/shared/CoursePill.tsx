import * as React from 'react';
import { Label } from 'semantic-ui-react';

interface ICoursePillProps {
  name: string;
}

const CoursePill = (props: ICoursePillProps) => (<Label basic={true} color="green">{props.name}</Label>);

export default CoursePill;

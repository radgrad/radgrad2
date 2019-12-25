import React from 'react';
import { Embed } from 'semantic-ui-react';

interface IStudentTeaserWidgetVideoProps {
  teaserUrl: string;
}

const StudentTeaserWidgetVideo = (props: IStudentTeaserWidgetVideoProps) => {
  const embedStyle = {
    width: '290px',
    height: 'auto',
  };
  return (
    <Embed active={true} autoplay={false} style={embedStyle} source="youtube" id={props.teaserUrl}/>
  );
};

export default StudentTeaserWidgetVideo;

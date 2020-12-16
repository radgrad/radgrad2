import React from 'react';
import { Embed } from 'semantic-ui-react';

interface TeaserVideoProps {
  id: string;
}

const TeaserVideo: React.FC<TeaserVideoProps> = ({ id }) => (
  <Embed
    active
    autoplay={false}
    source="youtube"
    id={id}
    // onClick={handleClick}
    // placeholder={`http://img.youtube.com/vi/${props.id}/0.jpg`}
  />
);

// const [playing, setPlaying] = useState<boolean>(false);
//
// useEffect(() => {
//   let timeoutHandle;
//   if (playing) {
//     console.log('Triggered');
//     timeoutHandle = Meteor.setTimeout(() => {
//       console.log('passed');
//     }, 5000);
//   }
//
//   return () => {
//     Meteor.clearTimeout(timeoutHandle);
//   };
// }, [playing]);
//
// const handleClick = () => {
//   console.log('Clicked');
//   setPlaying(true);
// };

export default TeaserVideo;

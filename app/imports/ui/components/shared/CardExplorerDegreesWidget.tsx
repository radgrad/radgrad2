import * as React from 'react';
import { Segment, Header, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { IDesiredDegree } from '../../../typings/radgrad';
import WidgetHeaderNumber from './WidgetHeaderNumber';

interface ICardExplorerDegreesWidgetProps {
  collection: any;
  degrees: object[];
  itemCount: number;
}

class CardExplorerDegreesWidget extends React.Component<ICardExplorerDegreesWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { degrees, itemCount } = this.props;

    const textTransformUppercaseStyle: React.CSSProperties = { textTransform: 'uppercase' };
    const cardGroupStyle: React.CSSProperties = {
      maxHeight: '750px',
      overflowX: 'hidden',
      overflowY: 'scroll',
      marginTop: '10px',
    };

    return (
      <Segment padded={true}>
        <Header dividing={true}>
          <h4><span style={textTransformUppercaseStyle}>DESIRED DEGREES </span> <WidgetHeaderNumber
            inputValue={itemCount}/></h4>
        </Header>

        <Card.Group itemsPerRow={2} style={cardGroupStyle}>
          {
            // degrees.map((degree, index) => <ExplorerCard key={index} item={degree} type="degrees"/>)
          }
        </Card.Group>
      </Segment>

      // TODO: Back to Top Button
    );
  }
}

const CardExplorerDegreesWidgetContainer = withTracker((props) => {
  const degrees = props.collection.findNonRetired({}, { sort: { name: 1 } });
  const itemCount = props.collection.findNonRetired({}, { sort: { name: 1 } }).length;
  return {
    degrees,
    itemCount,
  };
})(CardExplorerDegreesWidget);

export default CardExplorerDegreesWidgetContainer;

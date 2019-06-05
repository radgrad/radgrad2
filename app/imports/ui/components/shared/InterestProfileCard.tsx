import * as React from 'react';
import { Card } from 'semantic-ui-react';
import { Interests} from "../../../api/interest/InterestCollection";


/**
 * reference taken from ExplorerCard.tsx written by Gian ../imports/ui/shared/ExplorerCard.tsx
 * think about making generic classes and then inheriting
 */

interface IInterestProfileCardProps {
  item: {
    _id: string;
  };
  type: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class InterestProfileCard extends React.Component<IInterestProfileCardProps> {
  constructor(props) {
    super(props)
  }

  /**
   * in ../imports/ui/shared/CardExplorerWidget.tsx the Interest Profile card needs to have:
   * a type, a canAdd method that returns true and match
   */
  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { item } = this.props;
    console.log(item);
    return (
      <Card className='radgrad-interest-card'>
        <Card.Content>
          <Card.Header>the header goes here </Card.Header>
          <Card.Meta>
          </Card.Meta>
        </Card.Content>
        <Card.Content>
        </Card.Content>
      </Card>

    );

  }
}

export default InterestProfileCard;

import * as React from 'react';
import {Button, Card, Icon} from 'semantic-ui-react';
import {Slugs} from "../../../api/slug/SlugCollection";
import {Link} from 'react-router-dom';
import * as Markdown from 'react-markdown';

/**
 * reference taken from ExplorerCard.tsx written by Gian ../imports/ui/shared/ExplorerCard.tsx
 * think about making generic classes and then inheriting
 */

interface IProfileCardProps {
  item: {
    _id: string;
  };
  type: string;
  canAdd: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class ProfileCard extends React.Component<IProfileCardProps> {
  constructor(props) {
    super(props);
  }

  private itemName = (item) => item.name;

  private itemSlug = (item) => Slugs.findDoc(item.slugID).name;

  private itemShortDescription = (item) => {
    let description = item.description;
    if (description.length > 200) {
      description = `${description.substring(0, 200)}`;
      if (description.charAt(description.length - 1) === ' ') {
        description = `${description.substring(0, 199)}`;
      }
    }
    return description;
  }

  private routerLink = (props) => (
    props.href.match(/^(https?:)?\/\//)
      ? <a href={props.href}>{props.children}</a>
      : <Link to={props.href}>{props.children}</Link>
  )
  private getUsername = () => this.props.match.params.username;

  private buildRouteName = (item) => {
    const itemSlug = this.itemSlug(item);
    const username = this.getUsername();
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
    console.log(itemSlug);
    const {type} = this.props;
    switch (type) {
      case 'career-goals':
        return `${baseRoute}explorer/career-goals/${itemSlug}`;
      case 'courses':
        return `${baseRoute}explorer/courses/${itemSlug}`;
      case 'degrees':
        return `${baseRoute}explorer/degrees/${itemSlug}`;
      case 'interests':
        return `${baseRoute}explorer/interests/${itemSlug}`;
      case 'opportunities':
        return `${baseRoute}explorer/opportunities/${itemSlug}`;
      default:
        break;
    }
    return '#';
  }

  /**
   * in ../imports/ui/shared/CardExplorerWidget.tsx the Interest Profile card needs to have:
   * a type, a canAdd method that returns true and match
   */
  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const {item} = this.props;
    const itemName = this.itemName(item);
    const itemShortDescription = this.itemShortDescription(item);
    console.log(item);
    return (
      <Card className='radgrad-interest-card'>
        <Card.Content>
          <Card.Header>{itemName}</Card.Header>
          <Card.Meta>
          </Card.Meta>
        </Card.Content>
        <Card.Content>
          <Markdown escapeHtml={true} source={`${itemShortDescription}...`}
                    renderers={{link: this.routerLink}}/>
        </Card.Content>
        <Link to={this.buildRouteName(this.props.item)}>
        <Button className="radgrad-home-buttons center aligned" attached="bottom"><Icon
          name="chevron circle right"/><br/>View More</Button>
        </Link>
      </Card>

    );

  }
}

export default ProfileCard;

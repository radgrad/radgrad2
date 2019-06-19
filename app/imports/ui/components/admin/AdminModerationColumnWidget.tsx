// this will be the column widget that holds the individual moderation cards
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { IMentorQuestion, IReview } from '../../../typings/radgrad';
import { Slugs } from "../../../api/slug/SlugCollection";
import { withTracker } from "meteor/react-meteor-data"; // eslint-disable-line


interface IAdminModerationColumn {
  approve: (item) => any,
  deny: (item) => any,
  reviews: IReview[],
}

class AdminModerationColumnWidget extends React.Component {
  constructor(props) {
    super(props)
    console.log('Admin Moderation Column Widget props constructor: ', props)
  }

  public render() {
    console.log('Admin Moderation Column Widget Props: ', this.props);
    return (
      <div> Hello World</div>
    );
  }
}

const AdminModerationColumnWidgetContainer = withTracker((c) => ({
  //item should be a Review
  approve: (item) => {
    const updateData = {
      id: item._id,
      data: {
        moderated: true,
        visible: true
      }
    }
    // use slugID to get slug, then get Entitiy name from slug
    const collectionName = `${Slugs.getNameFromID(item.slugID).entityName}Collection`;

    console.log('your review has been approved! \n', item, 'update data: ', updateData, 'collection name: ', collectionName);
    return {
      updateData,
      collectionName
    }
  },
  deny: (item) => {
    //set visible to false and moderated to true
    const updateData = {
      id: item._id,
      data: {
        moderated: true,
        visible: false
      }
    }
    const collectionName = `${Slugs.getNameFromID(item.slugID).entityName}Collection`;
    console.log('your review has been denied...\n', item);

    return {
      updateData,
      collectionName
    }
  },
}))(AdminModerationColumnWidget);

/*

//item should be a Question*/
export default AdminModerationColumnWidgetContainer;


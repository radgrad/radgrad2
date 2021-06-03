import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, LongTextField, SelectField, SubmitField } from 'uniforms-semantic/';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { Accordion, Form, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { Reviews } from '../../../../api/review/ReviewCollection';
import RatingField from './RatingField';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { defineMethod } from '../../../../api/base/BaseCollection.methods';
import { AcademicTerm, ReviewDefine } from '../../../../typings/radgrad';
import { getUserIdFromRoute, getUsername } from '../../shared/utilities/router';
import { ReviewTypes } from '../../../../api/review/ReviewTypes';

interface StudentExplorerAddReviewFormProps {
  itemToReview: {
    [key: string]: any; // TODO this is a poor way to type this.
  };
  reviewType: string;
}

const collection = Reviews;

const StudentExplorerAddReviewForm: React.FC<StudentExplorerAddReviewFormProps> = ({ itemToReview, reviewType }) => {
  // console.log('StudentExplorerAddReviewForm', props);
  const match = useRouteMatch();
  const formRef = React.createRef();
  const [activeState, setActive] = useState(false);

  const handleAccordionClick = (e: any) => {
    e.preventDefault();
    setActive(!activeState);
  };

  const handleAdd = (doc: ReviewDefine): void => {
    const collectionName = collection.getCollectionName();
    const username = getUsername(match);
    const academicTermDoc = AcademicTerms.getAcademicTermFromToString(doc.academicTerm);
    const academicTermSlug = AcademicTerms.findSlugByID(academicTermDoc._id);
    const definitionData: ReviewDefine = doc;
    definitionData.academicTerm = academicTermSlug;
    definitionData.student = username;
    definitionData.visible = false;
    definitionData.reviewType = reviewType as ReviewTypes;
    definitionData.reviewee = itemToReview._id;
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((error) => { RadGradAlert.failure('Add Failed', error.message, error);})
      .then(() => { RadGradAlert.success('Review Added');});
  };

  const academicTerm = (): AcademicTerm[] => {
    const academicTerms = [];
    let instances;
    if (reviewType === 'course') {
      const course = itemToReview;
      instances = CourseInstances.findNonRetired({
        studentID: getUserIdFromRoute(match),
        courseID: course._id,
      });
    } else {
      const opportunity = itemToReview;
      instances = OpportunityInstances.findNonRetired({
        studentID: getUserIdFromRoute(match),
        opportunityID: opportunity._id,
      });
    }
    instances.forEach((instance) => {
      const term = AcademicTerms.findDoc(instance.termID);
      if (term.termNumber <= AcademicTerms.getCurrentAcademicTermDoc().termNumber) {
        academicTerms.push(AcademicTerms.findDoc(instance.termID));
      }
    });
    // console.log(academicTerms);
    return academicTerms;
  };

  const accordionTitleStyle = {
    textAlign: 'center',
    color: '#38840F',
  };
  const paddedContainerStyle = { paddingBottom: '1.5em' };

  const terms = academicTerm();
  const academicTermNames = terms.map((term) => `${term.term} ${term.year}`);
  const schema = new SimpleSchema({
    academicTerm: {
      type: String,
      label: 'Academic Term',
      allowedValues: academicTermNames,
      defaultValue: academicTermNames[0],
    },
    rating: {
      type: SimpleSchema.Integer,
      label: 'Rating',
      min: 0,
      max: 5,
      optional: true,
      defaultValue: 3,
    },
    comments: {
      type: String,
      label: 'Comments',
    },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Accordion>
      <Accordion.Title style={accordionTitleStyle} active={activeState} onClick={handleAccordionClick}>
        <Icon name="dropdown" />
        <a>Add Review </a>
      </Accordion.Title>

      <Accordion.Content active={activeState}>
        <div className="ui padded container" style={paddedContainerStyle}>
          <AutoForm schema={formSchema} onSubmit={handleAdd} ref={formRef}>
            <Form.Group widths="equal">
              {academicTermNames.length <= 1 ? <SelectField name="academicTerm" disabled /> : <SelectField name="academicTerm" />}
              <RatingField name="rating" />
            </Form.Group>

            <LongTextField placeholder="Explain the reasoning behind your rating here." name="comments" />

            <SubmitField className="green basic mini" value="ADD" inputRef={undefined} disabled={false} />
            <ErrorsField />
          </AutoForm>
        </div>
      </Accordion.Content>
    </Accordion>
  );
};

export default StudentExplorerAddReviewForm;

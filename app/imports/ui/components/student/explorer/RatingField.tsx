import React from 'react';
import classnames from 'classnames';
import { connectField, filterDOMProps } from 'uniforms';
import { Dropdown } from 'semantic-ui-react';
import StudentExplorerReviewStarsWidget from './StudentExplorerReviewStarsWidget';

/* eslint react/prop-types: 0 */
const renderDropdown = ({ placeholder, onChange, value }) => {
  const options = [
    {
      key: 1,
      text: (
        <React.Fragment>
          <StudentExplorerReviewStarsWidget rating={1} />
          One of the worst
        </React.Fragment>
      ),
      value: 1,
    },
    {
      key: 2,
      text: (
        <React.Fragment>
          <StudentExplorerReviewStarsWidget rating={2} />
          Below average
        </React.Fragment>
      ),
      value: 2,
    },
    {
      key: 3,
      text: (
        <span>
          <div className="ui yellow rating" data-icon="star" data-rating="3" data-max-rating="5" />
          <StudentExplorerReviewStarsWidget rating={3} />
          Average
        </span>
      ),
      value: 3,
    },
    {
      key: 4,
      text: (
        <React.Fragment>
          <StudentExplorerReviewStarsWidget rating={4} />
          Above average
        </React.Fragment>
      ),
      value: 4,
    },
    {
      key: 5,
      text: (
        <React.Fragment>
          <StudentExplorerReviewStarsWidget rating={5} />
          One of the best
        </React.Fragment>
      ),
      value: 5,
    },
  ];
  return <Dropdown placeholder={placeholder} selection options={options} onChange={(event, data) => onChange(data.value)} value={value} />;
};

const Rating = ({ allowedValues, checkboxes, className, disabled, error, errorMessage, fieldType, id, inputRef, label, name, onChange, placeholder, showInlineError, value, ...props }) => (
  <div className={classnames({ disabled, error }, className, 'field')} {...filterDOMProps(props)}>
    {label && <label htmlFor={id}>{label}</label>}
    {renderDropdown({
      placeholder,
      onChange,
      value,
    })}
    {!!(error && showInlineError) && <div className="ui red basic pointing label">{errorMessage}</div>}
  </div>
);

export default connectField(Rating);

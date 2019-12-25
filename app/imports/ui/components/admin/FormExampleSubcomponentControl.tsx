import React from 'react';
import { Form } from 'semantic-ui-react';

interface IFormExampleProps {
  handleSubmit: (doc) => any;
}
interface IFormExampleState {
  value: string;
}

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
];

class FormExampleSubcomponentControl extends React.Component<IFormExampleProps, IFormExampleState> {
  public state: IFormExampleState = { value: '' };

  constructor(props) {
    super(props);
  }

  public handleChange = (e, { value }) => this.setState({ value });
  public handleSubmit = (doc) => this.props.handleSubmit(doc);

  public render() {
    const { value } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input fluid={true} label="First name" placeholder="First name" />
          <Form.Input fluid={true} label="Last name" placeholder="Last name" />
          <Form.Select fluid={true} label="Gender" options={options} placeholder="Gender" />
        </Form.Group>
        <Form.Group inline={true}>
          <label>Size</label>
          <Form.Radio
            label="Small"
            value="sm"
            checked={value === 'sm'}
            onChange={this.handleChange}
          />
          <Form.Radio
            label="Medium"
            value="md"
            checked={value === 'md'}
            onChange={this.handleChange}
          />
          <Form.Radio
            label="Large"
            value="lg"
            checked={value === 'lg'}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.TextArea label="About" placeholder="Tell us more about you..." />
        <Form.Checkbox label="I agree to the Terms and Conditions" />
        <Form.Button>Submit</Form.Button>
      </Form>
    );
  }
}

export default FormExampleSubcomponentControl;

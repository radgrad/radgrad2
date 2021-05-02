import React from 'react';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useStickyState } from '../../../utilities/StickyState';

export const AdminAnalyticsIntervalSelectorStickyStateID = { startDate: 'AdminAnalyticsIntervalSelector.startDate', endDate: 'AdminAnalyticsIntervalSelector.endDate' };

interface DateIntervalSelectorProps {
  startStickyStateID: string;
  endStickyStateID: string;
  onClick: () => any;
}

const startOf = date => moment(date).startOf('day').toDate();

const DateIntervalSelector: React.FC<DateIntervalSelectorProps> = ({ startStickyStateID, endStickyStateID, onClick }) => {
  const [startDate, setStartDate] = useStickyState(startStickyStateID, startOf(moment().subtract(1, 'days')));
  const [endDate, setEndDate] = useStickyState(endStickyStateID, startOf(moment()));
  const handleChangeStartDate = (date: Date) => setStartDate(startOf(date));
  const handleChangeEndDate = (date: Date) => setEndDate(startOf(date));
  return (
    <Form>
      <Form.Group>
        <Form.Input label="Start Date (midnight)">
          <DatePicker onChange={handleChangeStartDate} selected={startDate} maxDate={endDate} />
        </Form.Input>
        <Form.Input label="End Date (midnight of day before)">
          <DatePicker onChange={handleChangeEndDate} selected={endDate} minDate={startDate} />
        </Form.Input>
      </Form.Group>
      <Form.Button onClick={onClick}>Submit</Form.Button>
    </Form>
  );
};

export default DateIntervalSelector;

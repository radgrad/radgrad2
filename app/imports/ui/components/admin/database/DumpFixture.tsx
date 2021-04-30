import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import React, { useState } from 'react';
import { Button, Form, Grid, Message } from 'semantic-ui-react';
import { dumpDatabaseMethod } from '../../../../api/base/BaseCollection.methods';
import { databaseFileDateFormat } from '../../../pages/admin/AdminDatabaseManagementPage';
import { useStickyState } from '../../../utilities/StickyState';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradSegment from '../../shared/RadGradSegment';
import AdminDatabaseAccordion from './AdminDatabaseAccordion';

const header = <RadGradHeader title='Dump DB Fixture' icon='cloud download alternate' />;

const DumpFixture: React.FC = () => {
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);
  const [inProgress, setInProgress] = useStickyState('DumpFixture', false);

  const onClick = () => {
    setInProgress(true);
    dumpDatabaseMethod.callPromise(null)
      .catch(err => setError(true))
      .then(result => {
        setResults(result.collections);
        const zip = new ZipZap();
        const dir = 'radgrad-db';
        const fileName = `${dir}/${moment(result.timestamp).format(databaseFileDateFormat)}.json`;
        zip.file(fileName, JSON.stringify(result, null, 2));
        zip.saveAs(`${dir}.zip`);
      })
      .finally(() => setInProgress(false));
  };

  return (
    <RadGradSegment header={header}>
      <Form>
        <Button color="green" loading={inProgress} basic type="submit" onClick={onClick}>
          Dump Database
        </Button>
        {results.length > 0 ? (
          <Grid stackable style={{ paddingTop: 20 }}>
            <Message positive={!error} error={error}>
              {results.map((item, index) => (
                <AdminDatabaseAccordion key={item.name} index={index} name={item.name} contents={item.contents}/>
              ))}
            </Message>
          </Grid>
        ) : (
          ''
        )}
      </Form>
    </RadGradSegment>
  );
};

export default DumpFixture;

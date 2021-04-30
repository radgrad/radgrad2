import React, { useState } from 'react';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';
import { checkIntegrity } from '../../../../api/integrity/IntegrityChecker';
import { checkIntegrityMethod } from '../../../../api/integrity/IntegrityChecker.methods';
import { useStickyState } from '../../../utilities/StickyState';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradSegment from '../../shared/RadGradSegment';

const header = <RadGradHeader title='Check Integrity' icon='tasks' />;

const CheckIntegrity: React.FC = () => {
  const resultsInitialState = { count: 0, message: '' };
  const [clientError, setClientError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [clientResults, setClientResults] = useState(resultsInitialState );
  const [serverResults, setServerResults] = useState( resultsInitialState );
  const [inProgress, setInProgress] = useStickyState('CheckIntegrity', false);

  const onClick = () => {
    setInProgress(true);
    checkIntegrityMethod.callPromise(null)
      .catch(err => setServerError(true))
      .then(results => { setServerResults(results); setServerError(results.count > 0); })
      .finally(() => setInProgress(false));
    setClientResults(checkIntegrity());
    setClientError(clientResults.count > 0);
  };

  return (
    <RadGradSegment header={header}>
      <Form>
        <Button color="green" loading={inProgress} basic type="submit" onClick={onClick}>
          Check Integrity
        </Button>
        <Grid stackable width="equal" style={{ paddingTop: 20 }}>
          <Grid.Column width={8}>
            {clientResults.message ? (
              <Message error={clientError} positive={!clientError}>
                <Header> Integrity Check (Client-side DB)</Header>
                <pre>{clientResults.message}</pre>
              </Message>
            ) : (
              ''
            )}
          </Grid.Column>
          <Grid.Column width={8}>
            {serverResults.message ? (
              <Message error={serverError} positive={!serverError}>
                <Header> Integrity Check (Server-side DB)</Header>
                <pre>{serverResults.message}</pre>
              </Message>
            ) : (
              ''
            )}
          </Grid.Column>
        </Grid>
      </Form>
    </RadGradSegment>
  );
};

export default CheckIntegrity;

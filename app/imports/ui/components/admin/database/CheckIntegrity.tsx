import React, { useState } from 'react';
import { Button, Form, Grid, Header, Message } from 'semantic-ui-react';
import { checkIntegrity } from '../../../../api/integrity/IntegrityChecker';
import { checkIntegrityMethod } from '../../../../api/integrity/IntegrityChecker.methods';
import { useStickyState } from '../../../utilities/StickyState';
import RadGradHeader from '../../shared/RadGradHeader';
import RadGradSegment from '../../shared/RadGradSegment';

const header = <RadGradHeader title='Check Integrity' icon='tasks' />;

const CheckIntegrity: React.FC = () => {
  const initialState = { count: 0, message: '' };
  const [clientResults, setClientResults] = useState(initialState);
  const [serverResults, setServerResults] = useState(initialState);
  const [inProgress, setInProgress] = useStickyState('CheckIntegrity', false);

  const onClick = () => {
    setInProgress(true);
    setClientResults({ count: 0, message: 'Awaiting results of client-side integrity check.' });
    setServerResults({ count: 0, message: 'Awaiting results of server-side integrity check.\nIf request times out, check console log on server for results.' });
    checkIntegrityMethod.callPromise(null)
      .catch(err => {
        setServerResults({ count: 1, message: err.message });
      })
      .then(results => {
        setServerResults(results);
      })
      .finally(() => setInProgress(false));
    setClientResults(checkIntegrity());
  };

  const preStyle = { overflowX: 'auto' as const, whiteSpace: 'pre-wrap' as const, wordWrap: 'break-word' as const };
  return (
    <RadGradSegment header={header}>
      <Form>
        <Button color="green" loading={inProgress} basic type="submit" onClick={onClick}>
          Check Integrity
        </Button>
        <Grid stackable width="equal" style={{ paddingTop: 20 }}>
          <Grid.Column width={8}>
            <Message negative={clientResults.count > 0}>
              <Header> Integrity Check (Client-side DB)</Header>
              <pre style={preStyle}>{clientResults.message}</pre>
            </Message>
          </Grid.Column>
          <Grid.Column width={8}>
            <Message negative={serverResults.count > 0}>
              <Header> Integrity Check (Server-side DB)</Header>
              <pre style={preStyle}>{serverResults.message}</pre>
            </Message>
          </Grid.Column>
        </Grid>
      </Form>
    </RadGradSegment>
  );
};

export default CheckIntegrity;

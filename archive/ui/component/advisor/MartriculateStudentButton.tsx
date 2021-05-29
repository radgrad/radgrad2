import React, { useState } from 'react';
import { Confirm, SemanticSIZES } from 'semantic-ui-react';
import RadGradAlerts from '../../../../app/imports/ui/utilities/RadGradAlert';
import { matriculateStudentMethod } from '../../../../app/imports/api/user/StudentProfileCollection.methods';
import { StudentProfile } from '../../../../app/imports/typings/radgrad';
import { ButtonAction } from '../../../../app/imports/ui/components/shared/button/ButtonAction';

interface MatriculateStudentButtonProps {
  student: StudentProfile;
  size: SemanticSIZES;
}

const MatriculateStudentButton: React.FC<MatriculateStudentButtonProps> = ({ student, size }) => {

  const RadGradAlert = new RadGradAlerts();
  const [confirmOpenState, setConfirmOpen] = useState(false);

  const handleConfirmMatriculate = () => {
    matriculateStudentMethod.callPromise(student.username)
      .then(() => { RadGradAlert.success(`Successfully matriculated ${student.firstName} ${student.lastName}`, '', 1500);})
      .catch((error) => { RadGradAlert.failure(`Error: failed to matriculated ${student.firstName} ${student.lastName}`, error.message, 2500, error);})
      .finally(() => setConfirmOpen(false));
  };
  return (
    <>
      <ButtonAction onClick={() => setConfirmOpen(true)} label='Matriculate' color='red' size={size} />
      <Confirm open={confirmOpenState} onCancel={() => setConfirmOpen(false)} onConfirm={handleConfirmMatriculate} header={`Matriculate ${student.firstName} ${student.lastName}?`} />
      </>
  );
};

export default MatriculateStudentButton;

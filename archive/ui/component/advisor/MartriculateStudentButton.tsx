import React, { useState } from 'react';
import { Confirm, SemanticSIZES } from 'semantic-ui-react';
import RadGradAlert from '../../../../app/imports/ui/utilities/RadGradAlert';
import { matriculateStudentMethod } from '../../../../app/imports/api/user/StudentProfileCollection.methods';
import { StudentProfile } from '../../../../app/imports/typings/radgrad';
import { ButtonAction } from '../../../../app/imports/ui/components/shared/button/ButtonAction';

interface MatriculateStudentButtonProps {
  student: StudentProfile;
  size: SemanticSIZES;
}

const MatriculateStudentButton: React.FC<MatriculateStudentButtonProps> = ({ student, size }) => {
  const [confirmOpenState, setConfirmOpen] = useState(false);

  const handleConfirmMatriculate = () => {
    matriculateStudentMethod.callPromise(student.username)
      .then(() => { RadGradAlert.success(`Successfully matriculated ${student.firstName} ${student.lastName}`);})
      .catch((error) => { RadGradAlert.failure(`Error: failed to matriculated ${student.firstName} ${student.lastName}`, error.message, error);})
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

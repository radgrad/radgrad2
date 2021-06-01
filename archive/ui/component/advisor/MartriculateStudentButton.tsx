import React, { useState } from 'react';
import { Confirm, SemanticSIZES } from 'semantic-ui-react';
import Swal from 'sweetalert2';
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
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: `Successfully matriculated ${student.firstName} ${student.lastName}`,
          text: `Student ${student.username} has matriculated and is no longer in RadGrad.`,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: `Error: failed to matriculated ${student.firstName} ${student.lastName}`,
          text: `Student ${student.username} has not matriculated. ${error.message}`,
        });
      })
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

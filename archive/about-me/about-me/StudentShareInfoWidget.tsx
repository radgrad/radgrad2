// @ts-ignore
import React from 'react';
// @ts-ignore
import {Form, Grid} from 'semantic-ui-react';
// @ts-ignore
import {AutoForm, BoolField, SubmitField, ErrorsField} from 'uniforms-semantic/';
// @ts-ignore
import {SimpleSchema2Bridge} from 'uniforms-bridge-simple-schema-2';
// @ts-ignore
import SimpleSchema from 'simpl-schema';
// @ts-ignore
import {StudentProfiles} from '../../../../api/user/StudentProfileCollection';
// @ts-ignore
import {updateMethod} from '../../../../api/base/BaseCollection.methods';
// @ts-ignore
import {StudentProfile, UserInteractionDefine} from '../../../../typings/radgrad';
// @ts-ignore
import {UserInteractionsTypes} from '../../../../api/analytic/UserInteractionsTypes';
// @ts-ignore
import {userInteractionDefineMethod} from '../../../../api/analytic/UserInteractionCollection.methods';
import RadGradAlerts from '../../../app/imports/ui/utilities/RadGradAlert';

interface StudentShareInfoWidgetProps {
    profile: StudentProfile;
}

const RadGradAlert = new RadGradAlerts();

const handleUpdateInformation = (doc): void => {
    const updateData = doc;
    updateData.id = doc._id;
    const collectionName = StudentProfiles.getCollectionName();
    const username = doc.username;
    updateMethod.call({collectionName, updateData}, (error) => {
        if (error) {
            RadGradAlert.failure('Update Failed', error.message, 2500, error);
        } else {
            RadGradAlert.success('Update Succeeded', 1500);
            // Define a user interaction that describes a user updating their share information
            const keys = ['shareUsername', 'sharePicture', 'shareWebsite', 'shareInterests', 'shareCareerGoals', 'shareCourses', 'shareOpportunities', 'shareLevel'];
            const modifiedList = [];
            const previousStudentProfileData = StudentProfiles.findNonRetired({username});
            if (previousStudentProfileData.length > 1) {
                console.error(`Error creating a UserInteraction: Found more than one student profile with the same username: ${username}`);
                return;
            }
            // For the type data, we only record the specific information that was modified
            keys.forEach((key) => {
                if (doc[key] !== previousStudentProfileData[0][key]) {
                    modifiedList.push(`${key}:${doc[key]}`);
                }
            });
            const interactionData: UserInteractionDefine = {
                username,
                type: UserInteractionsTypes.SHAREINFORMATION,
                typeData: modifiedList,
            };
            userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
                if (userInteractionError) {
                    console.error('Error creating UserInteraction.', userInteractionError);
                }
            });
        }
    });
};

const StudentShareInfoWidget: React.FC<StudentShareInfoWidgetProps> = ({profile}) => {
    const model = profile;
    const schema = new SimpleSchema({
        shareUsername: {
            type: Boolean,
            label: 'Email',
            optional: true,
        },
        sharePicture: {
            type: Boolean,
            label: 'Picture',
            optional: true,
        },
        shareWebsite: {
            type: Boolean,
            label: 'Website',
            optional: true,
        },
        shareInterests: {
            type: Boolean,
            label: 'Interests',
            optional: true,
        },
        shareCareerGoals: {
            type: Boolean,
            label: 'Career Goals',
            optional: true,
        },
        shareOpportunities: {
            type: Boolean,
            label: 'Opportunities',
            optional: true,
        },
        shareCourses: {
            type: Boolean,
            label: 'Courses',
            optional: true,
        },
        shareLevel: {
            type: Boolean,
            label: 'Level',
            optional: true,
        },
    });
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
        <React.Fragment>
            <Grid padded>
                <AutoForm schema={formSchema} model={model} onSubmit={handleUpdateInformation}>
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Group>
                                <BoolField name="shareUsername"/>
                                <BoolField name="sharePicture"/>
                                <BoolField name="shareWebsite"/>
                                <BoolField name="shareInterests"/>
                            </Form.Group>
                            <Form.Group>
                                <BoolField name="shareCareerGoals"/>
                                <BoolField name="shareCourses"/>
                                <BoolField name="shareOpportunities"/>
                                <BoolField name="shareLevel"/>
                            </Form.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <SubmitField className="basic green shareInfo" value="UPDATE" disabled={false}
                                         inputRef={undefined}/>
                        </Grid.Column>
                    </Grid.Row>
                    <ErrorsField/>
                </AutoForm>
            </Grid>
        </React.Fragment>
    );
};

export default StudentShareInfoWidget;

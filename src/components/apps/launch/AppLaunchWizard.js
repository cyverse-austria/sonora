/**
 * @author psarando
 *
 * An App Launch Wizard for collecting and validating user input of app
 * parameters and resource requirements as an alaysis submission.
 */
import React from "react";

import { Formik, Form, FastField } from "formik";
import { injectIntl } from "react-intl";

import ids from "./ids";
import messages from "./messages";
import styles from "./styles";

import {
    ResourceRequirementsForm,
    ResourceRequirementsReview,
} from "./ResourceRequirements";

import {
    build as buildDebugId,
    FormCheckbox,
    FormMultilineTextField,
    FormIntegerField,
    FormNumberField,
    FormTextField,
    getMessage,
    formatMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    makeStyles,
    BottomNavigation,
    BottomNavigationAction,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Paper,
    Stepper,
    Step,
    StepButton,
    StepLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@material-ui/core";

import { ArrowBack, ArrowForward, ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const StepContent = ({ id, hidden, step, label, children }) => (
    <fieldset id={id} hidden={hidden}>
        <legend>
            {getMessage("stepLabel", { values: { step: step + 1, label } })}
        </legend>
        {children}
    </fieldset>
);

const formatAnalysisName = (intl, name) =>
    name
        ? formatMessage(intl, "newAnalysisName", { appName: name }).replace(
              / /g,
              "_"
          )
        : "";

const validate = (values) => {
    const errors = {};
    const stepErrors = [];

    if (!values.name) {
        errors.name = getMessage("required");
        stepErrors[0] = true;
    }
    if (!values.output_dir) {
        errors.output_dir = getMessage("required");
        stepErrors[0] = true;
    }

    if (values.groups) {
        const groupErrors = [];
        values.groups.forEach((group, index) => {
            const paramErrors = [];

            if (group.parameters) {
                group.parameters.forEach((param, paramIndex) => {
                    if (!param.value && param.required) {
                        paramErrors[paramIndex] = {
                            value: getMessage("required"),
                        };
                        stepErrors[1] = true;
                    }
                });

                if (paramErrors.length > 0) {
                    groupErrors[index] = { parameters: paramErrors };
                }
            }
        });

        if (groupErrors.length > 0) {
            errors.groups = groupErrors;
        }
    }

    if (stepErrors.length > 0) {
        errors.steps = stepErrors;
    }

    return errors;
};

const initValues = ({
    intl,
    notify,
    output_dir,
    app: { id, system_id, name, requirements, groups },
}) => {
    const groupInitValues =
        groups &&
        groups.map((group) => ({
            ...group,
            parameters:
                group.parameters &&
                group.parameters.map((param) => ({
                    ...param,
                    value: param.defaultValue || "",
                })),
        }));

    const reqInitValues = requirements.map(
        ({
            step_number,
            default_cpu_cores = 0,
            default_memory = 0,
            default_disk_space = 0,
        }) => ({
            step_number,
            min_cpu_cores: default_cpu_cores,
            min_memory_limit: default_memory,
            min_disk_space: default_disk_space,
        })
    );

    return {
        debug: false,
        notify,
        output_dir,
        name: formatAnalysisName(intl, name),
        description: "",
        app_id: id,
        system_id,
        groups: groupInitValues,
        limits: requirements,
        requirements: reqInitValues,
    };
};

const AppLaunchWizard = (props) => {
    const [activeStep, setActiveStep] = React.useState(0);

    const classes = useStyles();

    const {
        baseId,
        defaultMaxCPUCores,
        defaultMaxMemory,
        defaultMaxDiskSpace,
        submitAnalysis,
        app: { groups },
    } = props;

    const formId = buildDebugId(baseId, ids.APP_LAUNCH_FORM);
    const stepIdParams = buildDebugId(formId, ids.TEMPLATE_GROUP);
    const stepIdResources = buildDebugId(
        formId,
        ids.APP_LAUNCH_RESOURCE_REQUESTS
    );
    const stepIdReview = buildDebugId(formId, ids.APP_LAUNCH_REVIEW);

    const hasParams =
        groups &&
        groups.reduce(
            (hasParams, group) =>
                hasParams || (group.parameters && group.parameters.length > 0),
            false
        );

    const stepAnalysisInfo = { label: getMessage("analysisInfo"), step: 0 };
    const stepParameters = { label: getMessage("parameters"), step: 1 };
    const stepResourceRequirements = {
        label: getMessage("resourceRequirements"),
        step: hasParams ? 2 : 1,
    };
    const stepReviewAndLaunch = {
        label: getMessage("reviewAndLaunch"),
        step: hasParams ? 3 : 2,
    };

    const steps = hasParams
        ? [
              stepAnalysisInfo,
              stepParameters,
              stepResourceRequirements,
              stepReviewAndLaunch,
          ]
        : [stepAnalysisInfo, stepResourceRequirements, stepReviewAndLaunch];

    const isLastStep = () => {
        return activeStep === steps.length - 1;
    };

    const handleNext = () => {
        const newActiveStep = isLastStep() ? 0 : activeStep + 1;

        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) =>
            activeStep ? prevActiveStep - 1 : steps.length - 1
        );
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initValues(props)}
            validate={validate}
            onSubmit={(values, { setSubmitting }) => {
                const {
                    notify,
                    debug,
                    name,
                    description,
                    output_dir,
                    system_id,
                    app_id,
                    requirements,
                    groups,
                } = values;

                const submission = {
                    notify,
                    debug,
                    name,
                    description,
                    output_dir,
                    system_id,
                    app_id,
                    requirements,
                    config:
                        groups &&
                        groups.reduce((configs, group) => {
                            group.parameters.forEach((param) => {
                                if (param.type !== "Info") {
                                    configs[param.id] = param.value;
                                }
                            });
                            return configs;
                        }, {}),
                };

                submitAnalysis(
                    submission,
                    () => setSubmitting(false),
                    (errorMsg) => setSubmitting(false)
                );
            }}
        >
            {({ values, errors, handleSubmit, isSubmitting }) => (
                <Form id={formId}>
                    <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepButton
                                    id={buildDebugId(
                                        formId,
                                        ids.BUTTONS.STEP,
                                        index + 1
                                    )}
                                    onClick={handleStep(index)}
                                >
                                    <StepLabel
                                        error={
                                            errors.steps && errors.steps[index]
                                        }
                                    >
                                        {step.label}
                                    </StepLabel>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>

                    <StepContent
                        id={buildDebugId(formId, ids.LAUNCH_ANALYSIS_GROUP)}
                        step={stepAnalysisInfo.step}
                        label={getMessage("analysisInfo")}
                        hidden={activeStep !== stepAnalysisInfo.step}
                    >
                        <FastField
                            id={buildDebugId(
                                formId,
                                ids.LAUNCH_ANALYSIS_GROUP,
                                ids.APP_LAUNCH_NAME
                            )}
                            label={getMessage("analysisName")}
                            required={true}
                            name="name"
                            component={FormTextField}
                        />
                        <FastField
                            id={buildDebugId(
                                formId,
                                ids.LAUNCH_ANALYSIS_GROUP,
                                ids.APP_LAUNCH_COMMENTS
                            )}
                            label={getMessage("comments")}
                            name="description"
                            component={FormMultilineTextField}
                        />
                        <FastField
                            id={buildDebugId(
                                formId,
                                ids.LAUNCH_ANALYSIS_GROUP,
                                ids.APP_LAUNCH_OUTPUT_FOLDER
                            )}
                            label={getMessage("outputFolder")}
                            required={true}
                            name="output_dir"
                            component={FormTextField}
                        />
                        <FastField
                            id={buildDebugId(
                                formId,
                                ids.LAUNCH_ANALYSIS_GROUP,
                                ids.APP_LAUNCH_RETAIN_INPUTS
                            )}
                            label={getMessage("retainInputsLabel")}
                            name="debug"
                            component={FormCheckbox}
                        />
                    </StepContent>

                    <StepContent
                        id={stepIdParams}
                        step={stepParameters.step}
                        label={getMessage("analysisParameters")}
                        hidden={
                            !hasParams || activeStep !== stepParameters.step
                        }
                    >
                        {values.groups &&
                            values.groups.map((group, index) => {
                                const groupFormId = buildDebugId(
                                    stepIdParams,
                                    index + 1
                                );

                                return (
                                    <ExpansionPanel
                                        key={group.id}
                                        id={groupFormId}
                                        defaultExpanded
                                    >
                                        <ExpansionPanelSummary
                                            expandIcon={
                                                <ExpandMore
                                                    id={buildDebugId(
                                                        groupFormId,
                                                        ids.BUTTONS.EXPAND
                                                    )}
                                                />
                                            }
                                        >
                                            <Typography variant="subtitle1">
                                                {group.label}
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails
                                            className={
                                                classes.expansionPanelDetails
                                            }
                                        >
                                            {group.parameters.map(
                                                (param, paramIndex) => {
                                                    if (!param.isVisible) {
                                                        return null;
                                                    }

                                                    const name = `groups.${index}.parameters.${paramIndex}.value`;
                                                    const paramFormId = buildDebugId(
                                                        groupFormId,
                                                        paramIndex
                                                    );

                                                    let fieldProps = {
                                                        id: paramFormId,
                                                        name,
                                                        label: param.label,
                                                        required:
                                                            param.required,
                                                    };

                                                    switch (param.type) {
                                                        case "Info":
                                                            fieldProps = {
                                                                id: paramFormId,
                                                                name,
                                                                component: Typography,
                                                                variant:
                                                                    "body1",
                                                                gutterBottom: true,
                                                                children:
                                                                    param.label,
                                                            };
                                                            break;

                                                        case "Integer":
                                                            fieldProps.component = FormIntegerField;
                                                            break;

                                                        case "Double":
                                                            fieldProps.component = FormNumberField;
                                                            break;

                                                        default:
                                                            fieldProps.component = FormTextField;
                                                            break;
                                                    }

                                                    return (
                                                        <FastField
                                                            key={param.id}
                                                            {...fieldProps}
                                                        />
                                                    );
                                                }
                                            )}
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                );
                            })}
                    </StepContent>

                    <StepContent
                        id={stepIdResources}
                        step={stepResourceRequirements.step}
                        label={getMessage("resourceRequirements")}
                        hidden={activeStep !== stepResourceRequirements.step}
                    >
                        <ResourceRequirementsForm
                            baseId={stepIdResources}
                            limits={values.limits}
                            defaultMaxCPUCores={defaultMaxCPUCores}
                            defaultMaxMemory={defaultMaxMemory}
                            defaultMaxDiskSpace={defaultMaxDiskSpace}
                        />
                    </StepContent>

                    <StepContent
                        id={stepIdReview}
                        step={stepReviewAndLaunch.step}
                        label={getMessage("launchOrSaveAsQL")}
                        hidden={activeStep !== stepReviewAndLaunch.step}
                    >
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    {values.groups &&
                                        values.groups.map((group) =>
                                            group.parameters.map(
                                                (param) =>
                                                    param.isVisible &&
                                                    (!!param.value ||
                                                        param.value === 0) && (
                                                        <TableRow
                                                            key={param.id}
                                                        >
                                                            <TableCell>
                                                                {param.label}
                                                            </TableCell>
                                                            <TableCell>
                                                                {param.value}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                            )
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <ResourceRequirementsReview
                            baseId={stepIdReview}
                            requirements={values.requirements}
                        />
                    </StepContent>

                    <BottomNavigation
                        showLabels
                        onChange={(event, value) => {
                            switch (value) {
                                case "submit":
                                    handleSubmit(event);
                                    break;
                                case "next":
                                    handleNext();
                                    break;
                                default:
                                    handleBack();
                                    break;
                            }
                        }}
                    >
                        <BottomNavigationAction
                            id={buildDebugId(formId, ids.BUTTONS.STEP_BACK)}
                            label={getMessage("back")}
                            value="back"
                            icon={<ArrowBack />}
                        />
                        {isLastStep() ? (
                            <BottomNavigationAction
                                id={buildDebugId(formId, ids.BUTTONS.SUBMIT)}
                                label={getMessage("launchAnalysis")}
                                value="submit"
                                disabled={isSubmitting}
                            />
                        ) : (
                            <BottomNavigationAction
                                id={buildDebugId(formId, ids.BUTTONS.STEP_NEXT)}
                                label={getMessage("next")}
                                value="next"
                                icon={<ArrowForward />}
                            />
                        )}
                    </BottomNavigation>
                </Form>
            )}
        </Formik>
    );
};

export default withI18N(injectIntl(AppLaunchWizard), messages);

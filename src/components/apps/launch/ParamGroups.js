/**
 * @author psarando
 *
 * Form fields for displaying app parameters and parameter groups.
 */
import React from "react";

import sanitizeHtml from "sanitize-html";
import { FastField } from "formik";

import constants from "./constants";
import ids from "./ids";
import messages from "./messages";
import styles from "./styles";

import {
    build as buildDebugId,
    FormCheckboxStringValue,
    FormMultilineTextField,
    FormIntegerField,
    FormNumberField,
    FormSelectField,
    FormTextField,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    makeStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles(styles);

/**
 * Form fields and info display for an app parameter group.
 */
const ParamGroupForm = withI18N((props) => {
    const classes = useStyles();

    const { baseId, fieldName, group } = props;

    return (
        <ExpansionPanel id={baseId} defaultExpanded>
            <ExpansionPanelSummary
                expandIcon={
                    <ExpandMore id={buildDebugId(baseId, ids.BUTTONS.EXPAND)} />
                }
            >
                <Typography variant="subtitle1">{group.label}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                {group.parameters.map((param, paramIndex) => {
                    if (!param.isVisible) {
                        return null;
                    }

                    const name = `${fieldName}.parameters.${paramIndex}.value`;
                    const paramFormId = buildDebugId(baseId, paramIndex);

                    let fieldProps = {
                        id: paramFormId,
                        name,
                        label: param.label,
                        required: param.required,
                    };

                    switch (param.type) {
                        case constants.PARAM_TYPE.INFO:
                            fieldProps = {
                                id: paramFormId,
                                name,
                                component: Typography,
                                variant: "body1",
                                gutterBottom: true,
                                dangerouslySetInnerHTML: {
                                    __html: sanitizeHtml(param.label),
                                },
                            };
                            break;

                        case constants.PARAM_TYPE.TEXT:
                            fieldProps.component = FormTextField;

                            if (
                                param.validators &&
                                param.validators.length > 0
                            ) {
                                const charLimitValidator = param.validators.find(
                                    (validator) =>
                                        validator.type ===
                                        constants.VALIDATOR_TYPE.CHARACTER_LIMIT
                                );
                                if (charLimitValidator) {
                                    fieldProps.inputProps = {
                                        maxLength: charLimitValidator.params[0],
                                    };
                                }
                            }
                            break;

                        case constants.PARAM_TYPE.INTEGER:
                            fieldProps.component = FormIntegerField;
                            break;

                        case constants.PARAM_TYPE.DOUBLE:
                            fieldProps.component = FormNumberField;
                            break;

                        case constants.PARAM_TYPE.MULTILINE_TEXT:
                            fieldProps.component = FormMultilineTextField;
                            break;

                        case constants.PARAM_TYPE.FLAG:
                            fieldProps.component = FormCheckboxStringValue;
                            break;

                        case constants.PARAM_TYPE.TEXT_SELECTION:
                        case constants.PARAM_TYPE.INTEGER_SELECTION:
                        case constants.PARAM_TYPE.DOUBLE_SELECTION:
                            fieldProps.component = FormSelectField;
                            fieldProps.children =
                                param.arguments &&
                                param.arguments.map((arg) => (
                                    <MenuItem key={arg.value} value={arg}>
                                        {arg.display}
                                    </MenuItem>
                                ));
                            break;

                        default:
                            fieldProps.component = FormTextField;
                            break;
                    }

                    return <FastField key={param.id} {...fieldProps} />;
                })}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}, messages);

const ParamsReviewValue = ({ param }) => {
    const { value, type } = param;

    switch (type) {
        case constants.PARAM_TYPE.MULTILINE_TEXT:
            return (
                <TextField
                    multiline
                    rows={3}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                    value={value}
                />
            );

        case constants.PARAM_TYPE.TEXT_SELECTION:
        case constants.PARAM_TYPE.INTEGER_SELECTION:
        case constants.PARAM_TYPE.DOUBLE_SELECTION:
            if (value && value.display) {
                return value.display;
            }
            break;

        default:
            break;
    }

    return value;
};

/**
 * A table summarizing the app parameter values and step resource requirements
 * that will be included in the final analysis submission.
 */
const ParamsReview = ({ groups }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableBody>
                {groups &&
                    groups.map((group) =>
                        group.parameters.map(
                            (param) =>
                                param.isVisible &&
                                (!!param.value || param.value === 0) && (
                                    <TableRow key={param.id}>
                                        <TableCell>{param.label}</TableCell>
                                        <TableCell>
                                            <ParamsReviewValue param={param} />
                                        </TableCell>
                                    </TableRow>
                                )
                        )
                    )}
            </TableBody>
        </Table>
    </TableContainer>
);

export { ParamGroupForm, ParamsReview };

/**
 * @author sriram
 *  Wraps ErrorHandler in a Dialog
 *
 **/

import React from "react";
import { useTranslation } from "i18n";
import PropTypes from "prop-types";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ErrorHandler from "./ErrorHandler";

const useStyles = makeStyles((theme) => ({
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.error.main,
        padding: theme.spacing(1),
    },
}));

const DEErrorDialog = ({
    baseId,
    handleClose,
    errorHandler,
    errorObject,
    open,
}) => {
    const { t } = useTranslation("util");
    const classes = useStyles();

    const ErrorHandlerComponent = errorHandler || ErrorHandler;

    return (
        <Dialog open={open} onClose={handleClose} scroll="body">
            <DialogTitle>
                <IconButton
                    aria-label={t("close")}
                    className={classes.closeButton}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <ErrorHandlerComponent
                    errorObject={errorObject}
                    baseId={baseId}
                />
            </DialogContent>
        </Dialog>
    );
};

DEErrorDialog.propTypes = {
    baseId: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
    errorHandler: PropTypes.elementType,
    errorObject: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
};

export default DEErrorDialog;

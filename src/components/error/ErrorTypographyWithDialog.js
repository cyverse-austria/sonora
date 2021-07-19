/**
 * A wrapper component to display an ErrorTypography and a DEErrorDialog.
 *
 * @author psarando
 */
import React from "react";

import ids from "../utils/ids";

import ErrorTypography from "./ErrorTypography";
import DEErrorDialog from "./DEErrorDialog";

import buildID from "components/utils/DebugIDUtil";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

const ErrorTypographyWithDialog = ({ baseId, errorMessage, errorObject }) => {
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
    trackIntercomEvent(IntercomEvents.ENCOUNTERED_ERROR, errorObject);
    return (
        <>
            <ErrorTypography
                errorMessage={errorMessage}
                onDetailsClick={() => setErrorDialogOpen(true)}
            />
            <DEErrorDialog
                open={errorDialogOpen}
                baseId={buildID(baseId, ids.ERROR_DLG)}
                errorObject={errorObject}
                handleClose={() => {
                    setErrorDialogOpen(false);
                }}
            />
        </>
    );
};

export default ErrorTypographyWithDialog;

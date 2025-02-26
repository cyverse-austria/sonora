/**
 * @author sriram
 *
 * A toolbar for admin Reference Genome Listing
 *
 */

import React from "react";
import { useTranslation } from "i18n";

import ids from "./ids";
import GlobalFilter from "./GlobalFilter";

import buildID from "components/utils/DebugIDUtil";

import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
}));

const TableToolbar = (props) => {
    const { baseId } = props;
    const { t } = useTranslation("referenceGenomes");
    const classes = useToolbarStyles();
    const {
        preGlobalFilteredRows,
        setGlobalFilter,
        globalFilter,
        onAddClicked,
    } = props;
    const toolbarId = buildID(baseId, ids.TOOLBAR);
    return (
        <Toolbar className={classes.root}>
            <Button
                id={buildID(toolbarId, ids.ADD_BUTTON)}
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onAddClicked}
            >
                {t("add")}
            </Button>
            <GlobalFilter
                baseId={toolbarId}
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
        </Toolbar>
    );
};
export default TableToolbar;

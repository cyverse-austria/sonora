import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { Info } from "@material-ui/icons";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";
import { useTranslation } from "i18n";

import ids from "../ids";

function DetailsMenuItem(props) {
    const { baseId, onDetailsSelected, onClose } = props;
    const { t } = useTranslation("data");

    return (
        <MenuItem
            key={buildID(baseId, ids.DETAILS_MENU_ITEM)}
            id={buildID(baseId, ids.DETAILS_MENU_ITEM)}
            onClick={() => {
                onClose();
                onDetailsSelected();
            }}
        >
            <ListItemIcon>
                <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("details")} />
        </MenuItem>
    );
}

export default DetailsMenuItem;

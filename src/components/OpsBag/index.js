import React from "react";

import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    makeStyles,
    Typography,
    Button,
} from "@material-ui/core";
import { Delete, GetApp, People } from "@material-ui/icons";

import { useQuery } from "react-query";
import * as facade from "../../serviceFacades/bags";
import { Skeleton } from "@material-ui/lab";

import {
    createNewBagItem,
    FILE_TYPE,
    FOLDER_TYPE,
    ANALYSIS_TYPE,
    APP_TYPE,
} from "./classes";
import { useTranslation } from "i18n";

const useStyles = makeStyles((theme) => ({
    paper: {
        width: theme.spacing(80),

        [theme.breakpoints.down("sm")]: {
            width: "90%",
        },
    },
    title: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    help: {
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        overflowWrap: "break-word",
    },
    button: {
        margin: theme.spacing(2),
        width: theme.spacing(20),
    },
}));

const BagSkeleton = () => (
    <Skeleton variant="rect" animation="wave" height={100} width="100%" />
);

export const BagUI = ({ remove }) => {
    const classes = useStyles();
    const { t } = useTranslation(["bags", "common"]);

    const { status, data, error } = useQuery(
        [facade.DEFAULT_BAG_QUERY_KEY],
        facade.getDefaultBag
    );

    const isLoading = status === "loading";
    const hasErrored = status === "error";

    if (hasErrored) {
        console.log(error.message);
    }

    let bagItems = data?.items || [];
    bagItems = bagItems.map((item) => createNewBagItem(item));

    return (
        <>
            {isLoading ? (
                <BagSkeleton />
            ) : (
                <>
                    <Typography variant="h4" className={classes.title}>
                        {t("yourItemBag")}
                    </Typography>
                    <Typography variant="body1" className={classes.help}>
                        {t("bagHelp")}
                    </Typography>
                    <List>
                        {bagItems.map((bagItem, index) => {
                            return (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Avatar>{bagItem.icon(t)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={bagItem.label} />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label={t("delete")}
                                            onClick={remove(index)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </List>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<GetApp />}
                    >
                        {t("download")}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<People />}
                    >
                        {t("share")}
                    </Button>
                </>
            )}
        </>
    );
};

export default ({ open, remove, onClose }) => {
    const classes = useStyles();

    return (
        <Drawer
            anchor="right"
            open={open}
            classes={{ paper: classes.paper }}
            onClose={onClose}
        >
            <BagUI remove={remove} />
        </Drawer>
    );
};

export { FILE_TYPE, FOLDER_TYPE, ANALYSIS_TYPE, APP_TYPE };

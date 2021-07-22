/**
 * @author sriram
 *
 * A drawer that display tabs with various information such as description, rating, documentation, quick launches about an app.
 *
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import { queryCache, useMutation, useQuery } from "react-query";

import ToolsUsedPanel from "./ToolUsedPanel";
import AppFavorite from "../AppFavorite";

import ids from "../../apps/ids";
import { DETab, DETabPanel, DETabs } from "../../utils/DETabs";

import DetailsPanel from "./DetailsPanel";
import constants from "../../../constants";

import { getHost } from "components/utils/getHost";
import { getAppListingLinkRefs } from "components/apps/utils";

import {
    APP_BY_ID_QUERY_KEY,
    APP_DETAILS_QUERY_KEY,
    appFavorite,
    getAppById,
    getAppDetails,
    rateApp,
} from "serviceFacades/apps";

import buildID from "components/utils/DebugIDUtil";
import CopyTextArea from "components/copy/CopyTextArea";
import Rate from "components/rating/Rate";

import {
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Drawer,
    IconButton,
    Tooltip,
    Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import LinkIcon from "@material-ui/icons/Link";

const TABS = {
    appInfo: "APP INFORMATION",
    toolInfo: "TOOL(S) USED BY THIS APP",
};
const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        [theme.breakpoints.up("lg")]: {
            maxWidth: "25%",
        },
        [theme.breakpoints.down("lg")]: {
            maxWidth: "50%",
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "90%",
        },
    },

    drawerHeader: {
        margin: theme.spacing(1),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },
    drawerSubHeader: {
        marginLeft: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },

    headerOperations: {
        marginLeft: theme.spacing(1),
    },
}));

function DetailsHeader({
    appId,
    systemId,
    loading,
    appName,
    isExternal,
    isPublic,
    isFavorite,
    onFavoriteClick,
    classes,
    baseId,
}) {
    const { t } = useTranslation("apps");
    const [link, setLink] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const host = getHost();
        const partialLink = getAppListingLinkRefs(systemId, appId)[1];
        setLink(`${host}${partialLink}`);
    }, [appId, systemId]);

    return (
        <>
            <Typography variant="h6" component="span">
                {appName}
            </Typography>

            <div className={classes.headerOperations}>
                {!isExternal && isPublic && (
                    <AppFavorite
                        baseId={baseId}
                        isFavorite={isFavorite}
                        isExternal={isExternal}
                        onFavoriteClick={onFavoriteClick}
                    />
                )}
                <Tooltip title={t("linkToThisApp", { name: appName })}>
                    <IconButton size="small" onClick={() => setOpen(true)}>
                        <LinkIcon color="primary" fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>
                    {t("linkToThisApp", { name: appName })}
                    <IconButton
                        size="small"
                        onClick={() => setOpen(false)}
                        style={{ float: "right" }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <CopyTextArea
                        text={link}
                        debugIdPrefix={buildID(baseId, appId)}
                    />
                </DialogContent>
            </Dialog>
            {loading && <CircularProgress size={30} thickness={5} />}
        </>
    );
}

function DetailsSubHeader({
    appId,
    isExternal,
    isPublic,
    averageRating,
    totalRating,
}) {
    if (!isExternal && isPublic) {
        return (
            <Rate
                name={appId}
                value={averageRating}
                readOnly={true}
                total={totalRating}
            />
        );
    } else {
        return null;
    }
}

function DetailsDrawer(props) {
    const classes = useStyles();
    const { appId, systemId, open, onClose, onFavoriteUpdated } = props;

    const { t } = useTranslation("apps");

    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedTab, setSelectedTab] = useState(TABS.appInfo);
    const [detailsError, setDetailsError] = useState(null);
    const [favMutationError, setFavMutationError] = useState(null);
    const [ratingMutationError, setRatingMutationError] = useState(null);
    const [details, setDetails] = useState(null);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const isExternal =
        selectedApp?.app_type.toUpperCase() ===
        constants.APP_TYPE_EXTERNAL.toUpperCase();

    const appName = selectedApp?.name;
    const isPublic = selectedApp?.is_public;
    const isFavorite = selectedApp?.is_favorite;
    const {
        average: averageRating,
        total: totalRating,
        user: userRating,
    } = selectedApp?.rating || { average: 0, total: 0, user: 0 };

    const drawerId = ids.DETAILS_DRAWER;
    const detailsTabId = buildID(drawerId, ids.DETAILS_TAB);
    const toolInfoTabId = buildID(drawerId, ids.TOOLS_INFO_TAB);

    const { isFetching: appByIdStatus, error: appByIdError } = useQuery({
        queryKey: [APP_BY_ID_QUERY_KEY, { systemId, appId }],
        queryFn: getAppById,
        config: {
            enabled: appId != null && systemId !== null,
            onSuccess: (result) => {
                setSelectedApp(result?.apps[0]);
            },
        },
    });

    const { isFetching: detailsStatus } = useQuery({
        queryKey: [
            APP_DETAILS_QUERY_KEY,
            {
                systemId,
                appId,
            },
        ],
        queryFn: getAppDetails,
        config: {
            enabled: appId != null && systemId !== null,
            onSuccess: setDetails,
            onError: (e) => {
                setDetailsError(e);
                setFavMutationError(null);
                setRatingMutationError(null);
            },
        },
    });

    const [favorite, { status: favMutationStatus }] = useMutation(appFavorite, {
        onSuccess: () => {
            queryCache.invalidateQueries([
                APP_BY_ID_QUERY_KEY,
                { systemId, appId },
            ]);
            onFavoriteUpdated && onFavoriteUpdated(selectedApp.is_favorite);
        },
        onError: (e) => {
            setFavMutationError(e);
            setDetailsError(null);
            setRatingMutationError(null);
        },
    });

    const [rating, { status: ratingMutationStatus }] = useMutation(rateApp, {
        onSuccess: () =>
            queryCache.invalidateQueries([
                APP_BY_ID_QUERY_KEY,
                { systemId, appId },
            ]),
        onError: (e) => {
            setRatingMutationError(e);
            setDetailsError(null);
            setFavMutationError(null);
        },
    });

    const onFavoriteClick = () => {
        favorite({
            isFav: !selectedApp.is_favorite,
            appId: selectedApp.id,
            systemId: selectedApp.system_id,
        });
    };

    const onRatingChange = (event, value) => {
        rating({
            appId: selectedApp.id,
            systemId: selectedApp.system_id,
            rating: value,
        });
    };

    const onDeleteRating = () => {
        rating({
            appId: selectedApp.id,
            systemId: selectedApp.system_id,
            rating: null,
        });
    };

    return (
        <Drawer
            onClose={onClose}
            open={open}
            anchor="right"
            PaperProps={{
                id: drawerId,
                classes: { root: classes.drawerPaper },
                variant: "outlined",
            }}
        >
            <div className={classes.drawerHeader}>
                <DetailsHeader
                    appId={appId}
                    systemId={systemId}
                    loading={favMutationStatus === constants.LOADING}
                    appName={appName}
                    isExternal={isExternal}
                    isPublic={isPublic}
                    isFavorite={isFavorite}
                    onFavoriteClick={onFavoriteClick}
                    classes={classes}
                    baseId={drawerId}
                />
            </div>
            <div className={classes.drawerSubHeader}>
                <DetailsSubHeader
                    appId={appId}
                    averageRating={averageRating}
                    isExternal={isExternal}
                    isPublic={isPublic}
                    totalRating={totalRating}
                />
            </div>
            <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                <DETab
                    value={TABS.appInfo}
                    label={t("details")}
                    id={detailsTabId}
                    aria-controls={buildID(detailsTabId, ids.PANEL)}
                />
                <DETab
                    value={TABS.toolInfo}
                    label={t("toolsUsedByApp")}
                    id={toolInfoTabId}
                    aria-controls={buildID(toolInfoTabId, ids.PANEL)}
                />
            </DETabs>
            <DETabPanel
                tabId={detailsTabId}
                value={TABS.appInfo}
                selectedTab={selectedTab}
            >
                <DetailsPanel
                    details={details}
                    userRating={userRating}
                    isPublic={isPublic}
                    isExternal={isExternal}
                    detailsLoadingStatus={detailsStatus || appByIdStatus}
                    ratingMutationStatus={
                        ratingMutationStatus === constants.LOADING
                    }
                    baseId={drawerId}
                    onRatingChange={onRatingChange}
                    onDeleteRatingClick={onDeleteRating}
                    onFavoriteClick={onFavoriteClick}
                    detailsError={detailsError || appByIdError}
                    favMutationError={favMutationError}
                    ratingMutationError={ratingMutationError}
                />
            </DETabPanel>
            <DETabPanel
                tabId={toolInfoTabId}
                value={TABS.toolInfo}
                selectedTab={selectedTab}
            >
                <ToolsUsedPanel
                    details={details}
                    baseId={drawerId}
                    loading={detailsStatus || appByIdStatus}
                    error={detailsError || appByIdError}
                />
            </DETabPanel>
        </Drawer>
    );
}

export default DetailsDrawer;

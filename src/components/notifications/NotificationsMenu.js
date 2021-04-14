import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useUserProfile } from "../../contexts/userProfile";
import {
    getNotifications,
    markAllSeen,
    NOTIFICATIONS_MESSAGES_QUERY_KEY,
} from "../../serviceFacades/notifications";
import { useTranslation } from "../../i18n";
import ids from "./ids";
import withErrorAnnouncer from "../utils/error/withErrorAnnouncer";

import { build } from "@cyverse-de/ui-lib";
import { ListItem, Menu } from "@material-ui/core";
import NotLoggedIn from "../utils/error/NotLoggedIn";
import { DETab, DETabPanel, DETabs } from "../utils/DETabs";
import NotificationsTab from "./NotificationsTab";
import RunningViceTab from "./RunningViceTab";
import { useRunningViceJobs } from "../analyses/utils";

const TABS = {
    NOTIFICATIONS: "notifications",
    VICE: "vice",
};

// Listing constants for the notification menu.
const NOTIFICATION_MENU_SORT_FIELD = "timestamp";
const NOTIFICATION_MENU_SORT_ORDER = "desc";
const NOTIFICATION_MENU_LIMIT = 10;
const NOTIFICATION_MENU_OFFSET = 0;

function NotificationsMenu(props) {
    const {
        setUnSeenCount,
        notificationMssg,
        setAnchorEl,
        anchorEl,
        showErrorAnnouncer,
    } = props;
    const [notifications, setNotifications] = useState([]);
    const [analyses, setAnalyses] = useState([]);
    const [selectedTab, setSelectedTab] = useState(TABS.NOTIFICATIONS);
    const [userProfile] = useUserProfile();
    const [errorObject, setErrorObject] = useState(null);
    const { t } = useTranslation("common");

    const handleClose = () => {
        setAnchorEl();
    };

    const handleMarkAllAsSeenClick = () => {
        markAllSeenMutation();
        handleClose();
    };

    useEffect(() => {
        const found = notifications?.find(
            (msg) => msg.message.id === notificationMssg?.message.id
        );
        if ((found === null || found === undefined) && notificationMssg) {
            setNotifications([notificationMssg, ...notifications].slice(0, 10));
        }
    }, [notifications, notificationMssg]);

    const { isFetching } = useQuery({
        queryKey: [
            NOTIFICATIONS_MESSAGES_QUERY_KEY,
            {
                orderBy: NOTIFICATION_MENU_SORT_FIELD,
                order: NOTIFICATION_MENU_SORT_ORDER,
                limit: NOTIFICATION_MENU_LIMIT,
                offset: NOTIFICATION_MENU_OFFSET,
            },
        ],
        queryFn: getNotifications,
        config: {
            onSuccess: (results) => {
                setNotifications(results?.messages);
                if (results?.unseen_total > 0) {
                    setUnSeenCount(results?.unseen_total);
                }
                setErrorObject(null);
            },
            onError: (e) => {
                setErrorObject(e);
            },
            retry: 3,
        },
    });

    const { isFetching: isFetchingRunningVice } = useRunningViceJobs({
        enabled: userProfile?.id,
        onSuccess: (resp) => {
            setAnalyses(resp?.analyses);
        },
    });

    const [markAllSeenMutation] = useMutation(markAllSeen, {
        onSuccess: () => {
            setAllNotificationsSeen();
        },
        onError: (errorObject) => {
            showErrorAnnouncer(t("errorMarkAsSeen"), errorObject);
        },
    });

    const setAllNotificationsSeen = () => {
        setNotifications(
            notifications?.map((item) => {
                const tempItem = { ...item };
                tempItem.seen = true;
                return tempItem;
            })
        );
        setUnSeenCount(0);
    };

    const onTabSelectionChange = (event, selectedTab) =>
        setSelectedTab(selectedTab);

    const notificationTabId = build(
        ids.BASE_DEBUG_ID,
        ids.NOTIFICATIONS_MENU,
        ids.NOTIFICATIONS_HEADER
    );
    const viceTabId = build(
        ids.BASE_DEBUG_ID,
        ids.NOTIFICATIONS_MENU,
        ids.VICE_HEADER
    );

    return (
        <Menu
            anchorEl={anchorEl}
            id={build(ids.BASE_DEBUG_ID, ids.NOTIFICATIONS_MENU)}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            {!userProfile?.id && (
                <ListItem>
                    <NotLoggedIn />
                </ListItem>
            )}
            {userProfile?.id && [
                <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                    <DETab
                        value={TABS.NOTIFICATIONS}
                        label={t("notifications")}
                        id={notificationTabId}
                        aria-controls={build(notificationTabId, ids.PANEL)}
                    />
                    <DETab
                        value={TABS.VICE}
                        label={t("vice")}
                        id={viceTabId}
                        aria-controls={build(viceTabId, ids.PANEL)}
                    />
                </DETabs>,
                <DETabPanel
                    tabId={notificationTabId}
                    value={TABS.NOTIFICATIONS}
                    selectedTab={selectedTab}
                    dense
                >
                    <NotificationsTab
                        isFetching={isFetching}
                        notifications={notifications}
                        handleMarkAllAsSeenClick={handleMarkAllAsSeenClick}
                        handleClose={handleClose}
                        errorObject={errorObject}
                    />
                </DETabPanel>,
                <DETabPanel
                    tabId={viceTabId}
                    value={TABS.VICE}
                    selectedTab={selectedTab}
                >
                    <RunningViceTab
                        baseId={build(viceTabId, ids.PANEL)}
                        analyses={analyses}
                        handleClose={handleClose}
                        isFetching={isFetchingRunningVice}
                    />
                </DETabPanel>,
            ]}
        </Menu>
    );
}

export default withErrorAnnouncer(NotificationsMenu);

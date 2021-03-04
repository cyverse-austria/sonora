/**
 * @author aramsey
 */
import React, { useEffect, useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import { Container, makeStyles, Typography } from "@material-ui/core";
import { Trans, useTranslation } from "i18n";
import { useQuery } from "react-query";

import ErrorHandler from "components/utils/error/ErrorHandler";
import LinearProgressWithLabel from "components/utils/LinearProgressWithLabel";
import { useUserProfile } from "contexts/userProfile";
import ids from "./ids";
import {
    getLoadingStatus,
    getUrlReady,
    VICE_LOADING_STATUS_QUERY,
    VICE_LOADING_URL_READY,
} from "serviceFacades/vice/loading";
import { DEContainerStatus, getContainerDetails } from "./util";
import styles from "./styles";
import ViceLoadingToolbar from "./Toolbar";

const useStyles = makeStyles(styles);

function ViceLoading(props) {
    const { accessUrl } = props;
    const { t } = useTranslation("vice-loading");
    const classes = useStyles();

    const [userProfile] = useUserProfile();

    const baseId = ids.VIEW;

    const [data, setData] = useState({});
    const [ready, setReady] = useState(false);
    const [progress, setProgress] = useState({
        percent: 0,
        message: null,
        hasError: false,
    });

    const { deployments, configMaps, services, ingresses, pods } = data;
    const deployment = deployments?.[0];

    const { isFetching, error: statusError } = useQuery({
        queryKey: [VICE_LOADING_STATUS_QUERY, { accessUrl }],
        queryFn: getLoadingStatus,
        config: {
            enabled: userProfile?.id && !!accessUrl && !ready,
            onSuccess: setData,
            refetchInterval: 5000,
        },
    });

    const { error: urlReadyError } = useQuery({
        queryKey: [VICE_LOADING_URL_READY, { accessUrl }],
        queryFn: getUrlReady,
        config: {
            enabled: userProfile?.id && progress.percent === 100 && !ready,
            onSuccess: (resp) => setReady(resp.ready),
            refetchInterval: 5000,
        },
    });

    useEffect(() => {
        if (statusError) {
            setProgress({
                hasError: true,
                percent: 0,
                message: t("statusEndpointError"),
            });
            return;
        }

        const appName = deployments?.[0]?.appName;
        const deploymentsDone = deployments?.length > 0;
        const configMapsDone = configMaps?.length > 1;
        const servicesDone = services?.length > 0;
        const ingressesDone = ingresses?.length > 0;

        const {
            status: fileTransferStatus,
            restartCount: fileTransferRestartCount,
        } = getContainerDetails(pods, "input-files-init");
        const {
            status: inputFilesPodStatus,
            restartCount: inputFilesPodRestartCount,
        } = getContainerDetails(pods, "input-files");
        const {
            status: viceProxyPodStatus,
            restartCount: viceProxyPodRestartCount,
        } = getContainerDetails(pods, "vice-proxy");
        const {
            status: analysisPodStatus,
            restartCount: analysisPodRestartCount,
            image: analysisPodImage,
        } = getContainerDetails(pods, "analysis");

        if (
            !(
                deploymentsDone &&
                configMapsDone &&
                servicesDone &&
                ingressesDone
            )
        ) {
            setProgress({
                percent:
                    (deploymentsDone +
                        configMapsDone +
                        servicesDone +
                        ingressesDone) *
                    5,
                hasError: false,
                message: t("initializingVice"),
            });
        } else if (fileTransferStatus !== DEContainerStatus.DONE) {
            const hasError = fileTransferStatus === DEContainerStatus.ERROR;
            setProgress({
                percent: 20,
                hasError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "downloadInputsError"
                                : "downloadingInputs"
                        }
                        values={{ restartCount: fileTransferRestartCount }}
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
            });
        } else if (
            inputFilesPodStatus !== DEContainerStatus.DONE &&
            viceProxyPodStatus !== DEContainerStatus.DONE
        ) {
            const hasError =
                inputFilesPodStatus === DEContainerStatus.ERROR ||
                viceProxyPodStatus === DEContainerStatus.ERROR;
            const restartCount =
                inputFilesPodRestartCount || viceProxyPodRestartCount;
            setProgress({
                percent: 60,
                hasError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "downloadingDEImages"
                                : "downloadingDEImages"
                        }
                        values={{ restartCount }}
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
            });
        } else if (analysisPodStatus !== DEContainerStatus.DONE) {
            const hasError = analysisPodStatus === DEContainerStatus.ERROR;

            setProgress({
                percent: 75,
                hasError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "downloadVICEImageError"
                                : "downloadingVICEImage"
                        }
                        values={{
                            restartCount: analysisPodRestartCount,
                            image: analysisPodImage,
                            appName,
                        }}
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
            });
        } else {
            const hasError = !!urlReadyError;
            setProgress({
                percent: 100,
                hasError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "waitingForResponseError"
                                : "waitingForResponse"
                        }
                        values={{
                            appName,
                        }}
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
            });
        }
    }, [
        configMaps,
        data,
        deployments,
        ingresses,
        pods,
        services,
        statusError,
        t,
        urlReadyError,
    ]);

    if (!userProfile?.id) {
        return <ErrorHandler errorObject={{ response: { status: 401 } }} />;
    }

    if (isFetching && Object.keys(data).length === 0) {
        return (
            <img
                id={build(baseId, ids.LOADING_GIF)}
                src="/vice_loading_rocket.gif"
                alt={t("loadingGifAltText")}
                className={classes.centeredImage}
            />
        );
    }

    return (
        <>
            <ViceLoadingToolbar
                parentId={baseId}
                deployments={deployments}
                configMaps={configMaps}
                services={services}
                ingresses={ingresses}
                pods={pods}
            />
            <Container maxWidth="md" classes={{ root: classes.scrollable }}>
                <img
                    id={build(baseId, ids.LOADING_IMG)}
                    src="/vice_loading.png"
                    alt={t("loadingImgAltText")}
                    className={classes.centeredImage}
                />
                <Typography variant="h5" gutterBottom={true}>
                    {t("launchVICE", { appName: deployment?.appName })}
                </Typography>
                <LinearProgressWithLabel value={progress.percent} />
                <Typography
                    id={build(baseId, ids.STATUS_MSG)}
                    gutterBottom={true}
                    color={progress.hasError ? "error" : "inherit"}
                >
                    {progress.message}
                </Typography>
            </Container>
        </>
    );
}

export default ViceLoading;

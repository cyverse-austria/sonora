/**
 *
 * @author sriram
 *
 *
 */
import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import constants from "../../../constants";

import { getLocalStorage } from "components/utils/localStorage";
import { getListingPath } from "components/analyses/utils";
import analysisFields from "components/analyses/analysisFields";
import Listing from "components/analyses/listing/Listing";
import AnalysisSubmissionLanding from "components/analyses/details/AnalysisSubmissionLanding";

/**
 *
 * Handle routing an individual analysis by id
 *
 */

export default function Analysis() {
    const router = useRouter();
    const { t } = useTranslation("analyses");
    const analysisRecordFields = analysisFields(t);
    const selectedPage = 0;
    const selectedRowsPerPage =
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.ANALYSES.PAGE_SIZE)) ||
        100;
    const selectedOrder = constants.SORT_DESCENDING;
    const selectedOrderBy = analysisRecordFields.START_DATE.key;
    const selectedPermFilter = null;
    const selectedTypeFilter = null;

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage, permFilter, appTypeFilter) => {
            router.push(
                getListingPath(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    permFilter,
                    appTypeFilter
                )
            );
        },
        [router]
    );

    return (
        <AnalysisSubmissionLanding
            baseId="analyses"
            id={router.query?.analysisId}
        />
    );
}

Analysis.getInitialProps = async () => ({
    namespacesRequired: ["analyses"],
});

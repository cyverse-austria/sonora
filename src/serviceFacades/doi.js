import callApi from "../common/callApi";
const DOI_LISTING_QUERY_KEY = "fetchDOIListing";
const REQUEST_DETAILS_QUERY_KEY = "fetchRequestDetails";

function adminGetDOIRequests(key, { rowsPerPage, orderBy, order, page }) {
    return callApi({
        endpoint: "/api/admin/permanent-id-requests",
        params: {
            limit: rowsPerPage,
            "sort-field": orderBy,
            "sort-dir": order.toUpperCase(),
            offset: rowsPerPage * page,
        },
        method: "GET",
    });
}

function adminGetRequestDetails(key, { id }) {
    return callApi({
        endpoint: `/api/admin/permanent-id-requests/${id}`,
        method: "GET",
    });
}
function adminUpdateDOIRequestStatus({ id, status, comments }) {
    return callApi({
        endpoint: `/api/admin/permanent-id-requests/${id}/status`,
        method: "POST",
        body: {
            status,
            comments,
        },
    });
}

function adminCreateDOI(id) {
    return callApi({
        endpoint: `/api/admin/permanent-id-requests/${id}/ezid`,
        method: "POST",
    });
}

function createDOIRequest(request) {
    return callApi({
        endpoint: `/api/permanent-id-requests`,
        method: "POST",
        body: request,
    });
}

export {
    adminGetDOIRequests,
    adminGetRequestDetails,
    adminUpdateDOIRequestStatus,
    adminCreateDOI,
    createDOIRequest,
    DOI_LISTING_QUERY_KEY,
    REQUEST_DETAILS_QUERY_KEY,
};

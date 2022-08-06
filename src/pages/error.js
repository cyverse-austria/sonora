/**
 * @author sriram
 *
 * A page that display error to the user.
 *
 *
 */
import React from "react";
import { useRouter } from "next/router";
import { serverSideTranslations, RequiredNamespaces } from "i18n";
import ErrorHandler from "components/error/ErrorHandler";

export default function Error() {
    const router = useRouter();
    const errorInfo = router.query?.errorInfo;
    const errorObj = errorInfo ? JSON.parse(errorInfo) : null;
    return <ErrorHandler errorObject={errorObj} baseId="error" />;
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "util",
                ...RequiredNamespaces,
            ])),
        },
    };
}

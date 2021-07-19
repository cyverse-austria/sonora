/**
 * An App Editor component for previewing App Launch groups and parameters.
 *
 * @author psarando
 */
import React from "react";

import { Formik } from "formik";

import { useTranslation } from "i18n";

import { ParamGroupForm as PreviewParamGroup } from "components/apps/launch/ParamGroups";
import { initGroupValues } from "components/apps/launch/formatters";
import validate from "components/apps/launch/validate";

import buildID from "components/utils/DebugIDUtil";

export default function ParametersPreview(props) {
    const { baseId, groups } = props;

    const { t } = useTranslation(["launch", "data"]);

    const previewGroups = initGroupValues(groups)?.map((group) => ({
        ...group,
        id: group.id || group.key,
        parameters: group.parameters?.map((param) => ({
            ...param,
            id: param.id || param.key,
        })),
    }));

    return (
        <Formik
            enableReinitialize
            initialValues={{ groups: previewGroups }}
            validate={validate(t)}
        >
            {({ values }) =>
                values.groups?.map((group, index) => {
                    return (
                        <PreviewParamGroup
                            key={group.id}
                            index={index + 1}
                            noOfGroups={groups?.length}
                            baseId={buildID(baseId, index + 1)}
                            fieldName={`groups.${index}`}
                            group={group}
                        />
                    );
                })
            }
        </Formik>
    );
}

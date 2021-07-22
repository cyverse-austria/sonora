/**
 * A form component for editing the App parameter `isVisible` property.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import ids from "../../ids";

import buildID from "components/utils/DebugIDUtil";
import FormCheckbox from "components/forms/FormCheckbox";

export default function VisibleField(props) {
    const { baseId, fieldName, ...custom } = props;

    const { t } = useTranslation("app_editor");

    return (
        <FastField
            id={buildID(baseId, ids.PARAM_FIELDS.VISIBLE)}
            name={`${fieldName}.isVisible`}
            label={t("isVisible")}
            component={FormCheckbox}
            {...custom}
        />
    );
}

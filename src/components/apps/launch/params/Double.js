/**
 * Form field for displaying Double parameters.
 *
 * @author psarando
 */
import React from "react";

import FormNumberField from "components/forms/FormNumberField";

export default function Double({ param, ...props }) {
    return (
        <FormNumberField
            size="small"
            label={param?.label}
            helperText={param?.description}
            required={param?.required}
            {...props}
        />
    );
}

import {
  genericBooleanRule,
  genericIntegerRule,
  genericStringRule,
} from "../../helpers";

export const createServiceValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule("name", {
      requiredType: "string",
      warnings: "This field doesn't exist, is not a string or is empty.",
    }),
    genericIntegerRule("budget", {
      requiredType: "int",
      warnings: "This field doesn't exist, is not a integer or is empty.",
    }),
    ...newRules,
  ];
};

export const findServiceValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["page", "pageSize"],
      {
        requiredType: "int",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      ...newRules
    ),
  ];
};

export const updateServiceValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(["id", "budget"], {
      requiredType: "int",
      warnings: "This field doesn't exist, is not a integer or is empty.",
    }),
    genericStringRule(
      "name",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      ...newRules
    ),
    genericBooleanRule("enabled", {
      requiredType: "boolean",
      warnings: "This field doesn't exist, is not a boolean or is empty.",
    }),
    ...newRules,
  ];
};

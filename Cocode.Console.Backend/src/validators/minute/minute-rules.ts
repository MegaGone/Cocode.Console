import {
  genericIntegerRule,
  genericQueryParamIdRule,
  genericStringRule,
} from "../../helpers";
import { PARAM_LOCATION } from "../../typings";

export const createMinuteValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(["description"], {
      requiredType: "string",
      warnings: "This field doesn't exist, is not a string or is empty.",
    }),
    ...newRules,
  ];
};

export const findMinutesValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["page", "pageSize"],
      {
        requiredType: "int",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {}
    ),
    ...newRules,
  ];
};

export const disableMinuteValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericQueryParamIdRule(
      "id",
      {
        location: PARAM_LOCATION.HEADER,
        warnings: "This field doesn't exist, is not a integer or is empty",
      },
      true
    ),
    ...newRules,
  ];
};

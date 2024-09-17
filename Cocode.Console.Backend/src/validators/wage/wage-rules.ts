import {
  genericFloatRule,
  genericStringRule,
  genericIntegerRule,
  genericQueryParamIdRule,
} from "../../helpers";
import { PARAM_LOCATION } from "../../typings";

export const registerWageValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      ["description", "user", "service"],
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null
    ),
    genericFloatRule(
      "amount",
      {
        requiredType: "float",
        warnings: "This field doesn't exist, is not a float or is empty.",
      },
      {}
    ),
    ...newRules,
  ];
};

export const updateWageStatusValidationRules = (
  additionalRules: any = null
) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["id", "status"],
      {
        requiredType: "float",
        warnings: "This field doesn't exist, is not a float or is empty.",
      },
      {}
    ),
    ...newRules,
  ];
};

export const deleteWageValidationRules = (additionalRules: any = null) => {
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

export const findWagesPaginatedValidationRules = (
  additionalRules: any = null
) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["page", "pageSize"],
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty",
      },
      true
    ),
    ...newRules,
  ];
};

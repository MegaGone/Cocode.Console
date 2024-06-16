import {
  genericStringRule,
  genericIntegerRule,
  genericQueryParamIdRule,
  genericBooleanRule,
} from "../../helpers";
import { PARAM_LOCATION } from "../../typings";

export const createUserValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(["firstName", "lastName", "email", "password"], {
      requiredType: "string",
      warnings: "This field doesn't exist, is not a string or is empty.",
    }),
    genericIntegerRule("role", {
      requiredType: "int",
      warnings: "This field doesn't exist, is not a int or is empty.",
    }),
    ...newRules,
  ];
};

export const getUserValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericQueryParamIdRule("userId", {
      warnings:
        "The ID doesn't exist in the queryparam, is not a int or is empty.",
      location: PARAM_LOCATION.QUERY_PARAM,
    }),
    ...newRules,
  ];
};

export const updateUserValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(["firstName", "lastName"], {
      requiredType: "string",
      warnings: "This field doesn't exist, is not a string or is empty.",
    }),
    genericIntegerRule(["id", "role"], {
      requiredType: "int",
      warnings: "This field doesn't exist, is not a integer or is empty.",
    }),
    genericStringRule(
      "password",
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
      false
    ),
    ...newRules,
  ];
};

export const getUsersValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule("roleId", {
      requiredType: "integer",
      warnings: "This field doesn't exist, is not a integer or is empty.",
    }),
    genericIntegerRule(
      ["pageSize", "page"],
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {},
      false
    ),
    ...newRules,
  ];
};

export const updateStatusValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule("userId", {
      requiredType: "integer",
      warnings: "This field doesn't exist, is not a integer or is empty.",
    }),
    genericBooleanRule("status", {
      requiredType: "boolean",
      warnings: "This field doesn't exist, is not a boolean or is empty.",
    }),
    newRules,
  ];
};

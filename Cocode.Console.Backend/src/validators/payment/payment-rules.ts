import { genericIntegerRule, genericStringRule } from "../../helpers";

export const createPaymentValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(["description", "email"], {
      requiredType: "string",
      warnings: "This field doesn't exist, is not a string or is empty.",
    }),
    genericStringRule(
      ["photo", "paymentType"],
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null,
      false
    ),
    genericIntegerRule(["amount", "month", "userId", "serviceId"], {
      requiredType: "integer",
      warnings: "This field doesn't exist, is not a integer or is empty.",
    }),
    ...newRules,
  ];
};

export const getPaymentsValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule("userId", {
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

export const approvePaymentValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["userId", "paymentId"],
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {}
    ),
    ...newRules,
  ];
};

export const denyPaymentValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["userId", "paymentId"],
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {}
    ),
    ...newRules,
  ];
};

export const cancelPaymentValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericIntegerRule(
      ["userId", "paymentId"],
      {
        requiredType: "integer",
        warnings: "This field doesn't exist, is not a integer or is empty.",
      },
      {}
    ),
    ...newRules,
  ];
};

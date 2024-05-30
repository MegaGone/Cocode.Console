import { genericStringRule } from "../../helpers";

export const createServiceValidationRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule("name", {
      requiredType: "string",
      warnings: "This field doesn't exist, is not a string or is empty.",
    }),
    ...newRules,
  ];
};

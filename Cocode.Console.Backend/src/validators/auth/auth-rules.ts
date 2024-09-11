import { genericStringRule } from "../../helpers";

export const loginValidatonRules = (additionalRules: any = null) => {
  const newRules = additionalRules || [];

  return [
    genericStringRule(
      ["email", "dpi"],
      {
        requiredType: "string",
        warnings: "This field doesn't exist, is not a string or is empty.",
      },
      null
    ),
    ...newRules,
  ];
};

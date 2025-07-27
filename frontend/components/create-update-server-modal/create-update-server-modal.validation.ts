import * as Yup from "yup";

export const createServerValidation = (t: any) => {
  const validation = Yup.object({
    image: Yup.string().required(t("required")),
    name: Yup.string().required(t("required")),
  });

  return { validation };
};

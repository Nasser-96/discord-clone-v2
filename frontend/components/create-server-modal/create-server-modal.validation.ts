import * as Yup from "yup";
import { useTranslation } from "react-i18next";

export const createServerValidation = (t: any) => {
  const validation = Yup.object({
    image: Yup.string().required(t("required")),
    name: Yup.string().required(t("required")),
  });

  return { validation };
};

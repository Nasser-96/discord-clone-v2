import { ChannelTypeEnum } from "@/core/types&enums/enums";
import * as Yup from "yup";

export const createChannelValidation = (t: any) => {
  const validation = Yup.object({
    name: Yup.string()
      .matches(/^(?!general$)/i, t("notGeneral"))
      .required(t("required")),
    channelType: Yup.string()
      .oneOf(
        [ChannelTypeEnum.AUDIO, ChannelTypeEnum.TEXT, ChannelTypeEnum.VIDEO],
        t("channelTypeError")
      )
      .required(t("required")),
  });

  return { validation };
};

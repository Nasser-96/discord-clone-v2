import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import { useTranslations } from "next-intl";
import InputField from "../shared/InputField";
import Select from "../shared/Select";
import { ChannelTypeEnum, ColorEnum } from "@/core/types&enums/enums";
import { useFormik } from "formik";
import {
  ChannelType,
  CreateChannelRequestType,
} from "@/core/types&enums/types";
import { createChannelValidation } from "./create-update-channel-modal.validation";

interface CreateChannelModalProps {
  isLoading: boolean;
  channelData?: ChannelType;
  closeModal: () => void;
  createChannel: (data: CreateChannelRequestType) => void;
  updateChannel?: (data: CreateChannelRequestType) => void;
}

export default function CreateUpdateChannelModal({
  isLoading,
  channelData,
  closeModal,
  createChannel,
  updateChannel,
}: CreateChannelModalProps) {
  const t = useTranslations("createUpdateChannelModal");
  const error = useTranslations("error");
  const { validation } = createChannelValidation(error);
  const selectValues = [
    { value: ChannelTypeEnum.TEXT, label: t(ChannelTypeEnum.TEXT) },
    { value: ChannelTypeEnum.AUDIO, label: t(ChannelTypeEnum.AUDIO) },
    { value: ChannelTypeEnum.VIDEO, label: t(ChannelTypeEnum.VIDEO) },
  ];
  const isEditing = !!channelData?.id;

  const formik = useFormik<CreateChannelRequestType>({
    initialValues: {
      channelType: isEditing ? channelData?.channelType : ChannelTypeEnum.TEXT,
      name: isEditing ? channelData?.name : "",
    },
    validationSchema: validation,
    onSubmit: (values) => {
      if (isEditing) {
        if (!updateChannel) {
          console.error("Update channel function is not provided.");
          return;
        }
        updateChannel(values);
        return;
      } else {
        createChannel(values);
      }
    },
  });

  const handleSelectClick = (value: string) => {
    formik.setFieldValue("channelType", value);
  };

  return (
    <Modal>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center w-full justify-end">
          <Button
            onClick={() => closeModal()}
            className="border-none !p-0 !bg-transparent"
          >
            <IoClose size={25} />
          </Button>
        </div>
        <div className="flex items-center">
          <h1 className="font-bold w-full text-2xl text-center">
            {t("title")}
          </h1>
        </div>
        <div className="flex flex-col gap-7">
          <InputField
            aria-label={t("name")}
            placeholder={t("namePlaceholder")}
            value={formik.values.name}
            onChange={formik.handleChange}
            name="name"
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""
            }
            onBlur={formik.handleBlur}
          />
          <Select
            value={formik.values.channelType}
            placeholder={t("channelTypePlaceholder")}
            label={t("channelType")}
            values={selectValues}
            isDisabled={isEditing}
            onClick={handleSelectClick}
          />
        </div>
        <div className="flex mt-5 w-full">
          <Button
            disabled={!formik.isValid}
            isLoading={isLoading}
            type="submit"
            className="w-full"
            color={ColorEnum.PRIMARY}
          >
            {t(isEditing ? "updateChannel" : "create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

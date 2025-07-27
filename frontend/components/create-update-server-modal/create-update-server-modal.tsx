"use client";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import UploadImage from "../shared/UploadImage";
import InputField from "../shared/InputField";
import { ColorEnum } from "@/core/types&enums/enums";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import {
  CreateServerFormType,
  CreateServerResponseType,
  ReturnResponseType,
} from "@/core/types&enums/types";
import { createServerValidation } from "./create-update-server-modal.validation";
import { useState } from "react";
import {
  createServerService,
  updateServerService,
} from "@/core/model/services";

interface CreateServerModalProps {
  serverData?: CreateServerResponseType;
  closeModal: (createdServer?: CreateServerResponseType) => void;
}

export default function CreateUpdateServerModal({
  serverData,
  closeModal,
}: CreateServerModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("createUpdateServerModal");
  const errorTranslation = useTranslations("error");
  const { validation } = createServerValidation(errorTranslation);
  const formik = useFormik<CreateServerFormType>({
    initialValues: {
      image: serverData?.image ?? "",
      name: serverData?.name ?? "",
    },
    validationSchema: validation,
    onSubmit: (values) => {
      if (serverData?.id) {
        updateServer(values);
      } else {
        handleSubmit(values);
      }
    },
  });

  const updateServer = async (values: CreateServerFormType) => {
    if (!serverData) {
      return;
    }

    const data: CreateServerFormType = {
      image: values.image,
      name: values.name,
    };

    setIsLoading(true);
    try {
      const updatedServer: ReturnResponseType<CreateServerResponseType> =
        await updateServerService(data, serverData?.id);
      closeModal(updatedServer?.response);
    } catch (error) {}
    setIsLoading(false);
  };

  const handleSubmit = async (values: CreateServerFormType) => {
    setIsLoading(true);
    try {
      const createdServer: ReturnResponseType<CreateServerResponseType> =
        await createServerService(values);

      closeModal(createdServer?.response);
    } catch (error) {
      console.error("Error creating server:", error);
    }
    setIsLoading(false);
  };

  const handleImageChange = (image_url: string) => {
    formik.setFieldValue("image", image_url);
  };

  const handleDeleteImage = () => {
    formik.setFieldValue("image", "");
  };

  return (
    <Modal>
      <div className="flex flex-col gap-2">
        <div className="flex items-center w-full justify-end">
          <Button onClick={() => closeModal()} className="border-none">
            <IoClose size={25} />
          </Button>
        </div>
        <div className="flex items-center">
          <h1 className="font-bold w-full text-2xl text-center">
            {t(serverData?.id ? "updateServer" : "title")}
          </h1>
        </div>
        <h2 className="text-lg text-center mt-3 opacity-55">{t("subTitle")}</h2>
        <form
          className="mt-4 w-full flex items-center justify-center gap-3 flex-col"
          onSubmit={formik.handleSubmit}
        >
          <UploadImage
            image={formik?.values?.image}
            error={formik?.errors?.image ?? ""}
            onChange={handleImageChange}
            deleteImage={handleDeleteImage}
          />
          <InputField
            name="name"
            aria-label={t("nameLabel")}
            placeholder={t("namePlaceholder")}
            type="text"
            className="!w-full"
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ""
            }
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <Button
            isLoading={isLoading}
            color={ColorEnum.PRIMARY}
            type="submit"
            className="self-end mt-3 w-full lg:w-fit"
          >
            {t(serverData?.id ? "updateServer" : "create")}
          </Button>
        </form>
      </div>
    </Modal>
  );
}

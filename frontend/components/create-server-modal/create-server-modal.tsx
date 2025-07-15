"use client";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import UploadImage from "../shared/UploadImage";
import InputField from "../shared/InputField";
import { ColorEnum } from "@/core/types&enums/enums";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import { CreateServerFormType } from "@/core/types&enums/types";
import { createServerValidation } from "./create-server-modal.validation";
import { useState } from "react";

interface CreateServerModalProps {
  closeModal: () => void;
}

export default function CreateServerModal({
  closeModal,
}: CreateServerModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("createServerModal");
  const errorTranslation = useTranslations("error");
  const { validation } = createServerValidation(errorTranslation);
  const formik = useFormik<CreateServerFormType>({
    initialValues: {
      image: "",
      name: "",
    },
    validationSchema: validation,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values: CreateServerFormType) => {
    console.log(values);
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
        <div className="flex items-center">
          <h1 className="font-bold w-full text-2xl text-center">
            {t("title")}
          </h1>
          <Button onClick={closeModal} className="border-none">
            <IoClose size={25} />
          </Button>
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
            {t("create")}
          </Button>
        </form>
      </div>
    </Modal>
  );
}

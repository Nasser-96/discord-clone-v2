import { ChangeEvent, useRef, useState } from "react";
import { IoMdCloudUpload } from "@react-icons/all-files/io/IoMdCloudUpload";
import { uploadImageService } from "@/core/model/services";
import {
  ReturnResponseType,
  UploadImageResponseType,
} from "@/core/types&enums/types";
import ComponentLoader from "./loader";
import Image from "next/image";

import { IoClose } from "@react-icons/all-files/io5/IoClose";
import { getTransitionClass } from "@/helpers";
import { useTranslations } from "next-intl";

interface UploadImageProps {
  image: string;
  error: string;
  onChange: (image_url: string) => void;
  deleteImage?: () => void;
}

export default function UploadImage({
  image,
  error,
  onChange,
  deleteImage,
}: UploadImageProps) {
  const t = useTranslations("uploadImage");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);

    if (!event.target.files) {
      setIsLoading(false);
      return;
    }

    const file = event.target.files[0];
    if (!file) return;
    try {
      if (!file) return;
      const image: ReturnResponseType<UploadImageResponseType> =
        await uploadImageService(file);
      onChange(image?.response?.image_url);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center">
      {image ? (
        <div className="relative">
          <Image
            width={"100"}
            height={"100"}
            src={image}
            alt="uploaded image"
            className="rounded-full mx-auto object-fill aspect-square"
          />
          {deleteImage && (
            <button
              className="absolute top-0 right-0 rounded-full bg-rose-500 text-white p-1"
              title="delete image"
              type="button"
              onClick={deleteImage}
            >
              <IoClose size={20} />
            </button>
          )}
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute w-full h-full left-0 top-0 flex items-center justify-center bg-black/50 rounded-md">
              <ComponentLoader />
            </div>
          )}
          <button
            type="button"
            title="upload image"
            className={`w-full mx-auto flex flex-col items-center justify-center border rounded-md py-5 
                ${getTransitionClass}
                ${error ? "border-red-400" : "border-indigo-500"}
              `}
            onClick={() => {
              if (!fileRef.current) return;
              fileRef.current.value = "";
              fileRef.current.click();
            }}
          >
            <IoMdCloudUpload size={70} />
            <h1 className="text-2xl text-indigo-500 mt-5">{t("title")}</h1>
          </button>
          {error && <p className="text-red-400 w-full text-sm mt-2">{error}</p>}
          <input
            type="file"
            className="hidden"
            aria-label="upload image file"
            ref={fileRef}
            onChange={(e) => uploadFile(e)}
          />
        </>
      )}
    </div>
  );
}

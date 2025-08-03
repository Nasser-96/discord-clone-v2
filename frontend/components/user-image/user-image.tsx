import { FaRegUserCircle } from "@react-icons/all-files/fa/FaRegUserCircle";
import Image from "next/image";

interface UserImageProps {
  image?: string;
}
export default function UserImage({ image }: UserImageProps) {
  return image ? (
    <Image alt="Channel" fill sizes="auto" priority src={image} />
  ) : (
    <FaRegUserCircle className="text-discord-muted" size={30} />
  );
}

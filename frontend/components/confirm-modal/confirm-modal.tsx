import { ColorEnum } from "@/core/types&enums/enums";
import Modal from "../shared/Modal";
import Button from "../shared/Button";

interface ConfirmModalProps {
  title: string;
  confirmText: string;
  cancelText: string;
  confirmButtonColor?: ColorEnum;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  cancelText,
  confirmText,
  title,
  confirmButtonColor = ColorEnum.PRIMARY,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal>
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">{title}</h1>
        <div className="flex items-center justify-center gap-5">
          <Button onClick={onCancel} color={ColorEnum.DARK}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm} color={confirmButtonColor}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

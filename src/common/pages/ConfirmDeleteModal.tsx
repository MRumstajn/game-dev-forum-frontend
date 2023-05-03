import { Modal, UseModal } from "@tiller-ds/alert";
import { Button, Typography } from "@tiller-ds/core";

type ConfirmDeleteModalProps = {
  modal: UseModal<unknown>;
  confirmCallback: () => void;
  cancelCallback?: () => void;
};

export function ConfirmDeleteModal({
  modal,
  confirmCallback,
  cancelCallback,
}: ConfirmDeleteModalProps) {
  return (
    <Modal {...modal}>
      <Modal.Content title="Confirm delete">
        <Typography variant="text" element="p" className="mb-3">
          Are you sure you want to delete this resource?
        </Typography>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex flex-row justify-end gap-x-3">
          <Button
            variant="filled"
            color="danger"
            onClick={() => {
              confirmCallback();
              modal.onClose();
            }}
          >
            Yes
          </Button>
          <Button
            variant="filled"
            color="success"
            onClick={() => {
              if (cancelCallback) {
                cancelCallback();
              }

              modal.onClose();
            }}
          >
            No
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

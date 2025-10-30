import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAction } from "../../../actions/notesActions";

const DeleteNoteModal = ({ show, handleClose, note }) => {
  const dispatch = useDispatch();

  const noteDelete = useSelector((state) => state.noteDelete);
  const { loading: loadingDelete, success: successDelete } = noteDelete;

  // ✅ Auto-close modal on successful delete
  useEffect(() => {
    if (successDelete) {
      handleClose();
    }
  }, [successDelete, handleClose]);

  const handleDeleteConfirmed = () => {
    if (note) {
      dispatch(deleteNoteAction(note._id));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Note</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete{" "}
        <strong>{note?.title || "this note"}</strong>?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="success" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteConfirmed}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteNoteModal;

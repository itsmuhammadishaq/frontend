import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAction } from "../../../actions/notesActions";

const DeleteNoteModal = ({ show, handleClose, note }) => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector((state) => state.noteDelete);

  useEffect(() => {
    if (success) handleClose();
  }, [success, handleClose]);

  const handleDelete = () => {
    if (note?._id) dispatch(deleteNoteAction(note._id));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <strong>{note?.title}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteNoteModal;

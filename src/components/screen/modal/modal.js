import React, { useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAction } from "../../../actions/notesActions";
import { FaTrashAlt, FaTimes } from "react-icons/fa";

const DeleteNoteModal = ({ show, handleClose, note }) => {
  const dispatch = useDispatch();

  const noteDelete = useSelector((state) => state.noteDelete);
  const { loading: loadingDelete, success: successDelete } = noteDelete;

  // ✅ Auto-close when delete is successful
  useEffect(() => {
    if (successDelete) handleClose();
  }, [successDelete, handleClose]);

  const handleDeleteConfirmed = () => {
    if (note) {
      dispatch(deleteNoteAction(note._id));
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={!loadingDelete}
      className="delete-note-modal"
    >
      <Modal.Header
        closeButton
        style={{
          borderBottom: "none",
          paddingBottom: 0,
        }}
      >
        <Modal.Title
          style={{
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          Delete Note
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          textAlign: "center",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <FaTrashAlt
          size={36}
          color="#dc3545"
          style={{ marginBottom: "1rem" }}
        />
        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "0.5rem" }}>
          Are you sure you want to delete
        </p>
        <strong style={{ color: "#000" }}>
          {note?.title || "this note"}?
        </strong>
        <p style={{ fontSize: "0.9rem", color: "#777", marginTop: "0.75rem" }}>
          This action cannot be undone.
        </p>
      </Modal.Body>

      <Modal.Footer
        style={{
          borderTop: "none",
          justifyContent: "center",
          gap: "0.75rem",
          paddingBottom: "1.25rem",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={loadingDelete}
          style={{
            minWidth: "100px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
          }}
        >
          <FaTimes size={14} />
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={handleDeleteConfirmed}
          disabled={loadingDelete}
          style={{
            minWidth: "110px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
          }}
        >
          {loadingDelete ? (
            <>
              <Spinner animation="border" size="sm" />
              Deleting...
            </>
          ) : (
            <>
              <FaTrashAlt size={14} />
              Delete
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteNoteModal;

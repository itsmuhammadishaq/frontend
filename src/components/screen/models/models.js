import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createNoteAction,
  updateNoteAction,
} from "../../../actions/notesActions";
import ErrorMessage from "../../ErrorMessage";
import { FaPlus, FaRedo, FaEdit } from "react-icons/fa";

function NoteModal({ show, handleClose, mode = "create", noteData = null }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const noteCreate = useSelector((state) => state.noteCreate);
  const noteUpdate = useSelector((state) => state.noteUpdate);

  const { loading: loadingCreate, error: errorCreate } = noteCreate;
  const { loading: loadingUpdate, error: errorUpdate } = noteUpdate;

  // ✅ Pre-fill fields when editing
  useEffect(() => {
    if (mode === "edit" && noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setCategory(noteData.category);
    } else {
      setTitle("");
      setContent("");
      setCategory("");
    }
  }, [mode, noteData, show]);

  const resetHandler = () => {
    setTitle("");
    setContent("");
    setCategory("");
  };

  // ✅ Submit Handler (Create / Edit)
  const submitHandler = (e) => {
    e.preventDefault();
    if (!title || !content || !category) return;

    if (mode === "create") {
      dispatch(createNoteAction(title, content, category));
    } else {
      dispatch(updateNoteAction(noteData._id, title, content, category));
    }

    handleClose();
    resetHandler();
  };

  const isLoading = loadingCreate || loadingUpdate;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={!isLoading}
    >
      {/* Header */}
      <Modal.Header
        closeButton
        style={{
          borderBottom: "none",
          background: "#f8f9fa",
        }}
      >
        <Modal.Title style={{ fontWeight: 600, fontSize: "1.25rem" }}>
          {mode === "create" ? "Create New Note" : "Edit Note"}
        </Modal.Title>
      </Modal.Header>

      {/* Body */}
      <Modal.Body
        style={{
          padding: "1.5rem",
          backgroundColor: "#fff",
        }}
      >
        {(errorCreate || errorUpdate) && (
          <ErrorMessage variant="danger">
            {errorCreate || errorUpdate}
          </ErrorMessage>
        )}

        <Form onSubmit={submitHandler}>
          {/* Title */}
          <Form.Group controlId="title" className="mb-3">
            <Form.Label style={{ fontWeight: 500 }}>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                borderRadius: "8px",
                borderColor: "#ccc",
                padding: "10px",
              }}
            />
          </Form.Group>

          {/* Content */}
          <Form.Group controlId="content" className="mb-3">
            <Form.Label style={{ fontWeight: 500 }}>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write your note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                borderRadius: "8px",
                borderColor: "#ccc",
                padding: "10px",
              }}
            />
          </Form.Group>

          {/* Category */}
          <Form.Group controlId="category" className="mb-4">
            <Form.Label style={{ fontWeight: 500 }}>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                borderRadius: "8px",
                borderColor: "#ccc",
                padding: "10px",
              }}
            />
          </Form.Group>

          {/* Buttons */}
          <div
            className="d-flex justify-content-end gap-2"
            style={{ marginTop: "1rem" }}
          >
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              style={{
                minWidth: "110px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
              }}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" /> Saving...
                </>
              ) : mode === "create" ? (
                <>
                  <FaPlus size={13} /> Create
                </>
              ) : (
                <>
                  <FaEdit size={13} /> Update
                </>
              )}
            </Button>

            <Button
              variant="outline-success"
              onClick={resetHandler}
              disabled={isLoading}
              style={{
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
              }}
            >
              <FaRedo size={13} /> Reset
            </Button>
          </div>
        </Form>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer
        style={{
          borderTop: "none",
          background: "#f8f9fa",
          justifyContent: "center",
          fontSize: "0.85rem",
          color: "#6c757d",
        }}
      >
        {mode === "create" ? "Creating" : "Editing"} on{" "}
        {new Date().toLocaleDateString()}
      </Modal.Footer>
    </Modal>
  );
}

export default NoteModal;

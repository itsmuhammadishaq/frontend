import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { createNoteAction, updateNoteAction } from "../../../actions/notesActions";
import ErrorMessage from "../../ErrorMessage";
import Loading from "../../Loading";

function NoteModal({ show, handleClose, mode = "create", noteData = null }) {
  const dispatch = useDispatch();

  // Local states for form fields
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

  // Reset handler
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
    } else if (mode === "edit") {
      dispatch(updateNoteAction(noteData._id, title, content, category));
    }

    handleClose();
    resetHandler();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === "create" ? "Create Note" : "Edit Note"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={submitHandler}>
          {(errorCreate || errorUpdate) && (
            <ErrorMessage variant="danger">{errorCreate || errorUpdate}</ErrorMessage>
          )}

          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              placeholder="Enter the title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="content" className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={content}
              placeholder="Enter the content"
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          {content && (
            <Card className="mb-3">
              <Card.Header>Note Preview</Card.Header>
              <Card.Body>
                <ReactMarkdown>{content}</ReactMarkdown>
              </Card.Body>
            </Card>
          )}

          <Form.Group controlId="category" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              placeholder="Enter the category"
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          {(loadingCreate || loadingUpdate) && <Loading size={50} />}

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary">
              {mode === "create" ? "Create" : "Update"}
            </Button>
            <Button variant="success" className="ms-2" onClick={resetHandler}>
              Reset
            </Button>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <small>{mode === "create" ? "Creating" : "Editing"} on - {new Date().toLocaleDateString()}</small>
      </Modal.Footer>
    </Modal>
  );
}

export default NoteModal;

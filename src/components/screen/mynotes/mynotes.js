import React, { useEffect, useState } from "react";
import MainScreen from "../../mainscreen";
import {
  Button,
  Card,
  Badge,
  Accordion,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listNotes } from "../../../actions/notesActions";
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";
import axios from "axios";
import NoteModal from "../models/models";
import DeleteNoteModal from "../modal/modal";
import { useNavigate } from "react-router-dom";

const MyNotes = () => {
  const [checkedNotes, setCheckedNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [localNotes, setLocalNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Use default empty array to avoid filter errors
  const { loading, notes = [], error } = useSelector((state) => state.noteList);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { success: successCreate } = useSelector((state) => state.noteCreate);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.noteDelete);

  console.log(notes, "notes");

  // ✅ Toggle note completion
  const handleCheck = async (id, e) => {
    e.stopPropagation();
    const updatedNotes = localNotes.map((note) =>
      note._id === id ? { ...note, completed: !note.completed } : note
    );
    setLocalNotes(updatedNotes);
    setCheckedNotes(updatedNotes.filter((n) => n.completed).map((n) => n._id));

    try {
      await axios.put(
        `/api/notes/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    } catch (error) {
      console.error("Error toggling note:", error);
    }
  };

  const confirmDeleteHandler = (note, e) => {
    e.stopPropagation();
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  // ✅ Load notes from backend
  useEffect(() => {
    if (!userInfo) {
      navigate("/");
      return;
    }
    dispatch(listNotes());
  }, [dispatch, successCreate, navigate, userInfo, successDelete]);

  // ✅ Sync local notes with redux
  useEffect(() => {
    if (Array.isArray(notes)) {
      setLocalNotes(notes);
      setCheckedNotes(notes.filter((n) => n.completed).map((n) => n._id));
    } else {
      setLocalNotes([]);
      setCheckedNotes([]);
    }
  }, [notes]);

  // ✅ Sorting & filtering
  const sortedNotes = [...localNotes].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
  );

  const filteredNotes = sortedNotes.filter(
    (note) =>
      note.title && note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container fluid className="px-2 px-md-4">
      <MainScreen title={`Welcome Back ${userInfo?.name || ""}`}>
        {/* Modals */}
        <NoteModal
          show={open}
          handleClose={() => setOpen(false)}
          mode={modalMode}
          noteData={selectedNote}
        />
        <DeleteNoteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          note={noteToDelete}
        />
        {/* Header */}
        <Row className="align-items-center mb-3 justify-content-between g-2">
          <Col xs={12} sm={8} md={6} lg={5}>
            <Form className="w-100">
              <Form.Control
                type="search"
                placeholder="Search your notes..."
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </Col>

          <Col xs={12} sm="auto">
            <Button
              variant="primary"
              className="w-100 mt-2 mt-sm-0"
              style={{ minWidth: "150px" }}
              onClick={() => {
                setModalMode("create");
                setSelectedNote(null);
                setOpen(true);
              }}
            >
              + Create Note
            </Button>
          </Col>
        </Row>
        {/* Alerts & Loaders */}
        {errorDelete && (
          <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
        )}
        {loadingDelete && <Loading />}
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && !notes?.length && <Loading />}
        {!loading && filteredNotes.length === 0 && (
          <p className="text-center text-muted mt-4">No notes found.</p>
        )}
        {/* Notes List */}
        {filteredNotes
          .slice()
          .reverse()
          .map((note) => (
            <Accordion key={note._id} className="mb-4">
              {" "}
              <Card
                className="shadow-sm"
                style={{
                  borderRadius: "1px",
                  border: note.completed
                    ? "2px solid green"
                    : "1px solid transparent",
                }}
              >
                {" "}
                <Accordion.Header>
                  {" "}
                  <Form.Check
                    className="me-3"
                    checked={note.completed || false}
                    onChange={(e) => handleCheck(note._id, e)}
                    onClick={(e) => e.stopPropagation()}
                  />{" "}
                  <span
                    style={{
                      color: "black",
                      flex: 1,
                      cursor: "pointer",
                      fontSize: "1rem",
                      textDecoration: note.completed ? "line-through" : "none",
                    }}
                  >
                    {" "}
                    {note.title}{" "}
                  </span>{" "}
                  <div className="d-flex gap-3" style={{ marginRight: 16 }}>
                    {" "}
                    <Button
                      size="sm"
                      variant="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(note);
                        setModalMode("edit");
                        setOpen(true);
                      }}
                    >
                      {" "}
                      Edit{" "}
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={loadingDelete}
                      onClick={(e) => confirmDeleteHandler(note, e)}
                    >
                      {" "}
                      Delete{" "}
                    </Button>{" "}
                  </div>{" "}
                </Accordion.Header>{" "}
                <Accordion.Body>
                  {" "}
                  <h6>
                    {" "}
                    <Badge bg="success">Category - {note.category}</Badge>{" "}
                  </h6>{" "}
                  <blockquote className="blockquote mb-0">
                    {" "}
                    <p>{note.content}</p>{" "}
                    <footer className="blockquote-footer">
                      {" "}
                      Created on{" "}
                      <cite>
                        {" "}
                        {note.createdAt
                          ? note.createdAt.substring(0, 10)
                          : "N/A"}{" "}
                      </cite>{" "}
                    </footer>{" "}
                  </blockquote>{" "}
                </Accordion.Body>{" "}
              </Card>{" "}
            </Accordion>
          ))}{" "}
      </MainScreen>{" "}
    </Container>
  );
};

export default MyNotes;

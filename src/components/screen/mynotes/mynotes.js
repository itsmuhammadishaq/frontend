import { useEffect, useState } from "react";
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
  InputGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listNotes } from "../../../actions/notesActions";
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";
import axios from "axios";
import NoteModal from "../models/models";
import DeleteNoteModal from "../modal/modal";
import { useNavigate } from "react-router-dom";
import { Search, Edit2, Trash2, Move } from "lucide-react";
import usePageTitle from "../../../hooks/usePageTitle";
import "./mynotes.css";

// 🧩 DnD imports
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 🧱 Draggable wrapper with drag handle
const DraggableNote = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} className="draggable-note-wrapper">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="drag-handle d-flex align-items-center justify-content-center"
      >
        <Move size={18} />
      </div>
      {children}
    </div>
  );
};

const MyNotes = () => {
  usePageTitle("mynotes");
  const [search, setSearch] = useState("");
  const [localNotes, setLocalNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, notes = [], error } = useSelector((state) => state.noteList);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { success: successCreate } = useSelector((state) => state.noteCreate);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.noteDelete);

  // ✅ Toggle note completion
  const handleCheck = async (id, e) => {
    e.stopPropagation();
    const updatedNotes = localNotes.map((note) =>
      note._id === id ? { ...note, completed: !note.completed } : note
    );
    setLocalNotes(updatedNotes);

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/notes/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    } catch (error) {
      console.error("Error toggling note:", error);
    }
  };

  // ✅ Delete confirmation
  const confirmDeleteHandler = (note, e) => {
    e.stopPropagation();
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null); // reset noteToDelete
  };

  // ✅ Fetch notes
  useEffect(() => {
    if (!userInfo) {
      navigate("/");
      return;
    }
    dispatch(listNotes());
  }, [dispatch, successCreate, navigate, userInfo, successDelete]);

  // ✅ Sync notes locally
  useEffect(() => {
    if (Array.isArray(notes)) {
      setLocalNotes(notes);
    } else {
      setLocalNotes([]);
    }
  }, [notes]);

  // ✅ Handle drag reorder + backend persist
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localNotes.findIndex((n) => n._id === active.id);
    const newIndex = localNotes.findIndex((n) => n._id === over.id);

    const newOrder = arrayMove(localNotes, oldIndex, newIndex);
    setLocalNotes(newOrder);

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/notes/reorder`,
        { order: newOrder.map((n) => n._id) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log("✅ Notes order saved successfully");
    } catch (err) {
      console.error("❌ Error saving order:", err);
    }
  };

  // ✅ Sort completed notes to bottom
  const sortedNotes = [...localNotes].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
  );

  // ✅ Filter by search
  const filteredNotes = sortedNotes.filter(
    (note) =>
      note.title && note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container fluid className="px-3 px-md-4 py-3 bg-light min-vh-100">
      <MainScreen title={`Welcome Back ${userInfo?.name || ""}`}>
        {/* Modals */}
        <NoteModal
          show={open}
          handleClose={() => setOpen(false)}
          mode={modalMode}
          noteData={selectedNote}
        />
        <DeleteNoteModal
          key={noteToDelete?._id || "none"}
          show={showDeleteModal}
          handleClose={closeDeleteModal}
          note={noteToDelete}
        />

        {/* Search + Create */}
        <Row className="align-items-center mb-4 justify-content-between g-3">
          <Col xs={12} md={6}>
            <InputGroup className="shadow-sm rounded-pill overflow-hidden">
              <InputGroup.Text className="bg-white border-0 ps-3">
                <Search size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search notes..."
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 shadow-none"
              />
            </InputGroup>
          </Col>
          <Col xs={12} md="auto">
            <Button
              variant="dark"
              className="px-4 py-2 shadow-sm fw-semibold rounded-pill w-100"
              onClick={() => {
                setModalMode("create");
                setSelectedNote(null);
                setOpen(true);
              }}
            >
              + New Note
            </Button>
          </Col>
        </Row>

        {/* Alerts */}
        {errorDelete && (
          <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
        )}
        {loadingDelete && <Loading />}
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && !notes?.length && <Loading />}
        {!loading && filteredNotes.length === 0 && (
          <p className="text-center text-muted mt-5 fs-5">No notes found.</p>
        )}

        {/* 🧲 Drag & Drop Notes List */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filteredNotes.map((n) => n._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="d-flex flex-column gap-3">
              {filteredNotes
                .slice()
                .reverse()
                .map((note) => (
                  <DraggableNote key={note._id} id={note._id}>
                    <Accordion>
                      <Card
                        className={`shadow-sm rounded-3 overflow-hidden note-card ${
                          note.completed
                            ? "border-success border-3"
                            : "border-light border-1"
                        }`}
                      >
                        <Accordion.Header>
                          <div className="d-flex align-items-center w-100 justify-content-between">
                            {/* Checkbox + Title */}
                            <div className="d-flex align-items-center flex-grow-1">
                              <Form.Check
                                className="me-3"
                                checked={note.completed || false}
                                onChange={(e) => handleCheck(note._id, e)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span
                                className={`${
                                  note.completed
                                    ? "text-decoration-line-through text-muted"
                                    : ""
                                }`}
                                style={{ fontSize: "1rem", fontWeight: 500 }}
                              >
                                {note.title}
                              </span>
                            </div>

                            {/* Edit / Delete Buttons */}
                            <div className="d-flex gap-2 me-2">
                              {!note.completed && (
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNote(note);
                                    setModalMode("edit");
                                    setOpen(true);
                                  }}
                                  className="d-flex align-items-center gap-1"
                                >
                                  <Edit2 size={16} /> Edit
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline-danger"
                                disabled={loadingDelete}
                                onClick={(e) => confirmDeleteHandler(note, e)}
                                className="d-flex align-items-center gap-1"
                              >
                                <Trash2 size={16} /> Delete
                              </Button>
                            </div>
                          </div>
                        </Accordion.Header>

                        <Accordion.Body className="bg-white py-3 px-4">
                          <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
                            <Badge
                              bg="success"
                              text="light"
                              className="px-3 py-2 fw-normal"
                            >
                              {note.category || "Uncategorized"}
                            </Badge>
                            <small className="text-muted">
                              Created on{" "}
                              <strong>
                                {note.createdAt
                                  ? note.createdAt.substring(0, 10)
                                  : "N/A"}
                              </strong>
                            </small>
                          </div>
                          <p
                            className="text-secondary mb-0"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {note.content}
                          </p>
                        </Accordion.Body>
                      </Card>
                    </Accordion>
                  </DraggableNote>
                ))}
            </div>
          </SortableContext>
        </DndContext>
      </MainScreen>
    </Container>
  );
};

export default MyNotes;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";  // ✅ useParams instead of match
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { updateNoteAction } from "../../../actions/notesActions";
import MainScreen from "../../mainscreen";
import Loading from "../../Loading";
import ErrorMessage from "../../ErrorMessage";

function SingleNote() {
  const { id } = useParams(); // ✅ Extract note ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const noteUpdate = useSelector((state) => state.noteUpdate);
  const { loading, error } = noteUpdate;

  // ✅ Fetch note details
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data } = await axios.get(`/api/notes/${id}`);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setDate(data.updatedAt);
      } catch (err) {
        console.error("Failed to fetch note:", err);
      }
    };

    fetchNote();
  }, [id]);

  const resetHandler = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  const updateHandler = (e) => {
    e.preventDefault();
    if (!title || !content || !category) return;
    dispatch(updateNoteAction(id, title, content, category));
    navigate("/mynotes");
  };

  return (
    <MainScreen title="Edit Note">
      <Card>
        <Card.Header>Edit your Note</Card.Header>
        <Card.Body>
          <Form onSubmit={updateHandler}>
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter the content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>

            {content && (
              <Card>
                <Card.Header>Note Preview</Card.Header>
                <Card.Body>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </Card.Body>
              </Card>
            )}

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            {loading && <Loading size={50} />}

            <Button variant="primary" type="submit" style={{marginTop:12}}>
              Update Note
            </Button>
            <Button className="mx-2" onClick={resetHandler} variant="danger" style={{marginTop:12}}>
              Reset Fields
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          Updated on - {date ? date.substring(0, 10) : ""}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
}

export default SingleNote;


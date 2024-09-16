import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateNotice } from "../../../features/notice/noticeSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // react-quill 스타일 import

const EditNoticeDialog = ({ show, handleClose, noticeId }) => {
  const dispatch = useDispatch();
  const { notices } = useSelector((state) => state.notice);

  // Memoize the selected notice, but handle when notices are not yet loaded
  const notice = useMemo(() => {
    return notices.find((n) => n._id === noticeId) || { title: "", content: "" };
  }, [noticeId, notices]);

  // Form state for editing
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    if (show && notice) {
      // Only set form data if notice is valid and the modal is shown
      setFormData({ title: notice.title || "", content: notice.content || "" });
    }
  }, [show, notice]);

  // Title change handler
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  // Content change handler (ReactQuill)
  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  // Form submit handler
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateNotice({ id: noticeId, ...formData }));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Notice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={EditNoticeDialog.modules}
              formats={EditNoticeDialog.formats}
              placeholder="Edit content"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// ReactQuill toolbar and formats configuration
EditNoticeDialog.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    ['link', 'image'],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean'] // formatting 제거
  ],
};

EditNoticeDialog.formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
  'link', 'image', 'align', 'color', 'background'
];

export default EditNoticeDialog;

// src/components/RichTextEditor.jsx

import React, { Dispatch, SetStateAction } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

export const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      }}
      formats={[
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
      ]}
      placeholder="Enter job description..."
    />
  );
};

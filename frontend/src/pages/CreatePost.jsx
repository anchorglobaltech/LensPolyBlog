import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    image: "",
    content: "",
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    setImageUploadError(null);
    setImageUploadProgress(10);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/post/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      setFormData((prev) => ({ ...prev, image: data.imageUrl }));
      setImageUploadProgress(100);
      setTimeout(() => setImageUploadProgress(0), 1500);
    } catch (error) {
      setImageUploadError(error.message);
      setImageUploadProgress(0);
    }
  };

  const handleContentChange = (value) => {
    let sanitizedValue = DOMPurify.sanitize(value);
    setFormData((prev) => ({ ...prev, content: sanitizedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError(error.message);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],  // <-- Added text alignment options
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen flex flex-col items-center">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="w-full"
            value={formData.title}
            onChange={handleChange}
          />
          <Select id="category" className="w-full" value={formData.category} onChange={handleChange}>
            <option value="uncategorized">Uncategorized</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="News">News</option>
            <option value="Sports">Sports</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
          </Select>
        </div>

        <div className="flex flex-col items-center gap-4 border-4 border-teal-500 p-3 w-full">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress > 0}
          >
            {imageUploadProgress > 0 ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && <img src={formData.image} alt="upload" className="w-full h-72 object-cover rounded-lg" />}

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 w-full"
          required
          modules={quillModules}
          value={formData.content}
          onChange={handleContentChange}
        />

        <Button type="submit" gradientDuoTone="purpleToPink" className="self-center w-1/2">
          Publish
        </Button>
        {publishError && <Alert color="failure" className="mt-5">{publishError}</Alert>}
      </form>
    </div>
  );
};

export default CreatePost;

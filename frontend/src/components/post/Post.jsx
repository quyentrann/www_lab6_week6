import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./post.scss";

const Post = () => {
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [publish, setPublish] = useState("true");

  const navigate = useNavigate();
  const location = useLocation();

  const handleClickBtnPost = async () => {
    try {
      const dataID = await axios.get("http://localhost:8080/post/current-post-id");
      const response = await axios.post("http://localhost:8080/post", {
        id: dataID.data + 1,
        author: location.state.user,
        title: title,
        metaTitle: metaTitle,
        summary: summary,
        published: publish === "true",
        content: content,
      });
      navigate("/home", { state: { post: response.data, user: location.state.user } });
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

  return (
    <div className="container-post">
      <div className="content-posts">
        <h2 className="header">TẠO POST MỚI</h2>
        <div className="form-content">
          <label htmlFor="publish">Publish</label>
          <select
            value={publish}
            onChange={(e) => setPublish(e.target.value)}
            className="form-select"
          >
            <option value={"true"}>Công Khai</option>
            <option value={"false"}>Riêng Tư</option>
          </select>
        </div>
        <div className="form-content">
          <label htmlFor="title">Title</label>
          <textarea
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            rows={1}
            className="form-control"
          />
        </div>
        <div className="form-content">
          <label htmlFor="metaTitle">Meta Title</label>
          <textarea
            id="metaTitle"
            onChange={(e) => setMetaTitle(e.target.value)}
            value={metaTitle}
            rows={1}
            className="form-control"
          />
        </div>
        <div className="form-content">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            rows={8}
            className="form-control"
          />
        </div>
        <div className="form-content">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            onChange={(e) => setSummary(e.target.value)}
            value={summary}
            rows={8}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary" onClick={handleClickBtnPost}>
          ĐĂNG POST
        </button>
      </div>
    </div>
  );
};

export default Post;
// Home.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faThumbsUp, faComment, faShare, faPaperPlane, faGlobeAmericas, faPlus } from "@fortawesome/free-solid-svg-icons";
import Comment from "../comment/Comment";
import { useLocation, useNavigate } from "react-router-dom";
import "./home.scss";

const Home = () => {
  const [postDatas, setPostDatas] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [txtComment, setTxtComment] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const apiGetPostDatas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/post");
        const { datas } = response.data;
        setPostDatas(datas);
        setTxtComment(datas.map((dt) => ({ postID: dt.id, value: "" })));
      } catch (error) {
        console.error("Error fetching post data:", error.message);
      }
    };

    apiGetPostDatas();
  }, []);

  const PostDetailModal = ({ post, comments, handleClose }) => {
    return (
      <Modal show={!!post} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h4>{post?.title}</h4>
            <p>{post?.content}</p>
          </div>
          <hr />
          <h5>Bình luận</h5>
          {comments.map((comment) => (
            <Comment key={comment.id} cmt={comment} viewID={comment.id} user={location.state.user} />
          ))}
        </Modal.Body>
      </Modal>
    );
  };
  
  const handleClickComment = async (id) => {
    try {
      const responsePost = await axios.get(`http://localhost:8080/post/${id}`);
      const responseComments = await axios.get(`http://localhost:8080/post-comment/by-post-${id}`);
      
      setSelectedPost({
        post: responsePost.data,
        comments: responseComments.data,
      });
    } catch (error) {
      console.error("Error fetching post and comments:", error.message);
    }
  };

  const handleLikePost = (postId) => {
    if (!likedPosts.includes(postId)) {
      setLikedPosts((prev) => [...prev, postId]);
      // Gọi API hoặc thực hiện hành động like tại đây
    }
  };

  const handleUnlikePost = (postId) => {
    setLikedPosts((prev) => prev.filter((id) => id !== postId));
    // Gọi API hoặc thực hiện hành động unlike tại đây
  };

  const handleClickSend = async (post) => {
    try {
      const dataID = await axios.get(
        "http://localhost:8080/post-comment/current-post-comment-id"
      );

      await axios.post(`http://localhost:8080/post-comment/${post.id}`, {
        id: dataID.data + 1,
        title: txtComment.find((dt) => dt.postID === post.id).value.split(":")[0],
        user: location.state.user,
        published: true,
        content: txtComment.find((dt) => dt.postID === post.id).value.split(":")[1],
      });

      setTxtComment((prev) => {
        const current = [...prev];
        current.find((dt) => dt.postID === post.id).value = "";
        return current;
      });
    } catch (error) {
      console.error("Error sending comment:", error.message);
    }
  };

  const handleCreatePost = () => {
    navigate("/post", { state: { user: location.state.user } });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2 className="text-center mb-4">Các Bài Post</h2>
        </Col>
        <Col>
        <Button style={{marginLeft:"500px"}} variant="primary" className="float-right mt-1" onClick={handleCreatePost}>
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Tạo Mới
      </Button></Col>
      </Row>
      <Row xs={1} md={2} lg={2} className="g-4">
        {postDatas
          .filter((p) => p.published === true)
          .map((post) => (
            <Col key={post.id}>
              <Card className="content-blog">
                <Card.Body>
                  <div className="content-user mb-3">
                    <div style={{flexDirection:"row"}}>
                    <FontAwesomeIcon icon={faUser} size="2x" className="mr-2" style={{ color: "gray" }}/>
                    <span style={{marginLeft:"10px", fontSize:"20px", fontWeight:"bold"}} className="name">{`${post.author.firstName} ${post.author.middleName} ${post.author.lastName}`}</span>
                    </div>
                   
                    <div className="content-name-public">
                     
                      <div className="d-flex align-items-center">
                        <span>{`${post.publishedAt.slice(11, 16)} ${post.publishedAt.slice(
                          8,
                          10
                        )}-${post.publishedAt.slice(5, 7)}-${post.publishedAt.slice(0, 4)}`}</span>
                        <FontAwesomeIcon icon={faGlobeAmericas} size="sm" className="ml-2" style={{ color: "green" }} />
                      </div>
                    </div>
                  </div>
                  <div className="blog mb-3">
                    <Card.Title className="font-weight-bold">{post.title}</Card.Title>
                    <Card.Text>{post.metaTitle}</Card.Text>
                    <Card.Text>{post.content}</Card.Text>
                    <Card.Text>{post.summary}</Card.Text>
                  </div>
                  <div className="like-comments-share d-flex justify-content-between">
                    <div className="content-feature">
                      {likedPosts.includes(post.id) ? (
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          size="lg"
                          className="mr-1 text-primary"
                          style={{ color: "blue" }}
                          onClick={() => handleUnlikePost(post.id)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          size="lg"
                          className="mr-1"
                          style={{ color: "black" }}
                          onClick={() => handleLikePost(post.id)}
                        />
                      )}
                      <span>{likedPosts.includes(post.id) ? "Liked" : "Like"}</span>
                    </div>
                    <div
                      className="content-feature"
                      onClick={() => handleClickComment(post.id)}
                    >
                      <FontAwesomeIcon icon={faComment} size="lg" className="mr-1" style={{ color: "green" }}/>
                      <span>Comment</span>
                    </div>
                    <div className="content-feature">
                      <FontAwesomeIcon icon={faShare} size="lg" className="mr-1" style={{ color: "red" }}/>
                      <span>Share</span>
                    </div>
                  </div>
                  <div className="modal-comments mt-3">
                    {postComments.length > 0 &&
                      postComments[0].postID === post.id &&
                      postComments.map((cmt) => (
                        <Comment key={cmt.id} cmt={cmt} viewID={cmt.id} user={location.state.user} />
                      ))}
                    <div className="form-input-comment mt-3 d-flex">
                      <Form.Control
                        value={txtComment.find((dt) => dt.postID === post.id).value}
                        className="input-comment mr-2"
                        type="text"
                        placeholder="Comment..."
                        onChange={(e) =>
                          setTxtComment((prev) => {
                            const current = [...prev];
                            current.find((dt) => dt.postID === post.id).value = e.target.value;
                            return current;
                          })
                        }
                      />
                      <Button variant="primary" onClick={() => handleClickSend(post)}>
                        <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      
      <PostDetailModal
      post={selectedPost?.post}
      comments={selectedPost?.comments || []}
      handleClose={() => setSelectedPost(null)}
    />
    </Container>
  );
};

export default Home;

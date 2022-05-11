import React, { useState } from "react";
import styled from "styled-components";
import { images } from "../constants";
import ReactPlayer from "react-player/youtube";
import { connect } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { postArticleAPI } from "../Redux/Actions";

function PostModal(props) {
  const [editor, setEditor] = useState("");
  const [shareImage, setShareImage] = useState("");
  const [videoURL, setVideoURL] = useState("");

  const [videoDisplay, setVideoDisplay] = useState("none");
  const [showAssests, setShowAssests] = useState("");
  const handleChange = (e) => {
    // console.log(e.target.files[0]);
    const image = e.target.files[0];
    if (image === "" || image === undefined) {
      alert(`Not An Image ${typeof image}`);
      return;
    }

    setShareImage(image);
  };

  const reset = (e) => {
    setEditor("");
    setShareImage("");
    setVideoURL("");
    setVideoDisplay("none");
    props.handleClick(e);
  };

  const postArticle = (e) => {
    console.log("helo");
    e.preventDefault();

    if (e.target !== e.currentTarget) return;

    const payload = {
      image: shareImage,
      video: videoURL,
      user: props.user,
      description: editor,
      timestamp: Timestamp.now(),
    };

    props.postArticle(payload);
    reset(e);
  };
  return (
    <>
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create s Post</h2>
              <button>
                <img
                  src={images.closeIcon}
                  alt="close icon"
                  onClick={(e) => reset(e)}
                />
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                <img src={props.user.photoURL} alt="user" />
                <span>{props.user.displayName}</span>
              </UserInfo>
              <Editor>
                <textarea
                  value={editor}
                  onChange={(e) => setEditor(e.target.value)}
                  placeholder="What do you want to talk about "
                ></textarea>
                {showAssests === "video" ? (
                  <>
                    <VideoURL display={videoDisplay}>
                      <input
                        type="text"
                        value={videoURL}
                        placeholder="Enter a Video URL"
                        onChange={(e) => setVideoURL(e.target.value)}
                      />
                    </VideoURL>
                    {videoURL && <ReactPlayer width="100%" url={videoURL} />}
                  </>
                ) : (
                  showAssests === "image" && (
                    <>
                      {shareImage && (
                        <img src={URL.createObjectURL(shareImage)} />
                      )}
                    </>
                  )
                )}
              </Editor>
            </SharedContent>
            <SharedCreation>
              <AttachAssets>
                <AssetButton>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                    onChange={(e) => handleChange(e)}
                  />
                  <img
                    src={images.sharePhoto}
                    alt="Post_Image"
                    onClick={(e) => {
                      e.target.parentNode.firstChild.click();
                      setShowAssests("image");
                    }}
                  />
                </AssetButton>
                <AssetButton>
                  <img
                    src={images.shareVideo}
                    alt="Post_Video"
                    onClick={() => {
                      setVideoDisplay("block");
                      setShowAssests("video");
                    }}
                  />
                </AssetButton>
              </AttachAssets>
              <ShareComment>
                <AssetButton>
                  <img src={images.postComment} alt="Post" />
                  <span>Anyone</span>
                </AssetButton>
              </ShareComment>
              <PostButton
                onClick={(e) => postArticle(e)}
                disabl={editor || shareImage || videoURL ? true : false}
              >
                Post
              </PostButton>
            </SharedCreation>
          </Content>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
`;
const Content = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;
const Header = styled.div`
  /* display: block; */
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
    background-color: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-color: #ebebeb;
    }
    svg {
      pointer-events: none;
    }
  }
`;
const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;
const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;
const AssetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: auto;
  /* color: rgba(0, 0, 0, 0.5); */

  color: rgba(0, 0, 0, 0.15);
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: #ebebeb;
  }
`;
const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;
  ${AssetButton} {
    width: 40px;
    margin-left: 5px;
  }
  input[type="file"] {
    display: none;
  }
`;
const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  ${AssetButton} {
    span {
      color: rgba(0, 0, 0, 0.9);
      margin-left: 5px;
    }
    svg {
      margin-right: 5px;
    }
    padding: 0px 15px;
    border-radius: 20px;
  }
`;
const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding: auto 16px;
  background: ${(props) => (props.disabl ? "#0a66c2" : "#ebebeb")};
  color: white;
  border: none;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "pointer" : "not-allowed")};
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.disabl ? "#004182" : "#ebebeb")};
  }
`;
const Editor = styled.div`
  padding: 12px 24px;
  img {
    width: 100%;
  }
  textarea {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    width: 100%;
    min-height: 100px;
    resize: none;
    outline: none;
    border: none;
  }
`;
const VideoURL = styled.div`
  display: ${(props) => props.display};
  width: 100%;
  input {
    box-sizing: border-box;
    width: 100%;
    padding: 7px 15px;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  postArticle: (payload) => dispatch(postArticleAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);

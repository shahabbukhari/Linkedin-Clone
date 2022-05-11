import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import styled from "styled-components";
import { images } from "../constants";
import { getArticleAPI } from "../Redux/Actions";
import PostModal from "./PostModal";

const Main = (props) => {
  useEffect(() => {
    props.getArticles();
  }, []);

  const [showModal, setShowModal] = useState("close");
  const shareOptions = [
    {
      title: "Photo",
      img: images.sharePhoto,
      filter: `invert(79%) sepia(54%) saturate(4065%) hue-rotate(183deg) brightness(102%) contrast(96%)`,
    },
    {
      title: "Video",
      img: images.shareVideo,
      filter: `invert(69%) sepia(39%) saturate(513%) hue-rotate(56deg) brightness(93%) contrast(90%)`,
    },
    {
      title: "Event",
      img: images.shareEvent,
      filter: `invert(86%) sepia(33%) saturate(2514%) hue-rotate(328deg) brightness(95%) contrast(91%)`,
    },
    {
      title: "Article",
      img: images.shareArticle,
      filter: `invert(68%) sepia(8%) saturate(2161%) hue-rotate(308deg) brightness(96%) contrast(107%)`,
    },
  ];
  const postReactions = {
    like: "https://static-exp1.licdn.com/sc/h/f4ly07ldn7194ciimghrumv3l",
    support: "https://static-exp1.licdn.com/sc/h/9whrgl1hq2kfxjqr9gqwoqrdi",
    heart: "https://static-exp1.licdn.com/sc/h/asmf650x603bcwgefb4heo6bm",
    insightful: "https://static-exp1.licdn.com/sc/h/39axkb4qe8q95ieljrhqhkxvl",
    curios: "https://static-exp1.licdn.com/sc/h/1z80ze8ler6arc76a8rxsgqbh",
    celeberate: "https://static-exp1.licdn.com/sc/h/3c4dl0u9dy2zjlon6tf5jxlqo",
  };
  const post = [
    { title: "Like", url: images.postLike },
    { title: "Comment", url: images.postComment },
    { title: "Share", url: images.postShare },
    { title: "Send", url: images.postSend },
  ];
  const handleClick = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) return;

    switch (showModal) {
      case "open":
        setShowModal("close");
        break;
      case "close":
        setShowModal("open");
        break;
      default:
        setShowModal("close");
        break;
    }
  };
  return (
    <>
      {" "}
      {props.articles.length === 0 ? (
        <p>No Articles Present</p>
      ) : (
        <Container>
          <ShareBox>
            <div>
              {props.user && props.user.photoURL ? (
                <img src={props.user.photoURL} alt="User" />
              ) : (
                <img src={images.user} alt="User" />
              )}
              <button
                onClick={(e) => handleClick(e)}
                disabled={props.loading ? true : false}
              >
                Start a Post
              </button>
            </div>
            <div>
              {shareOptions.map((option, index) => (
                <button key={option.title + index}>
                  <img
                    src={option.img}
                    alt={`add_${option.title}`}
                    style={{ filter: option.filter }}
                  />
                  <span>{option.title}</span>
                </button>
              ))}
            </div>
          </ShareBox>
          <Content>
            {props.loading && <img src={images.spinner} alt="Spinner" />}
            {props.articles.length > 0 &&
              props.articles.map((article, index) => (
                <Article key={index}>
                  <SharedActor>
                    <a>
                      <img src={article.actor.image} alt="user" />
                      <div>
                        <span>{article.actor.title}</span>
                        <span>{article.actor.description}</span>
                        <span>
                          {article.actor.date
                            .toDate()
                            .toLocaleDateString(undefined, {
                              weekday: "long",
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            })}
                        </span>
                      </div>
                    </a>
                    <button>
                      <img src={images.eclipse} alt="" />
                    </button>
                  </SharedActor>
                  <Description>{article.description}</Description>
                  <SharedImg>
                    <a>
                      {!article.sharedImage && article.video ? (
                        <ReactPlayer width="100%" url={article.video} />
                      ) : (
                        <img src={article.sharedImage} alt="nature" />
                      )}
                    </a>
                  </SharedImg>
                  <SocialCounts>
                    <li>
                      <button>
                        <img src={postReactions.like} alt="like" />
                        <img src={postReactions.support} alt="like" />
                        <span>Shahab and 5 others</span>
                      </button>
                    </li>
                    <li>
                      <a>{article.comments} comments</a>
                      <a>0 shares</a>
                    </li>
                  </SocialCounts>
                  <SocialActions>
                    {post.map((rec, i) => (
                      <button key={rec.title + i}>
                        <img src={rec.url} alt={rec.title} />
                        <span>{rec.title}</span>
                      </button>
                    ))}
                  </SocialActions>
                </Article>
              ))}
          </Content>
          <PostModal showModal={showModal} handleClick={handleClick} />
          <PostModal />
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  grid-area: main;
  /* box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%); */
`;
const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;
const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  margin: 0 0 8px;
  background-color: white;
  div {
    button {
      outline: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
      cursor: pointer;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }
      button {
        margin: 4px 0;
        flex: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 35px;
        background-color: white;
        text-align: left;
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;

      button {
        img {
          margin: 0 4px 0 -2px;
        }
        span {
          color: #727272;
          font-weight: 400;
        }
      }
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: hidden;
`;

const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;

  a {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;
      span {
        text-align: left;

        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }
        &:nth-child(n + 1) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
  button {
    position: absolute;
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    outline: none;
  }
`;

const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;
const SharedImg = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;
const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #c9c5df;
  list-style: none;
  li {
    margin-right: 5px;
    font-size: 12px;
    color: #2220207a;
    span {
      color: #2220207a;
      margin-left: 5px;
    }
    button {
      display: flex;
      border: none;
      outline: none;
      background: transparent;
      img {
        width: 18px;
        height: 18px;
        margin-top: -3px;
        border-radius: 50%;
        margin-left: -2px;
      }
    }
    a {
      margin-left: 8px;
    }
  }
`;
const SocialActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0;
  min-height: 40px;
  button {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    outline: none;
    color: #727272;
    img {
      opacity: 0.5;
    }
    span {
      font-weight: 700;
      margin-left: 5px;
    }
    margin: 5px auto;
    padding: 8px 12px;
    &:hover {
      background-color: #ebebeb;
      border-radius: 5px;
    }
  }
`;
const Content = styled.div`
  text-align: center;
  & > img {
    width: 30px;
  }
`;
const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    loading: state.articleState.loading,
    articles: state.articleState.articles,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getArticles: () => dispatch(getArticleAPI()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Main);

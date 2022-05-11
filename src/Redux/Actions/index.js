import { signInWithPopup } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, provider, storage } from "../../firebase";
import store from "../Store";
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "./actionTypes";
import db from "../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export function signInAPI() {
  console.log("HEllow");
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        dispatch(setUser(payload));
        console.log(payload);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));
    if (payload.image != "") {
      // const upload = storage.ref(`images/${payload.image.name}`).put(payload.image)
      const upload = ref(storage, `images/${payload.image.name}`);
      const uploadTask = uploadBytesResumable(upload, payload.image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progress: ${progress}`);

          if (snapshot.state === "running")
            console.log(`Progress: ${progress}`);
        },
        (error) => console.log(`ERROR: ${error.response}`),
        async () => {
          const downloadURL = await getDownloadURL(upload);
          const articlesRef = collection(db, "articles");
          addDoc(articlesRef, {
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: payload.timestamp,
              image: payload.user.photoURL,
            },
            video: payload.video,
            sharedImage: downloadURL,
            comments: 0,
            description: payload.description,
          });
          dispatch(setLoading(false));
        }
      );
    } else if (payload.video) {
      addDoc(collection(db, "articles"), {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImage: "",
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    } else if (payload.video === "" && payload.image === "") {
      addDoc(collection(db, "articles"), {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: "",
        sharedImage: "",
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    }
  };
}

export function getArticleAPI() {
  return (dispatch) => {
    let payload;

    const colRef = collection(db, "articles");
    const q = query(colRef, orderBy("actor.date", "desc"));
    onSnapshot(q, (snapshot) => {
      payload = snapshot.docs.map((doc) => doc.data());
      console.log(payload);
      dispatch(getArticles(payload));
    });

    // db.collection("articles")
    //   .orderBy("actor.date", "desc")
    //   .onSnapshot((snapshot) => {});
  };
}

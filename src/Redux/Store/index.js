import { createStore, applyMiddleware } from "redux";
import rootReducer from "../Reducers";
import ThunkMiddleware from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(ThunkMiddleware));
store.subscribe((ch) => {
  console.log("Change Happened", ch);
});

export default store;

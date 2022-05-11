import { GET_ARTICLES, SET_LOADING_STATUS } from "../Actions/actionTypes";

export const initState = {
  loading: false,
  articles: [],
};

function articleReducer(state = initState, action) {
  switch (action.type) {
    case GET_ARTICLES:
      return {
        ...state,
        articles: action.payload,
      };
    case SET_LOADING_STATUS:
      return {
        ...state,
        loading: action.status,
      };
    default:
      return state;
  }
}

export default articleReducer;

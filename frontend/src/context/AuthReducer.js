const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILED":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: action.payload ? null : "",
        isFetching: false,
        error: false,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter((item) => {
            return item !== action.payload;
          }),
        },
      };
    case "DETAILS_UPDATED":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "LOADER":
      return {
        ...state,
        loader: action.payload,
      };
    case "SENDER_MSG":
      return {
        ...state,
        message: action.payload,
      };
    case "CHAT_SELECTED":
      return {
        ...state,
        chatSelectedUser: action.payload,
      };
    case "TOGGLE_HAMBERGUR":
      return {
        ...state,
        hambergur: action.payload,
      };
    default:
      return state;
  }
};
export default AuthReducer;

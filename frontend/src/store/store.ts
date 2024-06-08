import { configureStore } from "@reduxjs/toolkit";
// import recordReducer from "./record/recordReducer";
import userReducer from "./user/userReducer";
import globalReducer from "./global/globalReducer";
import interviewReducer from "./interview/interviewReducer";
import studentReducer from "./student/studentReducer";
import resultReducer from "./result/resultReducer";

const store = configureStore({
  reducer: {
    userReducer,
    globalReducer,
    interviewReducer,
    studentReducer,
    resultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";
// import recordReducer from "./record/recordReducer";
import userReducer from "./user/userReducer";
import globalReducer from "./global/globalReducer";
import interviewReducer from "./interview/interviewReducer";

const store = configureStore({
  reducer: { userReducer, globalReducer, interviewReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

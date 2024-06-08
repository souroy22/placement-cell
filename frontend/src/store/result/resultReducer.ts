import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Interview_TYPE } from "../interview/interviewReducer";
import { Student_TYPE } from "../student/studentReducer";

export type RESULT_TYPE = {
  interview: Interview_TYPE;
  student: Student_TYPE;
  result: "PASS" | "FAIL" | "On_Hold" | "DIDNOT_ATTEMPT" | "PENDING";
};

type UserStateType = {
  results: null | RESULT_TYPE[];
};

const initialState: UserStateType = {
  results: null,
};

export const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<RESULT_TYPE[] | null>) => {
      return {
        ...state,
        results: action.payload,
      };
    },
  },
});

export const { setResults } = resultSlice.actions;
export default resultSlice.reducer;

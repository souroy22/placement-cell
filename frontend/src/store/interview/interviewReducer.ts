import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Interview_TYPE = {
  companyName: string;
  slug: string;
  date: string;
};

type UserStateType = {
  interviews: null | Interview_TYPE[];
};

const initialState: UserStateType = {
  interviews: null,
};

export const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setInterviews: (state, action: PayloadAction<Interview_TYPE[] | null>) => {
      return {
        ...state,
        interviews: action.payload,
      };
    },
  },
});

export const { setInterviews } = interviewSlice.actions;
export default interviewSlice.reducer;

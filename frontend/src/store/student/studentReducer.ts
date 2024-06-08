import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PLACEMENT_STATUS = "not_placed" | "placed";

export type Student_TYPE = {
  name: string;
  email: string;
  college: string;
  status: PLACEMENT_STATUS;
  dsaScore: number;
  webdScore: number;
  reactScore: number;
  batch: {
    name: string;
    slug: string;
  };
  slug: string;
};

type UserStateType = {
  students: null | Student_TYPE[];
};

const initialState: UserStateType = {
  students: null,
};

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student_TYPE[] | null>) => {
      return {
        ...state,
        students: action.payload,
      };
    },
  },
});

export const { setStudents } = studentSlice.actions;
export default studentSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Batch_TYPE = {
  slug: string;
  name: string;
};

type UserStateType = {
  batches: null | Batch_TYPE[];
};

const initialState: UserStateType = {
  batches: null,
};

export const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {
    setBatches: (state, action: PayloadAction<Batch_TYPE[] | null>) => {
      return {
        ...state,
        batches: action.payload,
      };
    },
  },
});

export const { setBatches } = batchSlice.actions;
export default batchSlice.reducer;

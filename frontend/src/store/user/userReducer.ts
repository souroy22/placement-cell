import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type USER_TYPE = {
  name: string;
  email: string;
};

type UserStateType = {
  user: null | USER_TYPE;
};

const initialState: UserStateType = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<USER_TYPE | null>) => {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import { appAuth } from '../firebase/config';

interface UserType {
  userObj: DocumentData | null;
}

const initialState: UserType = {
  userObj: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserObj: (state, action) => {
      state.userObj = action.payload;
    },
    refreshUser: (state) => {
      const user: User | null = appAuth.currentUser;
      if (user) {
        state.userObj = {
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (user: any) => user.updateProfile(user),
        };
      }
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;

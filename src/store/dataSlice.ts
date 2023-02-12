import { createSlice } from '@reduxjs/toolkit';
import { DocumentData } from 'firebase/firestore';

interface DataType {
  feeds: DocumentData[];
  feedData: DocumentData | null;
  selectedUserId: string | null;
}

const initialState: DataType = {
  feeds: [],
  feedData: null,
  selectedUserId: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setFeeds: (state, action) => {
      state.feeds = action.payload;
    },
    showUserPosts: (state, action) => {
      state.selectedUserId = action.payload;
    },
  },
});

export const dataActions = dataSlice.actions;
export default dataSlice;

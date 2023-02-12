import { createSlice } from '@reduxjs/toolkit';

interface LikeType {
  post: [
    {
      likeCnt: number;
      likeList: object;
    },
  ];
}

const initialState: LikeType = {
  post: [
    {
      likeCnt: 0,
      likeList: {},
    },
  ],
};

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    addLikeCount: (state, action) => {
      state.post.push({ likeCnt: 1, likeList: action.payload });
    },
  },
});

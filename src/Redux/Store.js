import { configureStore } from '@reduxjs/toolkit';
import userSlice from './Slice';

export default configureStore({
  reducer: {
    user: userSlice,
  },
});
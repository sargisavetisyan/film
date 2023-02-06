import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import filmSlice from '../features/film/filmSlice';
import userSlice from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    userData: userSlice,
    filmData: filmSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

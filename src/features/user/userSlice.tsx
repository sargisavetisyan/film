import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypeUser } from "../../types/user";
import { feachUser } from "./userApi";

export interface UserInterface {
    user: TypeUser,
    admin: TypeUser,
    users: TypeUser[],
    loadding: boolean,
}

const initialState: UserInterface = {
    user: {} as TypeUser,
    admin: {} as TypeUser,
    users: [],
    loadding: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<TypeUser>) {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        //****for All Users ****// 
        builder.addCase(feachUser.fulfilled, (state, action) => {
            state.users = action.payload
            state.loadding = false
        })
        builder.addCase(feachUser.pending, (state, action) => {
            state.loadding = true
        })
    }
})

export default userSlice.reducer

export const { setUser } = userSlice.actions
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import { TypeUser } from "../../types/user";

//****All Users ****//

export const feachUser = createAsyncThunk('user/get', async () => {
    const userCollection = collection(db, 'user')
    let data = await getDocs(userCollection)
    let arr: TypeUser[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase-config";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUser } from "../../features/user/userSlice";
import AuthStyle from './Auth.module.css';
import ReactLoading from 'react-loading';

export const UserAuth: React.FC = React.memo((): JSX.Element => {
    const [response, setResponse] = useState<boolean>(false)
    const userCollection = collection(db, 'user')
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.userData)

    useEffect(() => {
        onAuthStateChanged(auth, async user => {
            if (user) {
                let q = query(userCollection, where('userid', '==', user.uid))
                let data: any = await getDocs(q)
                setResponse(true)
                if (data.size > 0) {
                    data = data.docs[0]
                }
                dispatch(setUser({ id: data.id, ...data.data() }))

            } else {
                setResponse(true)
            }
        })
    }, [])


    if (response) {
        if ('name' in user) {
            return (
                <>
                    <Outlet />
                </>
            )
        } else {
            return <Navigate to={'/'} />
        }
    } else {
        return <ReactLoading
            className={AuthStyle.loadding}
            type={'spokes'}
            color={' #FFC107'}
            height={300}
            width={300}
        />
    }
})
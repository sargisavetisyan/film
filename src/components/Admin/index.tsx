import React, { useState, useEffect } from 'react';
import { MdDelete } from "react-icons/md";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ReactLoading from 'react-loading';
import { Modal } from 'react-responsive-modal';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { TypeUser } from '../../types/user';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AdminStyle from './Admin.module.css';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { feachUser } from '../../features/user/userApi';
import { TypeFilm } from '../../types/film';
import { TypeSelect } from '../../types/select';
import { feachFilmsData } from '../../features/film/filmApi';

export const Admin: React.FC = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch()
    const { user, users, loadding } = useAppSelector(state => state.userData)
    const { films } = useAppSelector(state => state.filmData)
    const [show, setShow] = useState<boolean>(false)

    const deleteUser = async (id: string) => {
        await deleteDoc(doc(db, "user", id));
        dispatch(feachUser())
    }

    const setAdmin = async (searchUser: TypeUser) => {
        if (searchUser.admin === false) {
            let docRef = doc(db, 'user', searchUser.id)
            await updateDoc(docRef, {
                admin: true,
                id: searchUser.id,
                name: searchUser.name,
                surname: searchUser.surname,
                age: searchUser.age,
                password: searchUser.password,
                prof_pic: searchUser.prof_pic,
                userid: searchUser.userid
            })
            dispatch(feachUser())
        } else {
            let docRef = doc(db, 'user', searchUser.id)
            await updateDoc(docRef, {
                admin: false,
                id: searchUser.id,
                name: searchUser.name,
                surname: searchUser.surname,
                age: searchUser.age,
                password: searchUser.password,
                prof_pic: searchUser.prof_pic,
                userid: searchUser.userid
            })
            dispatch(feachUser())
        }
    }

    const deleteFilm = async (id: string) => {
        await deleteDoc(doc(db, "films", id));
        dispatch(feachFilmsData())
    }

    useEffect(() => {
        dispatch(feachFilmsData())
    }, [])

    return (
        <>
            <h1>Workbook</h1>
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3 mt-3"
            >
                <Tab
                    eventKey="Users"
                    title="User"
                >
                    <Table
                        responsive="sm"
                        className='table table-info mt-2 border border-5'>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name/Surname</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>User</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((searchUser: TypeUser, i: number) => {
                                if (user.id !== searchUser.id) {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <img
                                                    style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                                                    src={searchUser.prof_pic}
                                                    alt=''
                                                />
                                            </td>
                                            <td>{searchUser.name} {searchUser.surname}</td>
                                            <td>{searchUser.email}</td>
                                            <td>{searchUser.admin && 'Admin'}</td>
                                            <td>
                                                {loadding ?
                                                    <button
                                                        disabled={true}
                                                        className='btn btn-warning'
                                                        style={{ position: 'relative' }}
                                                        onClick={setAdmin.bind(null, searchUser)}
                                                    >
                                                        {searchUser.admin ? 'Make admin' : 'Make user'}
                                                        <div className={AdminStyle.loadding}>
                                                            <ReactLoading type={'spokes'} color={'#000'} height={15} width={15} />
                                                        </div>
                                                    </button> :
                                                    <button
                                                        disabled={false}
                                                        className='btn btn-warning'
                                                        onClick={setAdmin.bind(null, searchUser)}
                                                    >
                                                        {searchUser.admin ? 'Make admin' : 'Make user'}
                                                    </button>
                                                }
                                            </td>
                                            <td>
                                                <MdDelete
                                                    style={{ cursor: 'pointer', transform: 'scale(1.3)', color: 'red' }}
                                                    onClick={() => setShow(true)}
                                                />
                                            </td>
                                            {show &&
                                                <Modal
                                                    open={show}
                                                    onClose={() => setShow(!show)}
                                                    center
                                                    animationDuration={400}
                                                >
                                                    <h2 className='text-danger'>Do you want to delete?</h2>
                                                    <div className='d-flex justify-content-end'>
                                                        <ButtonGroup aria-label="Basic example">
                                                            <Button onClick={() => setShow(!show)} variant="secondary">Back</Button>
                                                            <Button onClick={deleteUser.bind(null, searchUser.id)} variant="danger">Delete</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </Modal>}
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </Table>
                </Tab>
                <Tab
                    eventKey="Films"
                    title="Film"
                >
                    <Table
                        responsive="sm"
                        className='table table-info mt-2 border border-5'>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Title</th>
                                <th>Producer</th>
                                <th>Genre</th>
                                <th>Rating</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {films.map((film: TypeFilm, i: number) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            <img
                                                style={{ width: '40px', height: '40px' }}
                                                src={film.photo}
                                                alt=''
                                            />
                                        </td>
                                        <td>{film.title} </td>
                                        <td>{film.producer.value}</td>
                                        <td>
                                            {film.genre.map((genr: TypeSelect, i: number) => {
                                                return (
                                                    <span
                                                        key={i}
                                                        className='me-1'
                                                    >
                                                        {genr.value}/
                                                    </span>
                                                )
                                            })}
                                        </td>
                                        <td>{film.rating}</td>
                                        <td>
                                            <MdDelete
                                                style={{ cursor: 'pointer', transform: 'scale(1.3)', color: 'red' }}
                                                onClick={() => setShow(true)}
                                            />
                                        </td>
                                        {show &&
                                            <Modal
                                                open={show}
                                                onClose={() => setShow(!show)}
                                                center
                                                animationDuration={400}
                                            >
                                                <h2 className='text-danger'>Do you want to delete?</h2>
                                                <div className='d-flex justify-content-end'>
                                                    <ButtonGroup aria-label="Basic example">
                                                        <Button onClick={() => setShow(!show)} variant="secondary">Back</Button>
                                                        <Button onClick={deleteFilm.bind(null, film.id)} variant="danger">Delete</Button>
                                                    </ButtonGroup>
                                                </div>
                                            </Modal>}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </>
    )
})
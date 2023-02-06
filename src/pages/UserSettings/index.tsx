import React, { useCallback } from 'react'
import { doc, updateDoc } from 'firebase/firestore';
import { Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setUser } from '../../features/user/userSlice';
import { db, storage } from '../../firebase-config';
import { TypeUser } from '../../types/user';
import SettingsStyle from './Settings.module.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Footer } from '../../components/Footer';


export const UserSettings: React.FC = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.userData);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<TypeUser>()

    const change = useCallback(async (info: TypeUser) => {
        let docRef = doc(db, 'user', user.id)
        if (info.prof_pic[0]) {
            let file: any = info.prof_pic[0]
            const image = ref(storage, "photo/" + Date.now() + file.name)
            uploadBytesResumable(image, file)
                .then(snapshot => {
                    getDownloadURL(snapshot.ref)
                        .then(async url => {
                            await updateDoc(docRef, {
                                prof_pic: url,
                            }
                            );
                            dispatch(setUser({
                                id: user.id,
                                name: info.name,
                                surname: info.surname,
                                age: info.age,
                                prof_pic: url,
                                userid: user.userid,
                                email: user.email,
                                password: user.password,
                            }))
                        })
                })
                .catch(err => {
                    console.error("Upload failed", err);
                })
        } else {
            await updateDoc(docRef, {
                name: info.name,
                surname: info.surname,
                age: info.age,
            })
            dispatch(setUser({
                id: user.id,
                name: info.name,
                surname: info.surname,
                age: info.age,
                prof_pic: user.prof_pic,
                userid: user.userid,
                email: user.email,
                password: user.password,
            }))
        }
        reset()
    }, [reset])


    return (
        <>
            <Container>
                <div className={SettingsStyle.contain}>
                    <Card className={SettingsStyle.card}>
                        <Card.Img className={SettingsStyle.img} variant="top" src={user.prof_pic} />
                        <Card.Body>
                            <Card.Title className={SettingsStyle.title}>
                                {user.admin && <h3 className='text-danger'>Admin</h3>}  {user.name} {user.surname}
                            </Card.Title>
                            <Card.Text className={SettingsStyle.text}>{user.age} year</Card.Text>
                        </Card.Body>
                    </Card>
                    <div className={SettingsStyle.body}>
                        <h1>Update your data</h1>
                        <Form className={SettingsStyle.form} onSubmit={handleSubmit(change)}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control className={SettingsStyle.input} type="text" placeholder="name*" {...register('name', { required: true })} />
                                {errors.name && <Form.Text className="text-danger">
                                    Please write your name!
                                </Form.Text>}
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control className={SettingsStyle.input} type="text" placeholder="Surname*" {...register('surname', { required: true })} />
                                {errors.surname && <Form.Text className="text-danger">
                                    Please write your surname!
                                </Form.Text>}
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control className={SettingsStyle.input} type="number" placeholder="age*" {...register('age', { required: true })} />
                                {errors.age && <Form.Text className="text-danger">
                                    Please write your age!
                                </Form.Text>}
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control className={SettingsStyle.input} type="file"  {...register('prof_pic')} />
                            </Form.Group>
                            <Form.Group className={SettingsStyle.btnItem}>
                                <Button className={SettingsStyle.btnChange} type="submit" >
                                    Update
                                </Button>
                            </Form.Group>
                        </Form>
                    </div >
                </div>
            </Container >
            <Footer />
        </>
    )
})
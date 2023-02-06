import React, { useState, useCallback, Dispatch } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { TypeUser } from '../../types/user';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import SignUpStyle from './SignUp.module.css';
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface SignUpProps {
    toggle: boolean
    setToggle: Dispatch<boolean>
}

export const SignUp: React.FC<SignUpProps> = React.memo(({ toggle, setToggle }): JSX.Element => {
    const [error, setError] = useState<string>('')
    const [eye, setEye] = useState<boolean>(false)
    const userCollection = collection(db, 'user')
    const [validAge, setValidAge] = useState<string>('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset
    } = useForm<TypeUser>()

    const validate = () => {
        let age = getValues('age')
        if (age * 0 !== 0) {
            setValidAge('Please enter only number >5 to <115 !')
            return false
        } else {
            return true
        }
    }

    const signUpUser = useCallback((data: TypeUser): void => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (res) => {
                await addDoc(userCollection, {
                    name: data.name,
                    surname: data.surname,
                    age: data.age,
                    prof_pic: 'https://investuttarakhand.uk.gov.in/backoffice/themes/investuk/assets/pages/media/profile/default-user.png',
                    userid: res.user.uid,
                    email: data.email,
                    password: data.password,
                    films: []
                })
                setToggle(!toggle)
                setError('')
                reset()
            })
            .catch(err => {
                setError(err.message);
            })
    }, [reset, setError, userCollection])

    return (
        <div className={SignUpStyle.formBody}>
            <h2>{error ? error : 'Sign Up'}</h2>
            <Form className={SignUpStyle.formInput} onSubmit={handleSubmit(signUpUser)}>
                <Form.Group controlId="formBasicEmail">
                    {errors.name && <Form.Text className="text-danger fs-5">
                        Please write your name!
                    </Form.Text>}
                    <Form.Control className={SignUpStyle.input} type="text" placeholder="name *" {...register('name', { required: true })} />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    {errors.surname && <Form.Text className="text-danger fs-5">
                        Please write your surname!
                    </Form.Text>}
                    <Form.Control className={SignUpStyle.input} type="text" placeholder="surname *" {...register('surname', { required: true })} />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    {errors.age && <Form.Text className="text-danger fs-5">
                        {validAge && `${validAge}`}
                    </Form.Text>}
                    <Form.Control className={SignUpStyle.input} type="number" placeholder="age *" {...register('age', { required: true, min: 6, max: 115, validate: { validate } })} />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    {errors.surname && <Form.Text className="text-danger fs-5">
                        Please write an email address!
                    </Form.Text>}
                    <Form.Control className={SignUpStyle.input} type="email" placeholder="email *" {...register('email', { required: true })} />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    {errors.surname && <Form.Text className="text-danger fs-5">
                        Please write an password!
                    </Form.Text>}
                    <div className='d-flex'>
                        <Form.Control className={SignUpStyle.input} type={eye ? 'text' : "password"} placeholder="password *" {...register('password', { required: true })} />
                        <span >
                            {eye ?
                                <BsEye
                                    onClick={() => setEye(!eye)}
                                    className={SignUpStyle.eyeIcon}
                                /> :
                                <BsEyeSlash
                                    onClick={() => setEye(!eye)}
                                    className={SignUpStyle.eyeIcon}
                                />}
                        </span>
                    </div>
                </Form.Group>
                <Form.Group className={SignUpStyle.btnItem}>
                    <Button className={SignUpStyle.btnAdd} type="submit" >
                        Sign Up
                    </Button>
                </Form.Group>
            </Form >
        </div >
    )
})
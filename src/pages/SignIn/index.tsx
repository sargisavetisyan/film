import React, { useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form';
import { TypeLogInUser } from '../../types/loginUser';
import { auth } from '../../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import SignInStyle from './SignIn.module.css'
import { SignUp } from '..//..//components/SignUp';
import { Footer } from '../../components/Footer';

export const SignIn: React.FC = React.memo((): JSX.Element => {
    const [error, setError] = useState<boolean>(false)
    const [toggle, setToggle] = useState<boolean>(false)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<TypeLogInUser>()

    const loginUser = useCallback((data: TypeLogInUser): void => {
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(user => {
                navigate('/profile')
                reset()
            })
            .catch(err => {
                setError(err.message)
            })
    }, [reset, setError, navigate])

    return (
        <>
            <div className={SignInStyle.form}>
                <div className={SignInStyle.divBtn}>
                    {toggle ? <button
                        onClick={() => setToggle(true)}
                        style={{ backgroundColor: '#F7CA18', color: '#fff' }}
                        className={SignInStyle.btn}
                    >
                        Sign Up
                    </button> :
                        <button
                            onClick={() => setToggle(true)}
                            className={SignInStyle.btn}
                        >
                            Sign Up
                        </button>
                    }
                    {!toggle ? <button
                        onClick={() => setToggle(false)}
                        style={{ backgroundColor: '#F7CA18', color: '#fff' }}
                        className={SignInStyle.btn}
                    >
                        Sign In
                    </button> :
                        <button
                            onClick={() => setToggle(false)}
                            className={SignInStyle.btn}
                        >
                            Sign In
                        </button>
                    }
                </div>
                <div className={SignInStyle.formContent}>
                    {!toggle ? <>
                        <h2>Sign In</h2>
                        <div className={SignInStyle.formBody}>
                            {error && <h2 className="text-danger">{error}</h2>}
                            <Form className={SignInStyle.formInput} onSubmit={handleSubmit(loginUser)}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control className={SignInStyle.input} type="email" placeholder="email" {...register('email')} />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control className={SignInStyle.input} type="password" placeholder="password" {...register('password')} />
                                </Form.Group >
                                <Form.Group className={SignInStyle.btnItem}>
                                    <Button className={SignInStyle.btnAdd} type="submit" >
                                        Log In
                                    </Button>
                                </Form.Group>
                            </Form>
                        </div>
                    </> :
                        <SignUp
                            toggle={toggle}
                            setToggle={setToggle}
                        />
                    }
                </div>
            </div >
            <Footer />
        </>
    )
})
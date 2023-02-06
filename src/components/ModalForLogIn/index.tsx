import React, { Dispatch, useState, useCallback } from "react";
import { Modal } from 'react-responsive-modal';
import ModalForLogInStyle from './ModalForLogIn.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form';
import { TypeLogInUser } from '../../types/loginUser';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { SignUp } from "../SignUp";
import { auth } from "../../firebase-config";

interface ModalForLogInProps {
    show: boolean,
    setShow: Dispatch<boolean>
    filmId: string
}

export const ModalForLogIn: React.FC<ModalForLogInProps> = React.memo(({ show, setShow, filmId }): JSX.Element => {
    const [error, setError] = useState<boolean>(false)
    const [toggle, setToggle] = useState<boolean>(false)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset
    } = useForm<TypeLogInUser>()

    const loginUser = useCallback((data: TypeLogInUser): void => {
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then(user => {
                navigate('/' + filmId)
                reset()
            })
            .catch(err => {
                setError(err.message)
            })
        setShow(!show)
    }, [reset, setError, filmId, navigate])

    return (
        <div className={ModalForLogInStyle.body}>
            <Modal
                open={show}
                onClose={() => setShow(!show)}
                center
                animationDuration={1000}
            >
                <div className={ModalForLogInStyle.form}>
                    <div className={ModalForLogInStyle.divBtn}>
                        {toggle ? <button
                            onClick={() => setToggle(true)}
                            style={{ backgroundColor: '#F7CA18', color: '#fff' }}
                            className={ModalForLogInStyle.btn}
                        >
                            Sign Up
                        </button> :
                            <button
                                onClick={() => setToggle(true)}
                                className={ModalForLogInStyle.btn}
                            >
                                Sign Up
                            </button>
                        }
                        {!toggle ? <button
                            onClick={() => setToggle(false)}
                            style={{ backgroundColor: '#F7CA18', color: '#fff' }}
                            className={ModalForLogInStyle.btn}
                        >
                            Sign In
                        </button> :
                            <button
                                onClick={() => setToggle(false)}
                                className={ModalForLogInStyle.btn}
                            >
                                Sign In
                            </button>
                        }
                    </div>
                    <div className={ModalForLogInStyle.formContent}>
                        {!toggle ? <>
                            <h2>Sign In</h2>
                            <div className={ModalForLogInStyle.formBody}>
                                {error && <h2 className="text-danger">{error}</h2>}
                                <Form className={ModalForLogInStyle.formInput} onSubmit={handleSubmit(loginUser)}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control className={ModalForLogInStyle.input} type="email" placeholder="email" {...register('email')} />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control className={ModalForLogInStyle.input} type="password" placeholder="password" {...register('password')} />
                                    </Form.Group >
                                    <Form.Group className={ModalForLogInStyle.btnItem}>
                                        <Button className={ModalForLogInStyle.btnAdd} type="submit" >
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
            </Modal>
        </div>
    )
})


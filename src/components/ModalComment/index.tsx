
import { doc, updateDoc } from 'firebase/firestore';
import React, { Dispatch } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getComments } from '../../features/film/filmSlice';
import { db } from '../../firebase-config';
import { TypeComment } from '../../types/comment';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ModalStyle from './Modal.module.css';

interface ModalProps {
    show: boolean,
    setShowComments: Dispatch<boolean>
}

export const ModalComment: React.FC<ModalProps> = React.memo(({ show, setShowComments }): JSX.Element => {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.userData)
    const { film, filmComments } = useAppSelector(state => state.filmData)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset
    } = useForm<TypeComment>()

    const addComment = async (info: TypeComment) => {
        let docRef = doc(db, 'films', film.id)
        if (film.comments) {
            await updateDoc(docRef, {
                comments: [...film.comments, { id: user.id, photo: user.prof_pic, comment: info.comment }]
            })
        } else {
            await updateDoc(docRef, {
                comments: [{ id: user.id, photo: user.prof_pic, comment: info.comment }]
            })
        }
        dispatch(getComments([{ id: user.id, photo: user.prof_pic, comment: info.comment }]))
        reset()
    }

    return (
        <>
            <div style={{ width: '450px', maxHeight: '350px', overflow: 'scroll' }}>
                <Modal
                    open={show}
                    onClose={() => setShowComments(!show)}
                    center
                    animationDuration={1000}
                >
                    <h2 className='text-info'>Comments</h2>
                    {filmComments.length ? <div className={ModalStyle.chat}>
                        {
                            filmComments.map((comment: TypeComment, i: number) => {
                                return (
                                    <div
                                        key={i}
                                        className={ModalStyle.item}
                                    >
                                        <div>
                                            <img src={comment.photo} alt='' />
                                        </div>
                                        <p>{comment.comment}</p>
                                    </div>
                                )
                            })
                        }
                    </div> : <></>}
                    <Form
                        onSubmit={handleSubmit(addComment)}
                        className={ModalStyle.form}
                    >
                        <Form.Group className='flex-fill' controlId="exampleForm.ControlTextarea1">
                            <Form.Control className={ModalStyle.input} placeholder="Comment..." as="textarea" rows={1}  {...register('comment')}
                            />
                        </Form.Group>
                        <Button className={ModalStyle.btnAdd} type="submit"  >
                            Send
                        </Button>
                    </Form>
                </Modal>
            </div>
        </>
    )
})
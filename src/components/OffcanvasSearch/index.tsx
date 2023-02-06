import React, { useState, useEffect, useCallback } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import ReactLoading from 'react-loading';
import { BsSearch } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { InputSearchByActors, InputSearchByProducer, InputSearchByTitle } from '../../features/film/filmApi';
import OffcanvasStyle from './Offcanvas.module.css'
import { clearInputSearch } from '../../features/film/filmSlice';
import { Link } from 'react-router-dom';
import { TypeFilm } from '../../types/film';
import { TypeSelect } from '../../types/select';

interface OffCanvasProps {
    minHeightNavbar: number
    openCanvas: boolean
    onHide(): void
}

export const OffcanvasSearch: React.FC<OffCanvasProps> = React.memo(({ minHeightNavbar, openCanvas, onHide }): JSX.Element => {
    const dispatch = useAppDispatch()
    const { films, inputSearchFilms, loaddingInput } = useAppSelector(state => state.filmData)
    const [show, setShow] = useState(false);

    const handleClose = () => {
        onHide()
        setShow(false)
        dispatch(clearInputSearch())
    };

    let arrTitle: string[] = []
    let arrProducer: string[] = []
    let arrActors: string[] = []
    films.map(film => {
        if (!arrTitle.includes(film.title)) {
            arrTitle.push(film.title)
        }
        if (!arrProducer.includes(film.producer.value)) {
            arrProducer.push(film.producer.value)
        }
        film.actors.map((actor: TypeSelect) => {
            if (!arrActors.includes(actor.value)) {
                arrActors.push(actor.value)
            }
        })
    })

    const searchFilm = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        let res = e.target.value
        if (arrTitle.includes(res)) {
            dispatch(InputSearchByTitle(res.toString()))
        }
        else if (arrProducer.includes(res)) {
            dispatch(InputSearchByProducer(res.toString()))
        }
        else {
            dispatch(InputSearchByActors(res.toString()))
        }
    }, [dispatch])

    useEffect(() => {
        if (openCanvas === true) {
            setShow(true)
        }
    }, [openCanvas, films])

    return (
        <>
            <Offcanvas
                style={{ marginTop: `${minHeightNavbar}px` }}
                className={OffcanvasStyle.top}
                placement='top'
                show={show}
                onHide={handleClose}>
                <Container>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            {
                                openCanvas &&
                                <div className={OffcanvasStyle.iconBox}
                                >
                                    <BsSearch className={OffcanvasStyle.icon} />
                                    <input
                                        className={OffcanvasStyle.search}
                                        type='text'
                                        title='The name of the movie or the name of the actor, producer'
                                        placeholder='The name of the movie or the name of the actor, producer'
                                        onChange={searchFilm}
                                    />
                                </div>
                            }
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body >
                        {loaddingInput === true ?
                            <div className={OffcanvasStyle.loadding}>
                                <ReactLoading
                                    type={'spokes'}
                                    color={' #FFC107'}
                                    height={150}
                                    width={150}
                                />
                            </div>
                            :
                            <>
                                <h1>Searching results</h1>
                                {inputSearchFilms.length &&
                                    <div className={OffcanvasStyle.filmBody}>
                                        {
                                            inputSearchFilms.map((film: TypeFilm, i: number) => {
                                                return (
                                                    <Link
                                                        key={i}
                                                        to={'/' + film.filmId}
                                                    >
                                                        <div className={OffcanvasStyle.allFilmsItem}
                                                        >
                                                            < img src={film.photo} alt='' />
                                                            <div className={OffcanvasStyle.info}
                                                            >
                                                                <h4>{film.title}</h4>
                                                            </div>

                                                        </div>
                                                    </Link>
                                                )
                                            })
                                        }
                                    </div>}
                            </>
                        }
                    </Offcanvas.Body>
                </Container>
            </Offcanvas>
        </>
    );
})
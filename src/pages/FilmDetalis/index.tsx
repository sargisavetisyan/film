import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FcNfcSign, FcSms } from "react-icons/fc";
import { GiSoundOff } from "react-icons/gi";
import { GiSoundOn } from "react-icons/gi";
import { FaPlayCircle, FaBell } from "react-icons/fa";
import FilmStyle from './Film.module.css';
import Container from 'react-bootstrap/Container';
import ReactLoading from 'react-loading';
import { feachFilmDetalis, produserFilms, similarFilms } from "../../features/film/filmApi";
import { TypeSelect } from "../../types/select";
import { Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { TypeFilm } from "../../types/film";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Rating } from 'react-simple-star-rating';
import { LikedUser } from "../../types/likedUser";
import { ModalComment } from "../../components/ModalComment";
import { ModalForLogIn } from "../../components/ModalForLogIn";
import { Footer } from "../../components/Footer";


export const FilmDetalis: React.FC = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch()
    const { film, loadding, filmSimilars, producerFilms } = useAppSelector(state => state.filmData)
    const { user } = useAppSelector(state => state.userData)
    const [play, setPlay] = useState<boolean>(false)
    const [index, setIndex] = useState<number>(0)
    const [toggle, setToggle] = useState<boolean>(false)
    const { filmId } = useParams<string>()
    const [sound, setSound] = useState<boolean>(false)
    const [ended, setEnded] = useState<boolean>(true)
    const [color, setColor] = useState<boolean>(false)
    const [showComments, setShowComments] = useState<boolean>(false)
    const [showLogin, setShowLogin] = useState<boolean>(false)

    setTimeout(() => {
        setEnded(false)
    }, 90000)

    const changeIndex = (): void => {
        if (index !== film.translations.length - 1) {
            setIndex(index + 1)
        } else {
            setIndex(0)
        }
    }

    const handleRating = async (rateing: number): Promise<void> => {
        if (user.id) {
            if (film.allRating.length > 0) {
                let temp = Number(((film.allRating.reduce((a: number, b: number) => a + b) + rateing * 2) / (film.allRating.length + 1)).toFixed(1))
                if (!(film.users.includes(user.id))) {
                    let data = doc(db, 'films', film.id)
                    await updateDoc(data, {
                        rating: temp,
                        allRating: [...film.allRating, rateing * 2],
                        users: [...film.users, user.id],
                    }
                    )
                    dispatch(feachFilmDetalis(Number(filmId)))
                } else {
                    alert('դուք արդեն գնահատել եք')
                }
            } else {
                if (!(film.users.includes(user.id))) {
                    let data = doc(db, 'films', film.id)
                    await updateDoc(data, {
                        rating: Math.ceil(rateing * 2),
                        allRating: [...film.allRating, rateing * 2],
                        users: [...film.users, user.id],
                    }
                    )
                    dispatch(feachFilmDetalis(Number(filmId)))
                } else {
                    alert('դուք արդեն գնահատել եք')
                }
            }
        } else {
            setShowLogin(!showLogin)
        }
    }

    const subscribe = async (): Promise<void> => {
        if (user.id) {
            setColor(!color)
            let data = doc(db, 'films', film.id)
            if (!(film.liked.some((like: LikedUser) => like.id === user.id))) {
                await updateDoc(data, {
                    liked: [...film.liked, { id: user.id, like: true }]
                })
            } else {
                await updateDoc(data, {
                    liked: [...film.liked.filter((like: LikedUser) => like.id !== user.id)]
                })
            }
        } else {
            setShowLogin(!showLogin)
        }
    }

    const showModal = (): void => {
        if (user.id) {
            setShowComments(!showComments)
        } else {
            setShowLogin(!showLogin)
        }
    }

    useEffect(() => {
        if (user.id && film.liked) {
            if (film.liked.some((like: LikedUser) => like.id === user.id)) {
                setColor(true)
            }
        }
        dispatch(feachFilmDetalis(Number(filmId)))
        if (film.title) {
            dispatch(similarFilms(film.genre[0].value))
            dispatch(produserFilms(film.producer.value.toString()))
        }
    }, [filmId, user, color])

    return (
        <>
            <Container>
                {loadding === true ?
                    <div className={FilmStyle.loadding}>
                        <ReactLoading type={'spokes'} color={'#FFC107'} height={300} width={300} />
                    </div> :
                    <>
                        {play ?
                            <div className={FilmStyle.video}>
                                <video
                                    width="100%"
                                    height="auto"
                                    controls
                                    autoPlay
                                >
                                    <source src={film.video} type="video/mp4" />
                                </video>
                            </div> : <>
                                {
                                    film.title &&
                                    <div className={FilmStyle.body}>
                                        <div className={FilmStyle.image}>
                                            {ended ? <><video width="100%" height="auto" autoPlay={ended} muted={sound} poster={film.photo}>
                                                <source src={film.video} type="video/mp4" />
                                            </video>
                                                {sound ? <div className={FilmStyle.play}>
                                                    <FaPlayCircle onClick={() => setPlay(!play)} className={FilmStyle.btnWatch} />
                                                    <GiSoundOff className={FilmStyle.btnWatch} onClick={() => setSound(!sound)} />
                                                </div> :
                                                    <div className={FilmStyle.play}>
                                                        <FaPlayCircle onClick={() => setPlay(!play)} className={FilmStyle.btnWatch} />
                                                        <GiSoundOn className={FilmStyle.btnWatch} onClick={() => setSound(!sound)} />
                                                    </div>}</> :
                                                <>
                                                    <img src={film.photo} alt='' />
                                                    <div className={FilmStyle.play}>
                                                        <FaPlayCircle onClick={() => setPlay(!play)} className={FilmStyle.btnWatch} />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div className={FilmStyle.content}>
                                            <div className={FilmStyle.detalis}>
                                                <div className="d-flex align-items-center">
                                                    <h1>{film.title}</h1>
                                                    <>
                                                        {user.id ? <>
                                                            {film.liked.some((like: LikedUser) => like.id == user.id) ?
                                                                < FaBell onClick={subscribe} style={{ color: '#F7CA18', transform: 'scale(2)', cursor: ' pointer' }} /> :
                                                                < FaBell onClick={subscribe} style={{ transform: 'scale(2)', cursor: ' pointer' }} />}
                                                        </> :
                                                            <>
                                                                {/* {film.liked.some((like: LikedUser) => like.id === user.id) ?
                                                                < FaBell onClick={subscribe} style={{ color: '#F7CA18', transform: 'scale(2)', cursor: ' pointer' }} /> : */}
                                                                < FaBell onClick={subscribe} style={{ transform: 'scale(2)', cursor: ' pointer' }} />
                                                                {/* } */}
                                                                {showLogin && filmId &&
                                                                    <ModalForLogIn
                                                                        filmId={filmId}
                                                                        show={showLogin}
                                                                        setShow={setShowLogin}
                                                                    />}
                                                            </>
                                                        }
                                                    </>
                                                </div>
                                                <div className={FilmStyle.item}>
                                                    < span className={FilmStyle.infoRating}>{film.rating} </span>
                                                    <span>
                                                        {film.year.value}
                                                    </span>
                                                    {film.genre.map((genr: TypeSelect, i: number) => {
                                                        return (
                                                            <span key={i}>
                                                                {genr.value}
                                                            </span>
                                                        )
                                                    })}
                                                    <span>
                                                        {film.time}
                                                    </span>
                                                    <span  >
                                                        {film.translations.length > 1 ? < FcNfcSign
                                                            className={FilmStyle.itemRating}
                                                            onClick={changeIndex}
                                                        /> : ''}
                                                        {
                                                            film.translations[index].value.slice(0, 2)
                                                        }
                                                    </span>
                                                </div>
                                                <div className={FilmStyle.producerActors}>
                                                    <span>Producer:</span>
                                                    {film.producer.value}
                                                </div>
                                                <div className={FilmStyle.producerActors}>
                                                    <span>Actors:</span>
                                                    {film.actors.map((actor: TypeSelect, i: number) => {
                                                        if (i < 3) {
                                                            return (
                                                                <span
                                                                    className={FilmStyle.actors}
                                                                    key={i}
                                                                >
                                                                    {actor.value}
                                                                </span>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                                <div className={FilmStyle.description}>
                                                    <h3>Description</h3>
                                                    <span>
                                                        {film.description.length > 150 && !toggle ? `${film.description.slice(0, 150)}...` : `${film.description}`}
                                                    </span>
                                                    <p
                                                        onClick={() => setToggle(!toggle)}
                                                    >
                                                        {toggle ? 'Collapse description' : 'Detailed description'}
                                                    </p>
                                                </div>
                                                <div className={FilmStyle.comments}>
                                                    <>
                                                        {user.id ? <>
                                                            <div>
                                                                <FcSms
                                                                    className={FilmStyle.commentsIcon}
                                                                    onClick={showModal}
                                                                />
                                                            </div>
                                                            {showComments &&
                                                                < ModalComment
                                                                    show={showComments}
                                                                    setShowComments={setShowComments}
                                                                />}
                                                        </>
                                                            : <>
                                                                <div>
                                                                    <FcSms
                                                                        className={FilmStyle.commentsIcon}
                                                                        onClick={showModal}
                                                                    />
                                                                </div>
                                                                {showLogin && filmId &&
                                                                    <ModalForLogIn
                                                                        filmId={filmId}
                                                                        show={showLogin}
                                                                        setShow={setShowLogin}
                                                                    />}
                                                            </>
                                                        }
                                                    </>
                                                </div>
                                            </div>
                                            <div>
                                                <h3>Рate the movie</h3>
                                                <>
                                                    {user.id ? <>
                                                        <h3>Рate the movie</h3>
                                                        <Rating
                                                            initialValue={0}
                                                            iconsCount={7}
                                                            onClick={handleRating}
                                                        />
                                                    </> :
                                                        <>
                                                            <Rating
                                                                initialValue={0}
                                                                iconsCount={7}
                                                                onClick={handleRating}
                                                            />
                                                            {showLogin && filmId &&
                                                                <ModalForLogIn
                                                                    filmId={filmId}
                                                                    show={showLogin}
                                                                    setShow={setShowLogin}
                                                                />}
                                                        </>
                                                    }
                                                </>
                                            </div>
                                        </div>
                                    </div >
                                }
                                <div className={FilmStyle.similar}>
                                    {filmSimilars.length > 0 ?
                                        <>
                                            <h1>Similar Films</h1>
                                            <Swiper
                                                modules={[Navigation, A11y]}
                                                spaceBetween={50}
                                                slidesPerView={4}
                                                navigation
                                                breakpoints={{
                                                    0: {
                                                        slidesPerView: 1,
                                                        spaceBetween: 10,
                                                    },
                                                    600: {
                                                        slidesPerView: 2,
                                                        spaceBetween: 20,
                                                    },
                                                    800: {
                                                        slidesPerView: 3,
                                                        spaceBetween: 30,
                                                    },
                                                    1100: {
                                                        slidesPerView: 4,
                                                        spaceBetween: 40,
                                                    }
                                                }}
                                            >
                                                {
                                                    filmSimilars.map((filmSimilar: TypeFilm, i: number) => {
                                                        if (filmSimilar.filmId !== film.filmId) {
                                                            return (
                                                                <SwiperSlide key={i}>
                                                                    <Link to={'/' + filmSimilar.filmId}>
                                                                        <div className={FilmStyle.similarScrol}>
                                                                            <img
                                                                                className={FilmStyle.img}
                                                                                src={filmSimilar.photo}
                                                                                alt=''
                                                                            />
                                                                        </div>
                                                                    </Link>
                                                                </SwiperSlide>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Swiper>
                                        </> : <></>
                                    }
                                </div>
                                <div className={FilmStyle.producer}>
                                    {producerFilms.length > 0 ?
                                        <>
                                            <h1>Producer Films</h1>
                                            <Swiper
                                                modules={[Navigation, A11y]}
                                                spaceBetween={50}
                                                slidesPerView={4}
                                                navigation
                                                breakpoints={{
                                                    0: {
                                                        slidesPerView: 1,
                                                        spaceBetween: 10,
                                                    },
                                                    600: {
                                                        slidesPerView: 2,
                                                        spaceBetween: 20,
                                                    },
                                                    800: {
                                                        slidesPerView: 3,
                                                        spaceBetween: 30,
                                                    },
                                                    1100: {
                                                        slidesPerView: 4,
                                                        spaceBetween: 40,
                                                    }
                                                }}
                                            >
                                                {
                                                    producerFilms.map((producerFilm: TypeFilm, i: number) => {
                                                        if (producerFilm.filmId !== film.filmId) {
                                                            return (
                                                                <SwiperSlide key={i}>
                                                                    <Link to={'/' + producerFilm.filmId}>
                                                                        <div className={FilmStyle.producerScrol}>
                                                                            <img
                                                                                className={FilmStyle.img}
                                                                                src={producerFilm.photo}
                                                                                alt=''
                                                                            />
                                                                        </div>
                                                                    </Link>
                                                                </SwiperSlide>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Swiper>
                                        </> : <></>
                                    }
                                </div>
                            </>
                        }
                    </>
                }
            </Container >
            <Footer />
        </>
    )
})
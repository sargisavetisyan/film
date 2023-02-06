import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { feachFilmsData, feachLikedFilms, feachTopFilms } from '../../features/film/filmApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { TypeFilm } from '../../types/film';
import ProfileStyle from './Profile.module.css';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { feachUser } from '../../features/user/userApi';
import { Admin } from '../../components/Admin';
import { Footer } from '../../components/Footer';
import ReactPaginate from 'react-paginate';

export const Profile: React.FC = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch()
    const { topFilms, loaddingTop, likedFilms } = useAppSelector(state => state.filmData)
    const { user } = useAppSelector(state => state.userData)
    const [temp, setTemp] = useState<number>(0)
    const [items, setItems] = useState<number>(6)
    let itemsPerPage: number = 6
    const [itemOffset, setItemOffset] = useState<number>(0);
    const pageCount: number = Math.ceil(likedFilms.length / itemsPerPage);

    const handlePageClick = (event: any): void => {
        setTemp(+event.selected)
        if (+event.selected > temp) {
            const newOffset: number = (event.selected * itemsPerPage) % likedFilms.length;
            setItemOffset(newOffset);
            setItems(items + itemsPerPage)
        } else {
            setItemOffset(itemOffset - itemsPerPage);
            setItems(items - itemsPerPage)
        }
    };

    useEffect(() => {
        if (!user.admin) {
            dispatch(feachFilmsData())
            dispatch(feachTopFilms())
            dispatch(feachLikedFilms(user.id))
        } else {
            dispatch(feachUser())
        }
    }, [dispatch])

    return (
        <div
            style={{ height: '100vh' }}
            className='d-flex flex-column justify-content-between'
        >
            <Container>
                <>
                    {loaddingTop === true ?
                        <div className={ProfileStyle.loadding}>
                            <ReactLoading
                                type={'spokes'}
                                color={' #FFC107'}
                                height={300}
                                width={300}
                            />
                        </div> : <>
                            {
                                user.admin === true ?
                                    <div>
                                        <Admin />
                                    </div>
                                    :
                                    <>
                                        {likedFilms.length > 6 ?
                                            <>
                                                <h1>Liked Films</h1>
                                                <div className={ProfileStyle.allFilms}>
                                                    {
                                                        likedFilms.map((film: TypeFilm, i: number) => {
                                                            if (i >= itemOffset && i < items) {
                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        className={ProfileStyle.allFilmsItem}
                                                                    >
                                                                        <Link
                                                                            to={'/' + film.filmId}
                                                                        >
                                                                            < img src={film.photo} alt='' />
                                                                            <div className={ProfileStyle.info}>
                                                                                <h4>{film.title}</h4>
                                                                                <div className={ProfileStyle.infoBody}>
                                                                                    <div>{film.year.value}</div>
                                                                                    <div> {film.time}</div>
                                                                                    {
                                                                                        film.rating >= 5 ?
                                                                                            <div className={ProfileStyle.infoRating}>{film.rating} </div>
                                                                                            :
                                                                                            <div
                                                                                                style={{ backgroundColor: '#4f5350' }}
                                                                                                className={ProfileStyle.infoRating}
                                                                                            >
                                                                                                {film.rating}
                                                                                            </div>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                                <div className={ProfileStyle.paginateSection}>
                                                    <ReactPaginate
                                                        activeClassName={ProfileStyle.active}
                                                        className={ProfileStyle.paginate}
                                                        breakLabel="..."
                                                        nextLabel=">>"
                                                        onPageChange={handlePageClick}
                                                        pageRangeDisplayed={5}
                                                        pageCount={pageCount}
                                                        previousLabel="<<"
                                                    />
                                                </div>
                                            </>
                                            :
                                            <>
                                                {
                                                    likedFilms.length > 0 ?
                                                        <>
                                                            <h1>Liked Films</h1>
                                                            <div className={ProfileStyle.allFilms}>
                                                                {
                                                                    likedFilms.map((film: TypeFilm, i: number) => {
                                                                        return (
                                                                            <div
                                                                                key={i}
                                                                                className={ProfileStyle.allFilmsItem}
                                                                            >
                                                                                <Link
                                                                                    to={'/' + film.filmId}
                                                                                >
                                                                                    < img src={film.photo} alt='' />
                                                                                    <div className={ProfileStyle.info}>
                                                                                        <h4>{film.title}</h4>
                                                                                        <div className={ProfileStyle.infoBody}>
                                                                                            <div>{film.year.value}</div>
                                                                                            <div> {film.time}</div>
                                                                                            {
                                                                                                film.rating >= 5 ?
                                                                                                    <div className={ProfileStyle.infoRating}>{film.rating} </div>
                                                                                                    :
                                                                                                    <div
                                                                                                        style={{ backgroundColor: '#4f5350' }}
                                                                                                        className={ProfileStyle.infoRating}
                                                                                                    >
                                                                                                        {film.rating}
                                                                                                    </div>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </Link>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </>
                                                        :
                                                        <h5>you don't have a liked movie</h5>
                                                }
                                            </>
                                        }
                                        <div className={ProfileStyle.topFilms}>
                                            <>
                                                <h1>Top films</h1>
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
                                                        topFilms.map((film: TypeFilm, i: number) => {
                                                            return (
                                                                <SwiperSlide key={i}>
                                                                    <Link to={'/' + film.filmId}>
                                                                        <div className={ProfileStyle.TopFilmsScrol}>
                                                                            <img
                                                                                className={ProfileStyle.img}
                                                                                src={film.photo}
                                                                                alt=''
                                                                            />
                                                                        </div>
                                                                    </Link>
                                                                </SwiperSlide>
                                                            )
                                                        })
                                                    }
                                                </Swiper>
                                            </>
                                        </div>
                                    </>
                            }
                        </>
                    }
                </>
            </Container >
            <Footer />
        </div>
    )
})
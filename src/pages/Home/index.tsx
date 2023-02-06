import React, { useEffect, useState } from 'react';
import HomeStyle from './Home.module.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { TypeGenre } from '../../types/genre';
import { TypeFilm } from '../../types/film';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { feachFilmByGenre, feachFilmsData } from '../../features/film/filmApi';
import { TypeSelect } from '../../types/select';
import { TopFilmCarusel } from '../../components/TopFilmCarusel';
import ReactPaginate from 'react-paginate';
import { Footer } from '../../components/Footer';

export const Home: React.FC = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch()
    const { films } = useAppSelector(state => state.filmData)
    const { genres } = useAppSelector(state => state.filmData)
    const [temp, setTemp] = useState<number>(0)
    const [items, setItems] = useState<number>(10)
    let itemsPerPage: number = 10
    const [itemOffset, setItemOffset] = useState<number>(0);
    const pageCount: number = Math.ceil(films.length / itemsPerPage);

    const handlePageClick = (event: any) => {
        setTemp(+event.selected)
        if (+event.selected > temp) {
            const newOffset: number = (event.selected * itemsPerPage) % films.length;
            setItemOffset(newOffset);
            setItems(items + itemsPerPage)
        } else {
            setItemOffset(itemOffset - itemsPerPage);
            setItems(items - itemsPerPage)
        }
    };

    useEffect(() => {
        dispatch(feachFilmsData())
        dispatch(feachFilmByGenre())
    }, [])

    return (
        <>
            <Container>
                <div className={HomeStyle.body}>
                    <TopFilmCarusel />
                    <div className={HomeStyle.genreScrolSection}>
                        <h1>Genres</h1>
                        <Swiper
                            modules={[Navigation]}
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
                                genres.map((genre: TypeGenre, i: number) => {
                                    return (
                                        <SwiperSlide key={i}  >
                                            <Link to={'film/' + genre.genre} className='text-decoration-none'>
                                                <div className={HomeStyle.genreScrol}>
                                                    <h2>{genre.genre}</h2>
                                                    <img
                                                        className={HomeStyle.img}
                                                        src={genre.image}
                                                        alt=''
                                                    />
                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    )
                                })
                            }
                        </Swiper>
                    </div>
                    <h1>All Films</h1>
                    <div className={HomeStyle.allFilmsSection}>
                        {
                            films.map((film: TypeFilm, i: number) => {
                                if (i >= itemOffset && i < items) {
                                    return (
                                        <Link className={HomeStyle.allFilmsLink} key={i} to={'/' + film.filmId}>
                                            <div className={HomeStyle.allFilmsItem}>
                                                < img src={film.photo} alt='' />
                                                <div className={HomeStyle.info}>
                                                    <div className={HomeStyle.infoBody}>
                                                        {film.rating >= 7 ?
                                                            <div className={HomeStyle.infoRating}>{film.rating} </div> :
                                                            <div style={{ backgroundColor: '#4f5350' }} className={HomeStyle.infoRating}>{film.rating} </div>}
                                                        {film.genre.map((genr: TypeSelect, i: number) => {
                                                            if (i < 2) {
                                                                return (
                                                                    <div key={i}>{genr.value}</div>
                                                                )
                                                            }
                                                        })}
                                                        <div>{film.year.value}</div>
                                                        <div> {film.time}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                }
                            })
                        }
                    </div>
                    <div className={HomeStyle.paginateSection}>
                        <ReactPaginate
                            activeClassName={HomeStyle.active}
                            className={HomeStyle.paginate}
                            breakLabel="..."
                            nextLabel=">>"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="<<"
                        />
                    </div>

                </div >
            </Container >
            <Footer />
        </>
    )
})
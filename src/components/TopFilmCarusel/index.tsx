import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { feachTopFilms } from "../../features/film/filmApi";
import ReactLoading from 'react-loading';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { TypeFilm } from "../../types/film";
import { Link } from "react-router-dom";
import TopFilmStyle from './TopFilm.module.css';

export const TopFilmCarusel: React.FC = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch()
    const { topFilms, loaddingTop } = useAppSelector(state => state.filmData)

    useEffect(() => {
        dispatch(feachTopFilms())
    }, [dispatch])
    return (
        <>
            {loaddingTop === true ?
                <div className={TopFilmStyle.loadding}>
                    <ReactLoading type={'spokes'} color={'#FFC107'} height={300} width={300} />
                </div>
                :
                <div>
                    <h1>Recommendations</h1>
                    <Swiper className={TopFilmStyle.swiper}
                        modules={[EffectCoverflow, Navigation, Autoplay]}
                        slidesPerView={3}
                        spaceBetween={50}
                        effect="coverflow"
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                            990: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 50,
                            }
                        }}
                        navigation
                        autoplay={true}
                    >
                        {
                            topFilms.map((film: TypeFilm, i: number) => {
                                return (
                                    <SwiperSlide className={TopFilmStyle.slide} key={i}>
                                        <Link to={'/' + film.filmId}>
                                            <div className={TopFilmStyle.item}>
                                                <img
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
                </div>
            }
        </>
    )
})
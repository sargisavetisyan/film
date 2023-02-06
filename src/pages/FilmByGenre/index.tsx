import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FeachByGenreFilms } from '../../features/film/filmApi';
import ReactLoading from 'react-loading';
import GenreStyle from './Genre.module.css';
import { TypeFilm } from '../../types/film';
import ReactPaginate from 'react-paginate';
import { byRating, byYear } from '../../features/film/filmSlice';
import { Footer } from '../../components/Footer';

export const FilmByGenre: React.FC = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch()
    const { filmsByGenre, loaddingBYGenre } = useAppSelector(state => state.filmData)
    const [selected, setSelected] = useState<string>('All films')
    const { genre } = useParams<string>()
    let options: string[] = ['By rating', 'By release date']
    const [temp, setTemp] = useState<number>(0)
    const [items, setItems] = useState<number>(8)
    let itemsPerPage: number = 8
    const [itemOffset, setItemOffset] = useState<number>(0);
    const pageCount: number = Math.ceil(filmsByGenre.length / itemsPerPage);


    const changeSelectValue = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelected(e.target.value)
        if (e.target.value === 'By rating') {
            dispatch(byRating())
        } else if (e.target.value === 'By release date') {
            dispatch(byYear())
        } else {
            dispatch(FeachByGenreFilms(genre?.toString()))
        }
    }

    const handlePageClick = (event: any) => {
        setTemp(+event.selected)
        if (+event.selected > temp) {
            const newOffset: number = (event.selected * itemsPerPage) % filmsByGenre.length;
            setItemOffset(newOffset);
            setItems(items + itemsPerPage)
        } else {
            setItemOffset(itemOffset - itemsPerPage);
            setItems(items - itemsPerPage)
        }
    };

    useEffect(() => {

    }, [selected])

    useEffect(() => {
        dispatch(FeachByGenreFilms(genre?.toString()))
    }, [genre])

    return (
        <>
            <Container>
                {loaddingBYGenre === true ?
                    <div className={GenreStyle.loadding}>
                        <ReactLoading type={'spokes'} color={'#FFC107'} height={300} width={300} />
                    </div>
                    :
                    <>
                        <h1>{genre}</h1>
                        <div className={GenreStyle.sectionSelect}>
                            <select
                                value={selected}
                                className={GenreStyle.select}
                                onChange={changeSelectValue}
                            >
                                <option>All films</option>
                                {
                                    options.map((option: string, i: number) => {
                                        return (
                                            <option
                                                key={i}
                                            >
                                                {option}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        {filmsByGenre.length > 7 ?
                            <>
                                <div className={GenreStyle.allFilms}>
                                    {
                                        filmsByGenre.map((film: TypeFilm, i: number) => {
                                            if (i >= itemOffset && i < items) {
                                                return (
                                                    <div
                                                        key={i}
                                                        className={GenreStyle.allFilmsItem}
                                                    >
                                                        <Link
                                                            to={'/' + film.filmId}
                                                        >
                                                            < img src={film.photo} alt='' />
                                                            <div className={GenreStyle.info}>
                                                                <h4>{film.title}</h4>
                                                                <div className={GenreStyle.infoBody}>
                                                                    <div>{film.year.value}</div>
                                                                    <div> {film.time}</div>
                                                                    {film.rating >= 5 ?
                                                                        <div className={GenreStyle.infoRating}>{film.rating} </div> :
                                                                        <div style={{ backgroundColor: '#4f5350' }} className={GenreStyle.infoRating}>{film.rating} </div>}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                <div className={GenreStyle.paginateSection}>
                                    <ReactPaginate
                                        activeClassName={GenreStyle.active}
                                        className={GenreStyle.paginate}
                                        breakLabel="..."
                                        nextLabel=">>"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={5}
                                        pageCount={pageCount}
                                        previousLabel="<<"
                                    />
                                </div>
                            </> :
                            <div className={GenreStyle.allFilms}>
                                {
                                    filmsByGenre.map((film: TypeFilm, i: number) => {
                                        return (
                                            <div
                                                key={i}
                                                className={GenreStyle.allFilmsItem}
                                            >
                                                <Link
                                                    to={'/' + film.filmId}
                                                >
                                                    < img src={film.photo} alt='' />
                                                    <div className={GenreStyle.info}>
                                                        <h4>{film.title}</h4>
                                                        <div className={GenreStyle.infoBody}>
                                                            <div>{film.year.value}</div>
                                                            <div> {film.time}</div>
                                                            {film.rating >= 5 ?
                                                                <div className={GenreStyle.infoRating}>{film.rating} </div> :
                                                                <div style={{ backgroundColor: '#4f5350' }} className={GenreStyle.infoRating}>{film.rating} </div>}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </>
                }
            </Container>
            <Footer />
        </>
    )
})
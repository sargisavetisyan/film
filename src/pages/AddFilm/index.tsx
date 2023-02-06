import React, { useCallback, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { TypeFilm } from "../../types/film";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { feachActorData, feachCountryData, feachGenreData, feachProducerData, feachTranslationData, feachYearData } from "../../features/film/filmApi";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import AddFilmStyle from './AddFilm.module.css';
import { useForm, Controller } from "react-hook-form";
import { Footer } from "../../components/Footer";

export const AddFilm: React.FC = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch()
    const { yearOptions, genreOptions, translationOptions, producerOptions, countryOptions, actorOptions } = useAppSelector(state => state.filmData)

    const filmCollection = collection(db, 'films')

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<TypeFilm>()

    useEffect(() => {
        dispatch(feachYearData())
        dispatch(feachGenreData())
        dispatch(feachTranslationData())
        dispatch(feachProducerData())
        dispatch(feachCountryData())
        dispatch(feachActorData())
    }, [])

    const saveFilm = useCallback(async (info: TypeFilm): Promise<void> => {
        let res = await addDoc(filmCollection, {
            title: info.title,
            year: info.year,
            genre: info.genre,
            translations: info.translations,
            producer: info.producer,
            country: info.country,
            actors: info.actors,
            time: info.time,
            rating: 0,
            allRating: [],
            users: [],
            liked: [],
            description: info.description,
            filmId: Date.now()
        })

        let file: any = info.photo[0]
        const image = ref(storage, "images/" + Date.now() + file.name);
        uploadBytesResumable(image, file)
            .then(snapshot => {
                getDownloadURL(snapshot.ref)
                    .then(async url => {
                        await updateDoc(res, {
                            photo: url
                        });
                    })
            })
            .catch(err => {
                console.error("Upload failed", err);
            })
        let kino: any = info.video[0]
        console.log(kino);

        const video = ref(storage, "videos/" + Date.now() + file.name);
        uploadBytesResumable(video, kino)
            .then(snapshot => {
                getDownloadURL(snapshot.ref)
                    .then(async url => {
                        await updateDoc(res, {
                            video: url
                        });
                    })
            })
            .catch(err => {
                console.error("Upload failed", err);
            })
        reset()
    }, [reset])

    return (
        <div className={AddFilmStyle.form}>
            <Container>
                <div className={AddFilmStyle.body}>
                    <h2>Add New Film</h2>
                    <Form onSubmit={handleSubmit(saveFilm)}>
                        <div className={AddFilmStyle.title}>
                            <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                                <Form.Label >Title</Form.Label>
                                <Form.Control className={AddFilmStyle.input} type="text" placeholder="Name" {...register('title')} />
                            </Form.Group>
                            <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control className={AddFilmStyle.input} type="time" {...register('time')} />
                            </Form.Group>
                        </div>
                        <div className={AddFilmStyle.selects}>
                            <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                                <Controller
                                    name='year'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                        <Select
                                            placeholder='Year'
                                            onChange={onChange}
                                            options={yearOptions}
                                            isClearable
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                                <Controller
                                    name='genre'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                        <Select
                                            isMulti
                                            onChange={onChange}
                                            placeholder='Genres'
                                            options={genreOptions}
                                            isClearable
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                                <Controller
                                    name='translations'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                        <Select
                                            isMulti
                                            placeholder='Translations'
                                            onChange={onChange}
                                            options={translationOptions}
                                            isClearable
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                                <Controller
                                    name='producer'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                        <Select
                                            placeholder='Producer'
                                            onChange={onChange}
                                            options={producerOptions}
                                            isClearable
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                                <Controller
                                    name='actors'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                        <Select
                                            isMulti
                                            placeholder='Actors'
                                            onChange={onChange}
                                            options={actorOptions}
                                            isClearable
                                        />
                                    )}
                                />
                            </Form.Group>
                            <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                                <Controller
                                    name='country'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange } }) => (
                                        <Select
                                            placeholder='Country'
                                            onChange={onChange}
                                            options={countryOptions}
                                            isClearable
                                        />
                                    )}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                            <Form.Label >Video</Form.Label>
                            <Form.Control className={AddFilmStyle.input} type="file" placeholder="Video" {...register('video')} />
                        </Form.Group>
                        <Form.Group className={AddFilmStyle.Item} controlId="formBasicEmail">
                            <Form.Label>Photo</Form.Label>
                            <Form.Control className={AddFilmStyle.input} type="file" placeholder="Photo" {...register('photo')} />
                        </Form.Group>
                        <Form.Group className={AddFilmStyle.Item} controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control className={AddFilmStyle.input} as="textarea" rows={3}  {...register('description')} />
                        </Form.Group>
                        <div className={AddFilmStyle.btnItem}>
                            <Button className={AddFilmStyle.btnAdd} type="submit" >
                                Save Film
                            </Button>
                        </div>
                    </Form>
                </div>
            </Container >
            <Footer />
        </div>
    )
})
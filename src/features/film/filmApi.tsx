
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import { TypeFilm } from "../../types/film";
import { TypeGenre } from "../../types/genre";
import { TypeSelect } from "../../types/select";


//****All Films ****//
export const feachFilmsData = createAsyncThunk('films/get', async () => {
    const filmCollection = collection(db, 'films')
    let data = await getDocs(filmCollection)
    let arr: TypeFilm[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

//****Films By Genre  by  genreCollection****//

export const feachFilmByGenre = createAsyncThunk('bygenre/get', async () => {
    const genreCollection = collection(db, 'genre')
    let data = await getDocs(genreCollection)
    let arr: TypeGenre[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

//****Films By Genre  by  filmCollection****//

export const FeachByGenreFilms = createAsyncThunk('genreee/get', async (genre: string | undefined) => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('genre', "array-contains", { value: genre, label: genre }))
    let data = await getDocs(q)
    let arr: any[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

//****Detalis Film ****//      

export const feachFilmDetalis = createAsyncThunk('film/get', async (id: number) => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('filmId', '==', id))
    let data = await getDocs(q)
    let kino = { id: data.docs[0].id, ...data.docs[0].data() }
    return kino
})

// **** Film Similar **** \\

export const similarFilms = createAsyncThunk('similar/get', async (genre: string) => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('genre', "array-contains", { value: genre, label: genre }))
    let data = await getDocs(q)
    let arr: TypeFilm[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

// **** Film Producer **** \\

export const produserFilms = createAsyncThunk('produser/get', async (value: string) => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('producer', "==", { value: value, label: value }))
    let data = await getDocs(q)
    let arr: TypeFilm[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

// **** Film Search Input **** \\  
//**** By Title ****//
export const InputSearchByTitle = createAsyncThunk('title/get', async (value: string) => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('title', '==', value))
    let data = await getDocs(q)
    let arr: TypeFilm[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

//**** By Producer ****//
export const InputSearchByProducer = createAsyncThunk('byproducer/get', async (value: string) => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('producer', "==", { value: value, label: value }))
    let data = await getDocs(q)
    let arr: TypeFilm[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

//**** BY Actors ****//
export const InputSearchByActors = createAsyncThunk('byactors/get', async (value: string) => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('actors', "array-contains", { value: value, label: value }))
    let data = await getDocs(q)
    let arr: TypeFilm[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

// **** Top Films **** \\

export const feachTopFilms = createAsyncThunk('top/get', async () => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('rating', '>=', 7))
    let data = await getDocs(q)
    let arr: TypeFilm[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

// **** Subscribe Films **** \\*************************************************************

export const feachLikedFilms = createAsyncThunk('like/get', async (value: string) => {
    const filmCollection = collection(db, 'films')
    let q = query(filmCollection, where('liked', "array-contains", { id: value, like: true }))
    let data = await getDocs(q)
    let arr: TypeFilm[] = []
    data.forEach((elm: any) => {
        arr.push({ id: elm.id, ...elm.data() })
    })
    return arr
})

export const feachYearData = createAsyncThunk('year/get', async () => {
    const yearCollection = collection(db, 'year')
    let data = await getDocs(yearCollection)
    let arr: TypeSelect[] = []
    data.forEach((elm: any) => {
        let v = elm.data().value
        arr.push({ label: v, value: v })
    })
    return arr
})

export const feachGenreData = createAsyncThunk('genre/get', async () => {
    const genreCollection = collection(db, 'genreOptions')
    let data = await getDocs(genreCollection)
    let arr: TypeSelect[] = []
    data.forEach((elm: any) => {
        let v = elm.data().value
        arr.push({ label: v, value: v })
    })
    return arr
})

export const feachTranslationData = createAsyncThunk('translation/get', async () => {
    const translationCollection = collection(db, 'translation')
    let data = await getDocs(translationCollection)
    let arr: TypeSelect[] = []
    data.forEach((elm: any) => {
        let v = elm.data().value
        arr.push({ label: v, value: v })
    })
    return arr
})

export const feachProducerData = createAsyncThunk('producer/get', async () => {
    const producerCollection = collection(db, 'producer')
    let data = await getDocs(producerCollection)
    let arr: TypeSelect[] = []
    data.forEach((elm: any) => {
        let v = elm.data().value
        arr.push({ label: v, value: v })
    })
    return arr
})

export const feachCountryData = createAsyncThunk('country/get', async () => {
    const countryCollection = collection(db, 'country')
    let data = await getDocs(countryCollection)
    let arr: TypeSelect[] = []
    data.forEach((elm: any) => {
        let v = elm.data().value
        arr.push({ label: v, value: v })
    })
    return arr
})

export const feachActorData = createAsyncThunk('actor/get', async () => {
    const actorCollection = collection(db, 'actor')
    let data = await getDocs(actorCollection)
    let arr: TypeSelect[] = []
    data.forEach((elm: any) => {
        let v = elm.data().value
        arr.push({ label: v, value: v })
    })
    return arr
})



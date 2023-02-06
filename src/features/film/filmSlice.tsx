import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypeComment } from "../../types/comment";
import { TypeFilm } from "../../types/film";
import { TypeGenre } from "../../types/genre";
import { TypeSelect } from "../../types/select";
import {
    feachActorData,
    feachCountryData,
    feachFilmsData,
    feachGenreData,
    feachProducerData,
    feachTranslationData,
    feachYearData,
    feachFilmDetalis,
    similarFilms,
    feachTopFilms,
    feachFilmByGenre,
    FeachByGenreFilms,
    produserFilms,
    InputSearchByTitle,
    InputSearchByProducer,
    InputSearchByActors,
    feachLikedFilms
} from "./filmApi";


export interface FilmInterface {
    items: number[],
    currentItems: number[],
    films: TypeFilm[],
    topFilms: TypeFilm[],
    filmSimilars: TypeFilm[],
    producerFilms: TypeFilm[],
    filmsByGenre: TypeFilm[],
    inputSearchFilms: TypeFilm[],
    likedFilms: TypeFilm[],
    film: any,
    filmComments: TypeComment[],
    yearOptions: TypeSelect[],
    genreOptions: TypeSelect[],
    translationOptions: TypeSelect[],
    producerOptions: TypeSelect[],
    countryOptions: TypeSelect[],
    actorOptions: TypeSelect[],
    genres: TypeGenre[],
    loadding: boolean,
    loaddingTop: boolean,
    loaddingBYGenre: boolean,
    loaddingInput: boolean,
}

const initialState: FilmInterface = {
    items: [],
    currentItems: [],
    films: [],
    topFilms: [],
    filmSimilars: [],
    producerFilms: [],
    filmsByGenre: [],
    inputSearchFilms: [],
    likedFilms: [],
    film: {} as any,
    filmComments: [],
    yearOptions: [],
    genreOptions: [],
    translationOptions: [],
    producerOptions: [],
    countryOptions: [],
    actorOptions: [],
    genres: [],
    loadding: false,
    loaddingTop: false,
    loaddingBYGenre: false,
    loaddingInput: false,
}

export const filmSlice = createSlice({
    name: 'film',
    initialState,
    reducers: {
        byRating: (state) => {
            state.filmsByGenre.sort((a, b) => +b.rating - +a.rating)
        },
        byYear: (state) => {
            state.filmsByGenre.sort((a, b) => +b.year.value - +a.year.value)
        },
        clearInputSearch: (state) => {
            state.inputSearchFilms = []
        },
        createItems: (state, action: PayloadAction<number[]>) => {
            state.items = [...action.payload]
        },
        createCurrentItems: (state, action: PayloadAction<number[]>) => {
            state.currentItems = [...action.payload]
        },
        getComments: (state, action: PayloadAction<TypeComment[]>) => {
            state.filmComments.push(action.payload[0])
        }
    },

    extraReducers: (builder) => {
        //****for select ****// 
        builder.addCase(feachYearData.fulfilled, (state, action) => {
            state.yearOptions = action.payload
        })
        builder.addCase(feachGenreData.fulfilled, (state, action) => {
            state.genreOptions = action.payload
        })
        builder.addCase(feachTranslationData.fulfilled, (state, action) => {
            state.translationOptions = action.payload
        })
        builder.addCase(feachProducerData.fulfilled, (state, action) => {
            state.producerOptions = action.payload
        })
        builder.addCase(feachCountryData.fulfilled, (state, action) => {
            state.countryOptions = action.payload
        })
        builder.addCase(feachActorData.fulfilled, (state, action) => {
            state.actorOptions = action.payload
        })

        // ********************* || ********************* \\

        //****All Film ****// 

        builder.addCase(feachFilmsData.fulfilled, (state, action) => {
            state.films = action.payload
        })

        // ********************* || ********************* \\

        //****Films By Genre  For Genre Slyder  ****//

        builder.addCase(feachFilmByGenre.fulfilled, (state, action) => {
            state.genres = action.payload
        })

        // ********************* || ********************* \\

        //****detalis Film ****//

        builder.addCase(feachFilmDetalis.fulfilled, (state, action) => {
            state.film = action.payload || {} as any
            state.loadding = false
        })
        builder.addCase(feachFilmDetalis.pending, (state, action) => {
            state.loadding = true
        })

        // ********************* || ********************* \\

        //****Film Simila ****//

        builder.addCase(similarFilms.fulfilled, (state, action) => {
            state.filmSimilars = action.payload
        })

        // ********************* || ********************* \\

        //**** Film Producer **** \\

        builder.addCase(produserFilms.fulfilled, (state, action) => {
            state.producerFilms = action.payload
        })

        // ********************* || ********************* \\

        //****Top Film****//

        builder.addCase(feachTopFilms.fulfilled, (state, action) => {
            state.topFilms = action.payload
            state.loaddingTop = false
        })
        builder.addCase(feachTopFilms.pending, (state, action) => {
            state.loaddingTop = true
        })

        // ********************* || ********************* \\

        //****Films By Genre  by  filmCollection****//

        builder.addCase(FeachByGenreFilms.fulfilled, (state, action) => {
            state.filmsByGenre = action.payload
            state.loaddingBYGenre = false
        })
        builder.addCase(FeachByGenreFilms.pending, (state, action) => {
            state.loaddingBYGenre = true
        })

        // ********************* || ********************* \\

        //****Films Input Search****//

        //**** For Title ****//
        builder.addCase(InputSearchByTitle.fulfilled, (state, action) => {
            state.inputSearchFilms = action.payload
            state.loaddingInput = false
        })
        builder.addCase(InputSearchByTitle.pending, (state, action) => {
            state.loaddingInput = true
        })

        //**** For Producer ****//
        builder.addCase(InputSearchByProducer.fulfilled, (state, action) => {
            state.inputSearchFilms = action.payload
            state.loaddingInput = false
        })
        builder.addCase(InputSearchByProducer.pending, (state, action) => {
            state.loaddingInput = true
        })

        //**** For Actors ****//
        builder.addCase(InputSearchByActors.fulfilled, (state, action) => {
            state.inputSearchFilms = action.payload
            state.loaddingInput = false
        })
        builder.addCase(InputSearchByActors.pending, (state, action) => {
            state.loaddingInput = true
        })
        // ********************* || ********************* \\

        // **** For Subscribe Films **** \\
        builder.addCase(feachLikedFilms.fulfilled, (state, action) => {
            state.likedFilms = action.payload
        })
    }
})

export default filmSlice.reducer

export const { clearInputSearch, createItems, createCurrentItems, getComments, byRating, byYear } = filmSlice.actions
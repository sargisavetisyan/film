import { LikedUser } from "./likedUser"
import { TypeSelect } from "./select"
// import { TypeVideo } from "./video"

export type TypeFilm = {
    id: string,    //string
    title: string,
    year: TypeSelect,
    genre: TypeSelect[],
    translations: TypeSelect[],
    producer: TypeSelect,
    country: TypeSelect,
    actors: TypeSelect[],
    time: string,
    rating: number,
    allRating: number[],
    users: number[],
    photo: string,
    video: string,   //zangvacov em uzum anem tarber luzuneri hamar
    description: string,
    filmId: number,
    liked: LikedUser[]
}
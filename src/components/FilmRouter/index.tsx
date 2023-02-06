import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../../pages/Home";
import { AddFilm } from "../../pages/AddFilm";
import { FilmDetalis } from "../../pages/FilmDetalis";
import { Profile } from "../../pages/Profile";
import { SignIn } from "../../pages/SignIn";
import { Layout } from "../Layout";
import { FilmByGenre } from "../../pages/FilmByGenre";
import { UserAuth } from "../UserAuth";
import { UserSettings } from "../../pages/UserSettings";
import { NotFound } from "../../pages/NotFound";

export const FilmRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Home />} />
                    <Route path="/:filmId" element={<FilmDetalis />} />
                    <Route path="film/:genre" element={<FilmByGenre />} />
                    <Route path="addFilm" element={<AddFilm />} />
                    <Route path="signIn" element={<SignIn />} />
                    <Route path="" element={<UserAuth />} >
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<UserSettings />} />
                    </Route>
                </Route>
                <Route path='*' element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}
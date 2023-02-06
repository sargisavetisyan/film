import React, { useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, Outlet, useNavigate, } from 'react-router-dom';
import LayoutStyle from './Layout.module.css';
import { BsSearch } from "react-icons/bs";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { OffcanvasSearch } from '../OffcanvasSearch';
import { Footer } from '../Footer';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FcSettings, FcExport } from "react-icons/fc";
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { setUser } from '../../features/user/userSlice';
import { TypeUser } from '../../types/user';

export const Layout = React.memo((): JSX.Element => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { user } = useAppSelector(state => state.userData)
    const [openCanvas, setOpenCanvas] = useState<boolean>(false)
    let activeClassName: string = "nav-link d-flex align-items-center  me-4 pe-3 ps-3  border  border-warning rounded text-decoration-none text-white";
    let deActiveClassName: string = "nav-link d-flex align-items-center  me-4 pe-3 ps-3 hover-white text-decoration-none text-secondary";
    let minHeightNavbar = 80
    const show = () => {
        setOpenCanvas(!openCanvas)
    }

    const logAuth = useCallback(() => {
        signOut(auth)
        dispatch(setUser({} as TypeUser))
        navigate('/')
    }, [dispatch, navigate])

    return (
        <div className='d-flex flex-column justify-content-between '>
            <Navbar
                collapseOnSelect
                expand="lg"
                bg="dark"
                variant="dark"
            >
                <Container>
                    {user.admin === true ?
                        <>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    <NavLink className={({ isActive }) =>
                                        isActive ? activeClassName : deActiveClassName
                                    }
                                        to="profile"
                                    >
                                        Admin
                                    </NavLink>
                                    <NavLink className={({ isActive }) =>
                                        isActive ? activeClassName : deActiveClassName
                                    }
                                        to="addFilm"
                                    >
                                        Add Film
                                    </NavLink>
                                </Nav>
                                <Nav>
                                    <NavDropdown
                                        title="Settings"
                                        id="collasible-nav-dropdown"
                                    >
                                        <NavDropdown.Item href="#action/3.1">
                                            <NavLink to="settings">
                                                <FcSettings className={LayoutStyle.iconSettings} /> <span>Settings</span>
                                            </NavLink>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">
                                            <NavLink
                                                onClick={logAuth}
                                                to="">
                                                <FcExport className={LayoutStyle.iconSettings} /> <span> Log Auth</span>
                                            </NavLink>
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </Navbar.Collapse>
                        </> :
                        <>
                            <NavLink className={LayoutStyle.logo}
                                to="/">
                                <img
                                    style={{ width: '50px' }}
                                    src={require('../../image/logo.png')}
                                    alt=''
                                />
                            </NavLink>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    <NavLink className={({ isActive }) =>
                                        isActive ? activeClassName : deActiveClassName
                                    }
                                        to=""
                                    >
                                        Home
                                    </NavLink>
                                    {user.name &&
                                        <NavLink className={({ isActive }) =>
                                            isActive ? activeClassName : deActiveClassName
                                        }
                                            to="profile"
                                        >
                                            Profile
                                        </NavLink>}
                                </Nav>
                                <Nav>
                                    <OffcanvasSearch
                                        minHeightNavbar={minHeightNavbar}
                                        openCanvas={openCanvas}
                                        onHide={() => setOpenCanvas(!openCanvas)}
                                    />
                                    <Nav.Link href="#">
                                        <BsSearch
                                            onClick={show}
                                            className={LayoutStyle.icon}
                                        />
                                    </Nav.Link>
                                    {!user.name &&
                                        <NavLink className={({ isActive }) =>
                                            isActive ? activeClassName : deActiveClassName
                                        }
                                            to="signIn"
                                        >
                                            Sign In
                                        </NavLink>}
                                    {user.name &&
                                        <NavDropdown
                                            title="Settings"
                                            id="collasible-nav-dropdown"
                                        >
                                            <NavDropdown.Item href="#action/3.1">
                                                <NavLink to="settings">
                                                    <FcSettings className={LayoutStyle.iconSettings} /> <span>Settings</span>
                                                </NavLink>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.3">
                                                <NavLink
                                                    onClick={logAuth}
                                                    to="">
                                                    <FcExport className={LayoutStyle.iconSettings} /> <span> Log Auth</span>
                                                </NavLink>
                                            </NavDropdown.Item>
                                        </NavDropdown>}
                                </Nav>
                            </Navbar.Collapse>
                        </>
                    }
                </Container>
            </Navbar>
            <Outlet />
        </div >
    )
})
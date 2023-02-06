import React from "react";
import FooterStyle from './Footer.module.css';
import Container from 'react-bootstrap/Container';
import { Logo } from "../Logo";

export const Footer: React.FC = React.memo((): JSX.Element => {
    return (
        <Container>
            <div className={FooterStyle.footer}>
                <Logo />
                <div>&copy; Sargis Avetisyan</div>
            </div>
        </Container>
    )
})
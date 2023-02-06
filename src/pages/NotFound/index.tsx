import React from "react";
import { Link } from "react-router-dom";
import NotFoundStyle from './NotFound.module.css';

export const NotFound: React.FC = React.memo((): JSX.Element => {
    return (
        <div className={NotFoundStyle.not}>
            <img src={require('../../image/pngegg.png')} alt="Not Found" />
            <Link className={NotFoundStyle.link} to='/'>&lt; Back</Link>
        </div>
    )
})
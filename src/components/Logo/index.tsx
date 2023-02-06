import React from 'react';
import LogoStyle from './Logo.module.css';

export const Logo: React.FC = React.memo((): JSX.Element => {
    return (
        <div className={LogoStyle.globe_container}>
            <div className={LogoStyle.globe}>
                <div className={LogoStyle.globe_sphere}></div>
                <div className={LogoStyle.globe_outer_shadow}></div>
                <div className={LogoStyle.globe_worldmap}>
                    <div className={LogoStyle.globe_worldmap_back}></div>
                    <div className={LogoStyle.globe_worldmap_front}></div>
                </div>
                <div className={LogoStyle.globe_inner_shadow}></div>
            </div>
        </div>
    )
})
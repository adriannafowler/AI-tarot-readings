import React from "react";
import videoSource from './bgvid.mp4';
import './bgvid.css';

export default function BackgroundVideo() {
    return (
        <div>
            <video loop autoPlay muted id="bg-video">
                <source src={videoSource} type="video/mp4" />
            </video>
        </div>
    );
}

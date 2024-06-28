import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './Intruction.scss';

function Intruction() {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="container">
            <div className="image-container">
                <div className="overlay-text">Hướng dẫn</div>
                <img
                    src="/assets/intruction_img.png"
                    className="card-img"
                    alt="..."
                    style={{ width: '100%', height: '50%', marginTop: '10px' }}
                />
            </div>
            <hr />
            <div className="pdf-viewer">
                <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js">
                    <div style={{ height: '750px' }}>
                        <Viewer
                            fileUrl="/assets/HDSD_SauDaiHoc_HocVien.pdf"
                            plugins={[defaultLayoutPluginInstance]}
                        />
                    </div>
                </Worker>
            </div>
        </div>
    );
}


export default Intruction;

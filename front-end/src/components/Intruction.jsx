import React from 'react'
import { Home } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Document, Page } from 'react-pdf';

function Intruction() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }


    return (
        <div>
            <div style={{ margin: '20px' }}>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb" style={{ fontSize: '15px' }}>
                        <li className="breadcrumb-item" style={{ alignItems: 'center' }}>
                            <Link style={{ textDecoration: 'none', color: 'black' }} to="/">
                                <Home />
                                <span>Trang chủ</span>
                            </Link>
                        </li>
                        <li className="breadcrumb-item" aria-current="page">Hướng dẫn</li>
                    </ol>
                </nav>
            </div>
            <div>
            <Document
                    file="D:\REACT\register\public\assets\HDSD_SauDaiHoc_HocVien.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
                <p>Page {pageNumber} of {numPages}</p>
            </div>
        </div>
    )
}

export default Intruction
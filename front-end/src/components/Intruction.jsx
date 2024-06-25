import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './Intruction.scss';

// Cấu hình worker của PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Instruction() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function goToPrevPage() {
        setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }

    function goToNextPage() {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }

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
                <div className="button-group">
                    <button className="navigation-button" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                        Trang trước
                    </button>
                    <button className="navigation-button" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                        Trang sau
                    </button>
                </div>
                <div className="document">
                    <Document
                        file="/assets/HDSD_SauDaiHoc_HocVien.pdf"
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber}
                            className="custom-pdf-page"
                            renderTextLayer={false} // Không render textContent
                            renderAnnotationLayer={false} // Không render annotations

                        />
                    </Document>
                    {numPages && (
                        <p className="page-info">
                            Trang {pageNumber} / {numPages}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Instruction;

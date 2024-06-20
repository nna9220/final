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
        <div class="container marketing">
            <hr class="featurette-divider" />
            <div class="row featurette">
                <div class="col-md-7">
                    <h2 class="featurette-heading">Xem thông tin các đề tài</h2>
                    <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
                </div>
                <div class="col-md-5">
                    <img></img>
                </div>
            </div>

            <hr class="featurette-divider" />

            <div class="row featurette">
                <div class="col-md-7 order-md-2">
                    <h2 class="featurette-heading">Xem thông tin liên lạc của Giảng viên</h2>
                    <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
                </div>
                <div class="col-md-5 order-md-1">
                    <img />
                </div>
            </div>

            <hr class="featurette-divider" />

            <div class="row featurette">
                <div class="col-md-7">
                    <h2 class="featurette-heading">Gửi liên hệ, thắc mắc</h2>
                    <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
                </div>
                <div class="col-md-5">
                    <img />
                </div>
            </div>

            <hr class="featurette-divider" />

        </div>
    )
}

export default Intruction
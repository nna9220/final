import React from 'react'
import './Chatbot.scss'

function Chatbot() {
    return (
        <div>
            <section >
                <div class="container py-5">

                    <div class="row d-flex justify-content-center">
                        <div class="col-md-8 col-lg-6 col-xl-4">

                            <div class="card" id="chat1" style={{borderRadius: '15px'}}>
                                <div
                                    class="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
                                    >
                                    <i class="fas fa-angle-left"></i>
                                    <p class="mb-0 fw-bold">Live chat</p>
                                    <i class="fas fa-times"></i>
                                </div>
                                <div class="card-body">

                                    <div class="d-flex flex-row justify-content-start mb-4">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                            alt="avatar 1"/>
                                            <div class="p-3 ms-3" >
                                                <p class="small mb-0">Hello and thank you for visiting MDBootstrap. Please click the video
                                                    below.</p>
                                            </div>
                                    </div>

                                    <div class="d-flex flex-row justify-content-end mb-4">
                                        <div class="p-3 me-3 border" >
                                            <p class="small mb-0">Thank you, I really like your product.</p>
                                        </div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                            alt="avatar 1"/>
                                    </div>

                                    <div class="d-flex flex-row justify-content-start mb-4">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                            alt="avatar 1"/>
                                            <div class="ms-3">
                                                <div class="bg-image">
                                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/screenshot1.webp"
                                                        />
                                                        <a href="#!">
                                                            <div class="mask"></div>
                                                        </a>
                                                </div>
                                            </div>
                                    </div>

                                    <div class="d-flex flex-row justify-content-start mb-4">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                            alt="avatar 1"/>
                                            <div class="p-3 ms-3">
                                                <p class="small mb-0">...</p>
                                            </div>
                                    </div>

                                    <div class="form-outline">
                                        <textarea class="form-control" id="textAreaExample" rows="4"></textarea>
                                        <label class="form-label" for="textAreaExample">Type your message</label>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Chatbot
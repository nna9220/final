import React from 'react'

function Contact() {
    return (
        <div className="hero">
            <div className="card text-bg-white">
                <img src="/assets/contact.jpg" className="card-img" alt="..." />
                <hr />
                <div className='homeconainer'>
                    <div>
                        <div class="container-fluid px-5 my-5">
                            <div class="row justify-content-center">
                                <div class="col-xl-10">
                                    <div class="card border-0 rounded-3 shadow-lg overflow-hidden">
                                        <div class="card-body p-0">
                                            <div class="row g-0">
                                                <div class="col-sm-6 d-none d-sm-block bg-image">
                                                    <img src='/assets/email2.jpg' width='560px' style={{marginTop:'80px', marginLeft:'30px'}}></img>
                                                </div>
                                                <div class="col-sm-6 p-4">
                                                    <div class="text-center">
                                                        <div class="h3 fw-light">LIÊN HỆ</div>
                                                        <p class="mb-4 text-muted">Để lại thông tin và nội dung liên hệ dưới đây!</p>
                                                    </div>

                                                    <form id="contactForm" data-sb-form-api-token="API_TOKEN">

                                                        <div class="form-floating mb-3">
                                                            <input class="form-control" id="name" type="text" placeholder="Name" data-sb-validations="required" />
                                                            <label for="name">Họ và tên</label>
                                                            <div class="invalid-feedback" data-sb-feedback="name:required">Name is required.</div>
                                                        </div>

                                                        <div class="form-floating mb-3">
                                                            <input class="form-control" id="name" type="text" placeholder="Name" data-sb-validations="required" />
                                                            <label for="name">Số điện thoại</label>
                                                            <div class="invalid-feedback" data-sb-feedback="name:required">Name is required.</div>
                                                        </div>

                                                        <div class="form-floating mb-3">
                                                            <input class="form-control" id="emailAddress" type="email" placeholder="Email Address" data-sb-validations="required,email" />
                                                            <label for="emailAddress">Email </label>
                                                            <div class="invalid-feedback" data-sb-feedback="emailAddress:required">Email Address is required.</div>
                                                            <div class="invalid-feedback" data-sb-feedback="emailAddress:email">Email Address Email is not valid.</div>
                                                        </div>

                                                        <div class="form-floating mb-3">
                                                            <textarea class="form-control" id="message" type="text" placeholder="Message" style={{height: '10rem'}} data-sb-validations="required"></textarea>
                                                            <label for="message">Nội dung</label>
                                                            <div class="invalid-feedback" data-sb-feedback="message:required">Message is required.</div>
                                                        </div>

                                                        <div class="d-none" id="submitSuccessMessage">
                                                            <div class="text-center mb-3">
                                                                <div class="fw-bolder">Form submission successful!</div>
                                                                <p>To activate this form, sign up at</p>
                                                                <a href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
                                                            </div>
                                                        </div>

                                                        <div class="d-none" id="submitErrorMessage">
                                                            <div class="text-center text-danger mb-3">Error sending message!</div>
                                                        </div>

                                                        <div class="d-grid">
                                                            <button class="btn btn-primary btn-lg disabled" id="submitButton" type="submit">Submit</button>
                                                        </div>
                                                    </form>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../API/axios';
import { Helmet } from 'react-helmet';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        content: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = new URLSearchParams();
        payload.append('name', formData.name);
        payload.append('email', formData.email);
        payload.append('phone', formData.phone);
        payload.append('content', formData.content);

        axiosInstance.post(`/public/contact/create`, payload.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                console.log("Đã gửi thắc mắc thành công");
                toast.success("Đã gửi thắc mắc thành công!");
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    content: ''
                });
                
            })
            .catch(error => {
                if (error.response) {
                    console.log("Error Response Data:", error.response.data);
                    console.log("Error Response Status:", error.response.status);
                    console.log("Error Response Headers:", error.response.headers);
                    toast.error(`Đã gửi thắc mắc thất bại! ${error.response.data.message || 'Something went wrong.'}`);
                } else if (error.request) {
                    console.log("Error Request:", error.request);
                    toast.error("No response received from the server!");
                } else {
                    console.log("Error Message:", error.message);
                    toast.error("Error occurred while setting up the request!");
                }
            });
    };

    return (
        <div className="hero">
             <Helmet>
                <title>Liên hệ</title>
            </Helmet>
            <ToastContainer />
            <div className="card text-bg-white">
                <img src="/assets/contact.jpg" className="card-img" alt="..." />
                <hr />
                <div className='homeconainer'>
                    <div>
                        <div className="container-fluid px-5 my-5">
                            <div className="row justify-content-center">
                                <div className="col-xl-10">
                                    <div className="card border-0 rounded-3 shadow-lg overflow-hidden">
                                        <div className="card-body p-0">
                                            <div className="row g-0">
                                                <div className="col-sm-6 d-none d-sm-block bg-image">
                                                    <img src='/assets/email2.jpg' width='500vw' style={{ marginTop: '80px', marginLeft: '30px' }}></img>
                                                </div>
                                                <div className="col-sm-6 p-4">
                                                    <div className="text-center">
                                                        <div className="h3 fw-light">LIÊN HỆ</div>
                                                        <p className="mb-4 text-muted">Để lại thông tin và nội dung liên hệ dưới đây!</p>
                                                    </div>
                                                    <form id="contactForm" onSubmit={handleSubmit}>
                                                        <div className="form-floating mb-3">
                                                            <input className="form-control" id="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required />
                                                            <label htmlFor="name">Họ và tên</label>
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <input className="form-control" id="phone" type="text" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                                                            <label htmlFor="phone">Số điện thoại</label>
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <input className="form-control" id="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                                                            <label htmlFor="email">Email</label>
                                                        </div>
                                                        <div className="form-floating mb-3">
                                                            <textarea className="form-control" id="content" placeholder="Content" value={formData.content} onChange={handleChange} style={{ height: '10rem' }} required></textarea>
                                                            <label htmlFor="content">Nội dung</label>
                                                        </div>
                                                        <div className="d-grid">
                                                            <button className="btn btn-primary btn-lg" id="submitButton" type="submit">Gửi liên hệ</button>
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
    );
}

export default Contact;

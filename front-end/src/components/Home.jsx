import React from 'react'
import Chatbot from './ChatBot/Chatbot'
import { useEffect } from 'react';
function Home() {
    useEffect(() => {
        document.title = "Trang chủ";
      }, []);
    return (
        <div class="hero">
            <div class="card text-bg-white">
                <img src="/assets/Home_logo.jpg" class="card-img" alt="..." />
                <hr></hr>
                <div className='homecontainer' style={{ display: 'grid', placeItems: 'center', textAlign: 'center', alignItems: 'center' }}>
                <div className='items' style={{ display: 'flex', marginBottom:'3vw' , marginTop:'3vw', alignItems: 'center', justifyContent: 'space-between',}}>
                    <div class="card" style={{ width: '18vw',border:'none' }}>
                        <img src="/assets/TieuLuan.png" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title" >Tiểu luận chuyên ngành</h5>
                            <a href="#" class="btn btn-primary"style={{fontSize:'1.2vw'}}>Tham khảo</a>
                        </div>
                    </div>
                    <div class="card" style={{width: '18vw', marginLeft: '5vw', border:'none'}}>
                        <img src="/assets/KhoaLuan.png" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title" >Khóa luận tốt nghiệp</h5>
                            <a href="#" class="btn btn-primary"style={{fontSize:'1.2vw'}}>Tham khảo</a>
                        </div>
                    </div>
                    <div class="card" style={{ width: '18vw', marginLeft: '5vw', border:'none'}}>
                        <img src="/assets/HuongDan.jfif" class="card-img-top" alt="..."/>
                        <div class="card-body">
                            <h5 class="card-title">Hướng dẫn</h5>
                            <a href="/intruction" class="btn btn-primary"style={{fontSize:'1.2vw'}}>Xem</a>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Home
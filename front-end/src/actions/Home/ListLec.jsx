import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { error } from 'jquery';
import './ListLec.scss'
import axiosInstance from '../../API/axios';


function ListLec() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        axiosInstance.get("/api/team")
            .then(response => {
                console.log("API response:", response.data);
                setUser(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div className='listHome'>
            <div className='listHomeLec'>
                <div className='search'>
                    <div className='filter'>
                        <h6>Ngành</h6>
                        <select className='selectDr'>
                            <option value="dangKy">Tất cả</option>
                            <option value="dangKy">Công nghệ thông tin</option>
                            <option value="somethingElse">Kĩ thuật dữ liệu</option>
                        </select>
                    </div>
                    <div className='formSearch'>
                        <h6>Họ và tên</h6>
                        <form>
                            <input></input>
                        </form>
                    </div>
                </div>
                <div className='cardContainer'>
                    {user.map(a => (
                        <div key={a.person.personId} className='cardItem'>
                            <img className='avatar' src='/assets/avatar.png' />
                            <p className='name'>{a.person.firstName + ' ' + a.person.lastName}</p>
                            <p className='major'>{a.person.major}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ListLec
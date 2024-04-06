import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function DataYears() {
    const [years, setYears] = useState([]);
    const [newYear, setNewYear] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null); // State lưu thông tin năm được chọn để chỉnh sửa

    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axios.get('/api/admin/schoolYear', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                .then(response => {
                    setYears(response.data.listYear);
                    console.log("dataYear: ", response.data)
                })
                .catch(error => {
                    console.error(error);
                });
            }
        }
    }, []);

    const handleAddYear = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        const newYearValue = document.getElementById('exampleFormControlInput1').value;
    
        axios.post('/api/admin/schoolYear/create', null, {
            params: {
                year: newYearValue
            },
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => {
            setYears([...years, response.data]);
            setNewYear('');
            setShowForm(false);
            console.log("Thêm Niên khóa thành công");
            
        })
        .catch(error => {
            console.error(error);
            console.log("Lỗi");
        });
    };

    const handleEditYear = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        const updatedYearValue = document.getElementById('exampleFormControlInput1').value;
    
        axios.post(`/api/admin/schoolYear/edit/${selectedYear.yearId}`, null, {
            params: {
                yearId: selectedYear.yearId,
                year: updatedYearValue
            },
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => {
            const updatedYears = years.map(item => {
                if (item.yearId === selectedYear.yearId) {
                    return { ...item, year: updatedYearValue };
                }
                return item;
            });
            setYears(updatedYears);
            setNewYear('');
            setShowForm(false);
            console.log("Chỉnh sửa Niên khóa thành công");
            
        })
        .catch(error => {
            console.error(error);
            console.log("Lỗi");
        });
    };

    const handleViewYear = (year) => {
        setSelectedYear(year); 
        setNewYear(year.year); 
        setShowForm(true);
    };

    return (
        <div>
            <button type="button" className="btn btn-success" onClick={() => setShowForm(true)}>
                Add
            </button>
            {showForm && (
                <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{display: 'block'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">{selectedYear ? 'CHỈNH SỬA NIÊN KHÓA' : 'THÊM NIÊN KHÓA'}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowForm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Tên niên khóa</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="exampleFormControlInput1" 
                                        value={newYear} // Sử dụng giá trị của newYear cho input
                                        onChange={(e) => setNewYear(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowForm(false)}>Close</button>
                                {selectedYear ? (
                                    <button type="button" className="btn btn-primary" onClick={handleEditYear}>Update</button>
                                ) : (
                                    <button type="button" className="btn btn-success" onClick={handleAddYear}>Add</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên niên khóa</th>
                        <th scope='col'> Action</th>
                    </tr>
                </thead>
                <tbody>
                    {years.map((item, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.year}</td>
                            <td>
                                <button className='btnView' onClick={() => handleViewYear(item)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataYears;

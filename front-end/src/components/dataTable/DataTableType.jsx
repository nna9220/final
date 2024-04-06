import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataTableType() {
    const [type, setType] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');

    useEffect(() => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt) {
            axios.get('/api/admin/typeSubject/list', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
            .then(response => {
                setType(response.data);
            })
            .catch(error => {
                console.error("Error: ", error);
            });
        } else {
            console.log("Error: No token found");
        }
    }, []);

    const handleAddType = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt) {
            axios.post('/api/admin/typeSubject/create', { typeName: newTypeName }, {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
            .then(response => {
                // Update the state with the new type
                setType([...type, response.data]);
                // Clear the input field
                setNewTypeName('');
            })
            .catch(error => {
                console.error("Error: ", error);
            });
        } else {
            console.log("Error: No token found");
        }
    };

    return (
        <div>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Add
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm loại đề tài</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlInput1" className="form-label">Type name</label>
                                <input type="text" className="form-control" id="exampleFormControlInput1" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddType}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='body-table'>
                {type.map((item, index) => (
                    <p key={index}>{item.typeName}</p>
                ))}
            </div>

            <table>
                
            </table>
        </div>
    );
}

export default DataTableType;

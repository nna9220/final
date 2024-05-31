import React, { useState , useEffect} from 'react'
import axiosInstance from '../../API/axios';
import { DataGrid } from '@mui/x-data-grid';

function DataGuest() {
    const [guest, setGuest] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        if (!isDataFetched) {
            const tokenSt = sessionStorage.getItem('userToken');
            if (tokenSt) {
                axiosInstance.get('/admin/student', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                    },
                })
                    .then(response => {
                        console.log("Guest:  ", response.data.guest);
                        setGuest(response.data.guest); // Đánh dấu rằng dữ liệu đã được lấy
                    })
                    .catch(error => {
                        console.error("error: ", error);
                    });
            }
        }
    }, [isDataFetched]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'studentId', headerName: 'MSSV', width: 350 },
        { field: 'gmail', headerName: 'Gmail', width: 200 },
    ];

    return (
        <DataGrid
            rows={guest.map((student, index) => ({
                id: index + 1,
                studentId: student.personId,
                gmail: student.username,
            }))}
            columns={columns}
            initialState={{
                ...guest.initialState,
                pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}

        />
    )
}

export default DataGuest
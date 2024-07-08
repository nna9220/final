import React, { useState, useEffect } from 'react';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { toast } from 'react-toastify'; // Import toastify

const NotificationOfAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    persons: [],
    recipientType: '' // Thêm thuộc tính recipientType
  });
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    document.title = "Trang chủ Admin";

    if (userToken) {
      axiosInstance.get('/admin/notification', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        }
      })
        .then(response => {
          console.log("Notification: ", response.data);
          // Sắp xếp các thông báo theo ngày gửi giảm dần (mới nhất lên đầu)
          const sortedNotifications = response.data.sort((a, b) => new Date(b.dateSubmit) - new Date(a.dateSubmit));
          setNotifications(sortedNotifications);
        })
        .catch(error => {
          console.error("Error fetching notifications: ", error);
        });
    }
  }, [userToken]);

  const handleCreateNotification = () => {
    if (userToken) {
        const params = {
            content: newNotification.content,
            title: newNotification.title,
            recipientType: newNotification.recipientType || null,
            persons: newNotification.recipientType === '' ? newNotification.persons : []
        };

        // Log dữ liệu trước khi gửi yêu cầu
        console.log("Sending request with data:", params);

        axiosInstance.post('/admin/notification/create', params, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log("Notification created: ", response.data);
            setShowModalAdd(false);
            // Refresh notifications list after creation
            return axiosInstance.get('/admin/notification', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                }
            });
        })
        .then(response => {
            // Sắp xếp các thông báo theo ngày gửi giảm dần (mới nhất lên đầu)
            const sortedNotifications = response.data.sort((a, b) => new Date(b.dateSubmit) - new Date(a.dateSubmit));
            setNotifications(sortedNotifications);
            // Clear the form
            setNewNotification({
                title: '',
                content: '',
                persons: [],
                recipientType: ''
            });
            // Show success toast
            toast.success("Tạo thông báo thành công!");
        })
        .catch(error => {
            console.error("Error creating notification: ", error);
            // Optionally, show error toast
            toast.error("Lỗi khi tạo thông báo.");
        });
    }
};


  const columns = [
    { field: 'stt', headerName: 'STT', width: 90 },
    { field: 'title', headerName: 'Tiêu đề', width: 250 },
    { field: 'message', headerName: 'Nội dung', width: 400 },
    { field: 'date', headerName: 'Thời gian', width: 180 },
  ];

  const rows = notifications.map((notification, index) => ({
    stt: index + 1,
    id: notification.notificationId,
    title: notification.title,
    message: notification.content,
    date: notification.dateSubmit,
  }));

  return (
    <div style={{ marginTop: '10px' }}>
      <Button
        variant="contained"
        color="success"
        onClick={() => setShowModalAdd(true)}
        style={{ marginBottom: '10px', marginRight: '20px' }}
        startIcon={<AddCircleOutlineOutlinedIcon />}
      >
        Thêm thông báo
      </Button>

      <Box sx={{ width: '100%' }}>
        {notifications.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        ) : (
          <Typography>No notifications available</Typography>
        )}
      </Box>

      {/* Modal for adding notification */}
      <Modal
        open={showModalAdd}
        onClose={() => setShowModalAdd(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Thêm thông báo mới
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Tiêu đề"
            value={newNotification.title}
            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nội dung"
            multiline
            rows={4}
            value={newNotification.content}
            onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Loại người nhận</InputLabel>
            <Select
              value={newNotification.recipientType}
              onChange={(e) => setNewNotification({ ...newNotification, recipientType: e.target.value })}
              label="Loại người nhận"
            >
              <MenuItem value="">Chọn loại người nhận</MenuItem>
              <MenuItem value="student">Sinh viên</MenuItem>
              <MenuItem value="lecturer">Giảng viên</MenuItem>
            </Select>
          </FormControl>
          {newNotification.recipientType === '' && (
            <TextField
              fullWidth
              margin="normal"
              label="Danh sách email người nhận (cách nhau bằng dấu phẩy)"
              value={newNotification.persons.join(',')}
              onChange={(e) => setNewNotification({ ...newNotification, persons: e.target.value.split(',').map(p => p.trim()) })}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNotification}
            style={{ marginTop: '10px' }}
          >
            Tạo thông báo
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default NotificationOfAdmin;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../API/axios';

const NotificationOfAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [emailPersons, setEmailPersons] = useState([]);
  const [notificationId, setNotificationId] = useState(null);
  const [authorizationHeader, setAuthorizationHeader] = useState(''); // Set your authorization token here

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/admin/notification', {
        headers: {
          'Authorization': authorizationHeader
        }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleCreateNotification = async () => {
    try {
      const response = await axiosInstance.post('/admin/notification/create', null, {
        headers: {
          'Authorization': authorizationHeader
        },
        params: {
          content,
          title,
          persons: emailPersons
        }
      });
      console.log('Notification created:', response.data);
      fetchNotifications(); // Refresh the list after creating
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleEditNotification = async () => {
    if (notificationId == null) return; // Do nothing if ID is not set

    try {
      const response = await axiosInstance.post(`/admin/notification/edit/${notificationId}`, null, {
        headers: {
          'Authorization': authorizationHeader
        },
        params: {
          content,
          title
        }
      });
      console.log('Notification edited:', response.data);
      fetchNotifications(); // Refresh the list after editing
    } catch (error) {
      console.error('Error editing notification:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axiosInstance.post(`/admin/notification/delete/${id}`, null, {
        headers: {
          'Authorization': authorizationHeader
        }
      });
      console.log('Notification deleted');
      fetchNotifications(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div>
      <h1>Notification Management</h1>
      <div>
        <h2>Create Notification</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email of Persons (comma separated)"
          value={emailPersons}
          onChange={(e) => setEmailPersons(e.target.value.split(','))}
        />
        <button onClick={handleCreateNotification}>Create</button>
      </div>

      <div>
        <h2>Edit Notification</h2>
        <input
          type="number"
          placeholder="Notification ID"
          value={notificationId || ''}
          onChange={(e) => setNotificationId(parseInt(e.target.value))}
        />
        <input
          type="text"
          placeholder="New Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="New Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleEditNotification}>Edit</button>
      </div>

      <div>
        <h2>Notifications List</h2>
        <ul>
          {notifications.map(notification => (
            <li key={notification.id}>
              <h3>{notification.title}</h3>
              <p>{notification.content}</p>
              <button onClick={() => handleDeleteNotification(notification.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationOfAdmin;

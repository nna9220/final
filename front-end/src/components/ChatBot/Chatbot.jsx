import React, { useState } from 'react';
import './Chatbot.scss';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async (message) => {
        const userToken = getTokenFromUrlAndSaveToStorage();

        if (!userToken) {
            setError('Authentication token not found.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Sending message:', message);
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: message }],
                }),
            });

            const data = await response.json();
            console.log('Response from API:', data);

            if (response.ok) {
                const reply = data.choices[0].message.content;
                return reply;
            } else {
                throw new Error(data.error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Có lỗi xảy ra khi kết nối với API Chat PT');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const reply = await sendMessage(messageInput);
        if (reply) {
            setMessages([...messages, { content: messageInput, sender: 'user' }, { content: reply, sender: 'bot' }]);
            setMessageInput('');
        }
    };

    return (
        <div>
            <header>
                <h1>Chat PT</h1>
            </header>
            <section id="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message message-${msg.sender}`}>
                        {msg.content}
                    </div>
                ))}
            </section>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button type="submit" disabled={loading}>
                    Gửi
                </button>
            </form>
            {loading && <div className="loading-indicator">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default Chatbot;

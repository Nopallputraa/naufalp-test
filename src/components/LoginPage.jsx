import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

const { Title, Text, Link } = Typography;

function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const res = await api.get('/users');
      const user = res.data.find(
        u => u.username === values.username && u.password === values.password
      );

      if (user) {
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
        message.success(`Login berhasil sebagai ${user.username}`);
        onLoginSuccess(user); // Trigger update ke App.js
        navigate('/dashboard');
      } else {
        message.error('Username atau password salah');
      }
    } catch (err) {
      message.error('Terjadi kesalahan saat login');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <Title level={2} style={{ color: '#0052cc' }}>
          Beli Paket<br />Internetmu Disini!
        </Title>
      </div>
      <div className="login-right">
        <div className="login-box">
          <Title level={3}>Login</Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="username" rules={[{ required: true, message: 'Masukkan username' }]}>
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Masukkan password' }]}>
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <Link>Lupa Password?</Link>
              </div>
            </Form.Item>
          </Form>
          <Text style={{ marginTop: 10 }}>
            Belum punya akun? <Link>Daftar</Link>
          </Text>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
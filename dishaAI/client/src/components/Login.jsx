import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Link, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Login = () => {
    const [username, setusername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate(); 
    const onFinish = async (values) => {
        try {
          const params = new URLSearchParams();
          params.append('username', values.username);
          params.append('password', values.password);
      
          const response = await axios.post(`${API_BASE_URL}/login`, params.toString(), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
      
          localStorage.setItem('token', response.data.access_token);
          navigate('/App');
        } catch (error) {
          console.error(error);
          alert("Login failed:", error.message);
        }
      };
      

    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-black">
            <h1 className="text-4xl text-amber-400 font-bold mb-4">Todo-Daily</h1>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="username" onChange={(e) => setusername(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Log in
                        </Button>
                        <div className="mt-2 text-center">
                            Or <Link to="/signup" className="text-blue-500">Register now!</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;

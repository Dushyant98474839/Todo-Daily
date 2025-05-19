import React, { use } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { Link, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')

  const navigate = useNavigate()
  const onFinish = async () => {
    // console.log('Received values of form: ', values);  
    if(password !== confirmpassword) {
      alert("Passwords do not match")
      return
    }
    
    try{
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        username: username,
        password: password
      })
      const token=response.data.access_token
      localStorage.setItem('token', token)
      navigate('/App')
    }
    catch (error) {
      console.error('Error during signup:', error);
      alert("Signup failed")
    }
  
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-4xl text-amber-400 font-bold mb-4">Todo-Daily</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
          className='bg-white p-8 rounded-lg'
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password!' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
          </Form.Item>
          <Form.Item
            name="confirm password"
            rules={[{ required: true, message: 'Confirm Password!' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Confirm Password" onChange={(e) => setConfirmpassword(e.target.value)}/>
          </Form.Item>


          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Sign Up
            </Button>
            or <Link to="/login">Login</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Signup;
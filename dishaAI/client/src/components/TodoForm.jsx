import React, { useState } from 'react';
import { Button, Form, Input, Radio } from 'antd';

const TodoForm = ({ HandleFormSubmit, closeForm }) => {
  const [form] = Form.useForm();
  const handleSubmit = (values) => {
    const payload = {
      title: values.title?.trim(),
      description: values.description?.trim() || null,
      status: values.status, 
    };

    console.log('Submitting payload:', payload); 
    HandleFormSubmit(payload);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    closeForm();
  };

  return (
    <div className="Form w-full h-full p-4 rounded-2xl border-1 border-gray-300 bg-black">
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="flex flex-col"
        initialValues={{ status: 'todo' }} 
      >
        <Form.Item
          label={<span className="text-white">Status</span>}
          name="status"
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Radio.Group>
            <Radio.Button value="todo">To-Do</Radio.Button>
            <Radio.Button value="inprogress">In-Progress</Radio.Button>
            <Radio.Button value="done">Done</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={<span className="text-white">Title</span>}
          name="title"
          rules={[{ required: true, message: 'Please input a title!' }]}
        >
          <Input placeholder="Enter title" className="w-full" />
        </Form.Item>

        <Form.Item
          label={<span className="text-white">Description</span>}
          name="description"
        >
          <Input placeholder="Enter description" className="w-full" />
        </Form.Item>

        <Form.Item className="flex flex-row items-center justify-center">
          <Button type="primary" htmlType="submit" className="mr-2">
            Submit
          </Button>
          <Button
            className="ml-2 bg-red-500 hover:bg-red-600 border-none text-white"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TodoForm;
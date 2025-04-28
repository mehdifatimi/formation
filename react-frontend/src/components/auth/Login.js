import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await login(values.email, values.password);
            message.success('Connexion réussie');
            navigate('/dashboard');
        } catch (error) {
            message.error('Erreur de connexion: ' + (error.message || 'Veuillez réessayer'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <div className="login-header">
                    <img src="/ofppt-logo.png" alt="OFPPT Logo" className="login-logo" />
                    <h1>Formation Formateur</h1>
                </div>
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    className="login-form"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Veuillez saisir votre email' },
                            { type: 'email', message: 'Email invalide' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mot de passe"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            size="large"
                        >
                            Se connecter
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login; 
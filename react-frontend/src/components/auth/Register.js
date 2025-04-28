import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await register(values);
            message.success('Inscription réussie');
            navigate('/login');
        } catch (error) {
            message.error('Erreur d\'inscription: ' + (error.message || 'Veuillez réessayer'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Card className="register-card">
                <div className="register-header">
                    <img src="/ofppt-logo.png" alt="OFPPT Logo" className="register-logo" />
                    <h1>Créer un compte</h1>
                </div>
                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    className="register-form"
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Veuillez saisir votre nom' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nom complet"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Veuillez saisir votre email' },
                            { type: 'email', message: 'Email invalide' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
                            { pattern: /^[0-9]{10}$/, message: 'Format de téléphone invalide' }
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Téléphone"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Veuillez saisir votre mot de passe' },
                            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mot de passe"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password_confirmation"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Veuillez confirmer votre mot de passe' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Les mots de passe ne correspondent pas');
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirmer le mot de passe"
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
                            S'inscrire
                        </Button>
                    </Form.Item>

                    <div className="register-footer">
                        <Button type="link" onClick={() => navigate('/login')}>
                            Déjà inscrit ? Se connecter
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register; 
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import './LoginForm.css';

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            console.log('Tentative de connexion avec:', { email: values.email });
            
            const response = await login(values.email, values.password);
            
            console.log('Réponse de connexion:', response);
            
            message.success('Connexion réussie !');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.response) {
                console.error('Détails de l\'erreur:', error.response.data);
                
                // Gestion plus détaillée des erreurs HTTP
                switch (error.response.status) {
                    case 405:
                        message.error('Méthode non autorisée. Veuillez réessayer.');
                        break;
                    case 422:
                        // Afficher les messages d'erreur spécifiques du serveur
                        if (error.response.data.errors) {
                            const errorMessages = Object.values(error.response.data.errors).flat();
                            message.error(errorMessages.join(', '));
                        } else {
                            message.error(error.response.data.message || 'Données invalides. Vérifiez vos informations.');
                        }
                        break;
                    case 401:
                        message.error('Identifiants incorrects.');
                        break;
                    default:
                        message.error(error.response.data.message || 'Erreur de connexion');
                }
            } else if (error.request) {
                console.error('Erreur de requête:', error.request);
                message.error('Impossible de contacter le serveur. Vérifiez votre connexion.');
            } else {
                console.error('Erreur:', error.message);
                message.error('Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h1>Connexion</h1>
                <Form
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
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
                        rules={[
                            { required: true, message: 'Veuillez saisir votre mot de passe' },
                            { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                        ]}
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
            </div>
        </div>
    );
};

export default LoginForm; 
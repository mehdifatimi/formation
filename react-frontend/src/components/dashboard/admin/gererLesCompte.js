import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Select, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const API_URL = 'http://localhost:8000';

const GererLesCompte = () => {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Session expirée. Veuillez vous reconnecter.');
                return;
            }

            const response = await fetch(`${API_URL}/api/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    message.error('Session expirée. Veuillez vous reconnecter.');
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data && Array.isArray(data)) {
                setUsers(data);
            } else {
                throw new Error('Format de données invalide');
            }
        } catch (error) {
            console.error('Erreur de chargement:', error);
            message.error('Erreur lors du chargement des utilisateurs. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingUser(record);
        form.setFieldsValue({
            ...record,
            role: record.roles[0]?.name
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Session expirée. Veuillez vous reconnecter.');
                return;
            }

            const response = await fetch(`${API_URL}/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                mode: 'cors',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    message.error('Session expirée. Veuillez vous reconnecter.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            message.success('Utilisateur supprimé avec succès');
            fetchUsers();
        } catch (error) {
            console.error('Erreur de suppression:', error);
            message.error('Erreur lors de la suppression. Veuillez réessayer.');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Session expirée. Veuillez vous reconnecter.');
                return;
            }

            const method = editingUser ? 'PUT' : 'POST';
            const url = editingUser 
                ? `${API_URL}/api/users/${editingUser.id}`
                : `${API_URL}/api/users`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    message.error('Session expirée. Veuillez vous reconnecter.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            message.success(`Utilisateur ${editingUser ? 'modifié' : 'créé'} avec succès`);
            setIsModalVisible(false);
            fetchUsers();
        } catch (error) {
            console.error('Erreur de sauvegarde:', error);
            message.error('Erreur lors de la sauvegarde. Veuillez réessayer.');
        }
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'red',
            animateur: 'blue',
            participant: 'green',
            cdc: 'purple',
            drif: 'orange'
        };
        return colors[role] || 'default';
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Rôle',
            dataIndex: 'roles',
            key: 'role',
            render: (roles) => (
                <Tag color={getRoleColor(roles[0]?.name)}>
                    {roles[0]?.name?.toUpperCase() || 'Non assigné'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Modifier
                    </Button>
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Supprimer
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des Comptes Utilisateurs</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                >
                    Ajouter un utilisateur
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} utilisateurs`,
                }}
            />

            <Modal
                title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                open={isModalVisible}
                onOk={handleSubmit}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Nom"
                        rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Nom de l'utilisateur" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Veuillez entrer l\'email' },
                            { type: 'email', message: 'Email invalide' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email de l'utilisateur" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Rôle"
                        rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
                    >
                        <Select placeholder="Sélectionner un rôle">
                            <Select.Option value="admin">Administrateur</Select.Option>
                            <Select.Option value="animateur">Animateur</Select.Option>
                            <Select.Option value="participant">Participant</Select.Option>
                            <Select.Option value="cdc">CDC</Select.Option>
                            <Select.Option value="drif">DRIF</Select.Option>
                        </Select>
                    </Form.Item>

                    {!editingUser && (
                        <Form.Item
                            name="password"
                            label="Mot de passe"
                            rules={[
                                { required: true, message: 'Veuillez entrer le mot de passe' },
                                { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mot de passe"
                            />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default GererLesCompte;

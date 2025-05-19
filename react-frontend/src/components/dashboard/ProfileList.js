import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../services/api';
import ProfileForm from './forms/ProfileForm';

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await api.get('/profiles');
            const formattedProfiles = response.data.map(profile => ({
                ...profile,
                nom: profile.user ? profile.user.name : 'N/A',
                email: profile.user ? profile.user.email : 'N/A',
                role: profile.user ? profile.user.role : 'user',
                status: profile.status || 'actif'
            }));
            setProfiles(formattedProfiles);
        } catch (error) {
            console.error('Erreur lors du chargement des profils:', error);
            message.error('Erreur lors du chargement des profils');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingProfile(null);
        setModalVisible(true);
    };

    const handleEdit = (profile) => {
        const profileData = {
            id: profile.id,
            name: profile.nom,
            description: profile.bio,
            permissions: profile.preferences?.permissions || []
        };
        setEditingProfile(profileData);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/profiles/${id}`);
            message.success('Profil supprimé avec succès');
            fetchProfiles();
        } catch (error) {
            console.error('Erreur lors de la suppression du profil:', error);
            message.error('Erreur lors de la suppression du profil');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/profiles/${id}/status`, { status });
            message.success('Statut du profil mis à jour avec succès');
            fetchProfiles();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            message.error('Erreur lors de la mise à jour du statut');
        }
    };

    const handleSave = async (values) => {
        try {
            if (editingProfile) {
                await api.put(`/profiles/${editingProfile.id}`, values);
                message.success('Profil mis à jour avec succès');
            } else {
                await api.post('/profiles', values);
                message.success('Profil créé avec succès');
            }
            setModalVisible(false);
            fetchProfiles();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du profil:', error);
            message.error('Erreur lors de la sauvegarde du profil');
        }
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Rôle',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'red' : 'blue'}>
                    {role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </Tag>
            ),
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Switch
                    checked={status === 'actif'}
                    onChange={(checked) => handleStatusChange(record.id, checked ? 'actif' : 'inactif')}
                />
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
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="dashboard-content">
            <div className="content-header">
                <h2>Gestion des Profils</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Ajouter un profil
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={profiles}
                loading={loading}
                rowKey="id"
            />

            <Modal
                title={editingProfile ? 'Modifier le profil' : 'Nouveau profil'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <ProfileForm
                    profile={editingProfile}
                    onSuccess={() => {
                        setModalVisible(false);
                        fetchProfiles();
                    }}
                    onCancel={() => setModalVisible(false)}
                />
            </Modal>
        </div>
    );
};

export default ProfileList; 
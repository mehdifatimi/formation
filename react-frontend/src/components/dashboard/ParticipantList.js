import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ParticipantForm from './forms/ParticipantForm';
import DataTable from '../common/DataTable';
import api from '../../services/api';

const ParticipantList = () => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState(null);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const response = await api.get('/participants');
            setParticipants(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des participants:', error);
            message.error('Erreur lors du chargement des participants');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingParticipant(null);
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingParticipant(record);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/participants/${id}`);
            message.success('Participant supprimé avec succès');
            fetchParticipants();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            message.error('Erreur lors de la suppression du participant');
        }
    };

    const handleSave = async (values) => {
        try {
            if (editingParticipant) {
                await api.put(`/participants/${editingParticipant.id}`, values);
                message.success('Participant mis à jour avec succès');
            } else {
                await api.post('/participants', values);
                message.success('Participant créé avec succès');
            }
            setModalVisible(false);
            fetchParticipants();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            if (error.response?.data?.errors) {
                message.error('Veuillez corriger les erreurs dans le formulaire');
            } else {
                message.error('Erreur lors de la sauvegarde du participant');
            }
        }
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
            sorter: (a, b) => a.nom.localeCompare(b.nom),
        },
        {
            title: 'Prénom',
            dataIndex: 'prenom',
            key: 'prenom',
            sorter: (a, b) => a.prenom.localeCompare(b.prenom),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Téléphone',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: 'Ville',
            dataIndex: 'ville',
            key: 'ville',
        },
        {
            title: 'Statut Paiement',
            dataIndex: 'statut_paiement',
            key: 'statut_paiement',
            render: (statut) => (
                <Tag color={
                    statut === 'paye' ? 'green' :
                    statut === 'annule' ? 'red' :
                    'orange'
                }>
                    {statut === 'paye' ? 'Payé' :
                     statut === 'annule' ? 'Annulé' :
                     'En attente'}
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
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            Modal.confirm({
                                title: 'Êtes-vous sûr de vouloir supprimer ce participant ?',
                                content: 'Cette action est irréversible.',
                                okText: 'Oui',
                                okType: 'danger',
                                cancelText: 'Non',
                                onOk: () => handleDelete(record.id),
                            });
                        }}
                    >
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <DataTable
                title="Participants"
                columns={columns}
                dataSource={participants}
                loading={loading}
                searchPlaceholder="Rechercher un participant..."
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Nouveau Participant
                    </Button>
                }
            />

            <Modal
                title={editingParticipant ? "Modifier le participant" : "Nouveau participant"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
                destroyOnClose
            >
                <ParticipantForm
                    initialValues={editingParticipant}
                    onFinish={handleSave}
                    onCancel={() => setModalVisible(false)}
                />
            </Modal>
        </>
    );
};

export default ParticipantList; 
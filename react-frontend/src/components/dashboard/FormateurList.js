import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import FormateurForm from './forms/FormateurForm';
import DataTable from '../common/DataTable';
import api from '../../services/api';

const FormateurList = () => {
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingFormateur, setEditingFormateur] = useState(null);

    useEffect(() => {
        fetchFormateurs();
    }, []);

    const fetchFormateurs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/formateurs');
            setFormateurs(response.data);
        } catch (error) {
            message.error('Erreur lors du chargement des formateurs');
        }
        setLoading(false);
    };

    const handleAdd = () => {
        setEditingFormateur(null);
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingFormateur(record);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/formateurs/${id}`);
            message.success('Formateur supprimé avec succès');
            fetchFormateurs();
        } catch (error) {
            message.error('Erreur lors de la suppression');
        }
    };

    const handleSave = async (values) => {
        try {
            if (editingFormateur) {
                await api.put(`/formateurs/${editingFormateur.id}`, values);
                message.success('Formateur mis à jour avec succès');
            } else {
                await api.post('/formateurs', values);
                message.success('Formateur créé avec succès');
            }
            setModalVisible(false);
            fetchFormateurs();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde');
        }
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Prénom',
            dataIndex: 'prenom',
            key: 'prenom',
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
            title: 'Spécialité',
            dataIndex: 'specialite',
            key: 'specialite',
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
                        type="danger"
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
        <>
            <DataTable
                title="Formateurs"
                columns={columns}
                dataSource={formateurs}
                loading={loading}
                searchPlaceholder="Rechercher un formateur..."
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Nouveau Formateur
                    </Button>
                }
            />

            <Modal
                title={editingFormateur ? "Modifier le formateur" : "Nouveau formateur"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                <FormateurForm
                    initialValues={editingFormateur}
                    onFinish={handleSave}
                    onCancel={() => setModalVisible(false)}
                />
            </Modal>
        </>
    );
};

export default FormateurList; 
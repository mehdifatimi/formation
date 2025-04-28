import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../../services/api';

const ParticipantCDC = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const response = await api.get('/participants');
      setParticipants(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des participants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingParticipant) {
        await api.put(`/participants/${editingParticipant.id}`, values);
        message.success('Participant mis à jour avec succès');
      } else {
        await api.post('/participants', values);
        message.success('Participant créé avec succès');
      }

      setModalVisible(false);
      form.resetFields();
      loadParticipants();
    } catch (error) {
      message.error('Erreur lors de la sauvegarde du participant');
    }
  };

  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    form.setFieldsValue({
      ...participant,
      statut: participant.statut || 'actif'
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/participants/${id}`);
      message.success('Participant supprimé avec succès');
      loadParticipants();
    } catch (error) {
      message.error('Erreur lors de la suppression du participant');
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
      title: 'Entreprise',
      dataIndex: 'entreprise',
      key: 'entreprise',
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => (
        <Tag color={statut === 'actif' ? 'green' : 'red'}>
          {statut === 'actif' ? 'Actif' : 'Inactif'}
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
            onClick={() => handleDelete(record.id)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingParticipant(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Ajouter un participant
      </Button>

      <Table
        columns={columns}
        dataSource={participants}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingParticipant ? 'Modifier le participant' : 'Nouveau participant'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="nom"
            label="Nom"
            rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="prenom"
            label="Prénom"
            rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Veuillez saisir l\'email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="telephone"
            label="Téléphone"
            rules={[{ required: true, message: 'Veuillez saisir le téléphone' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="entreprise"
            label="Entreprise"
            rules={[{ required: true, message: 'Veuillez saisir l\'entreprise' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="poste"
            label="Poste"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="statut"
            label="Statut"
            initialValue="actif"
          >
            <Select>
              <Select.Option value="actif">Actif</Select.Option>
              <Select.Option value="inactif">Inactif</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingParticipant ? 'Modifier' : 'Créer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ParticipantCDC; 
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../../../services/api';

const FormateurCDC = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFormateur, setEditingFormateur] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadFormateurs();
  }, []);

  const loadFormateurs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/formateurs');
      setFormateurs(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des formateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'specialites' && Array.isArray(values[key])) {
          formData.append(key, JSON.stringify(values[key]));
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      if (editingFormateur) {
        await api.post(`/formateurs/${editingFormateur.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Formateur mis à jour avec succès');
      } else {
        await api.post('/formateurs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Formateur créé avec succès');
      }

      setModalVisible(false);
      form.resetFields();
      loadFormateurs();
    } catch (error) {
      message.error('Erreur lors de la sauvegarde du formateur');
    }
  };

  const handleEdit = (formateur) => {
    setEditingFormateur(formateur);
    form.setFieldsValue({
      ...formateur,
      specialites: formateur.specialites || [],
      disponible: formateur.disponible || false
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/formateurs/${id}`);
      message.success('Formateur supprimé avec succès');
      loadFormateurs();
    } catch (error) {
      message.error('Erreur lors de la suppression du formateur');
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
      title: 'Spécialités',
      dataIndex: 'specialites',
      key: 'specialites',
      render: (specialites) => (
        <Space>
          {specialites?.map((spec, index) => (
            <Tag key={index} color="blue">{spec}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Disponible',
      dataIndex: 'disponible',
      key: 'disponible',
      render: (disponible) => (
        <Tag color={disponible ? 'green' : 'red'}>
          {disponible ? 'Disponible' : 'Indisponible'}
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
          setEditingFormateur(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Ajouter un formateur
      </Button>

      <Table
        columns={columns}
        dataSource={formateurs}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingFormateur ? 'Modifier le formateur' : 'Nouveau formateur'}
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
            name="specialites"
            label="Spécialités"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Ajouter des spécialités"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Biographie"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="photo"
            label="Photo"
          >
            <Upload
              name="photo"
              listType="picture"
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Sélectionner une photo</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="linkedin"
            label="LinkedIn"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="disponible"
            label="Disponibilité"
            valuePropName="checked"
          >
            <Select>
              <Select.Option value={true}>Disponible</Select.Option>
              <Select.Option value={false}>Indisponible</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingFormateur ? 'Modifier' : 'Créer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FormateurCDC; 
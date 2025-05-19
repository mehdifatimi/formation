import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import api from '../../../services/api';

const { Option } = Select;

const ProfileForm = ({ profile, onSuccess, onCancel }) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            if (profile) {
                await api.put(`/profiles/${profile.id}`, values);
                message.success('Profil mis à jour avec succès');
            } else {
                await api.post('/profiles', values);
                message.success('Profil créé avec succès');
            }
            onSuccess();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde du profil');
            console.error('Erreur:', error);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={profile}
        >
            <Form.Item
                name="name"
                label="Nom"
                rules={[{ required: true, message: 'Veuillez entrer le nom du profil' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Veuillez entrer la description' }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="permissions"
                label="Permissions"
                rules={[{ required: true, message: 'Veuillez sélectionner les permissions' }]}
            >
                <Select mode="multiple" placeholder="Sélectionnez les permissions">
                    <Option value="view">Voir</Option>
                    <Option value="create">Créer</Option>
                    <Option value="edit">Modifier</Option>
                    <Option value="delete">Supprimer</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {profile ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                    Annuler
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProfileForm; 
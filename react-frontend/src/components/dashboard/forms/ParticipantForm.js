import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Tooltip, Typography, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import api from '../../../services/api';
import moment from 'moment';
import './ParticipantForm.css';

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

const ParticipantForm = ({ initialValues, onFinish, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (initialValues) {
            const formattedValues = {
                ...initialValues,
                date_naissance: initialValues.date_naissance ? moment(initialValues.date_naissance) : null
            };
            form.setFieldsValue(formattedValues);
        }
    }, [initialValues, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        setFormErrors({});
        try {
            const participantData = {
                ...values,
                date_naissance: values.date_naissance?.format('YYYY-MM-DD'),
            };
            await onFinish(participantData);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            message.error('Erreur lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const validatePhone = (_, value) => {
        if (!value) {
            return Promise.reject('Le téléphone est requis');
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) {
            return Promise.reject('Le numéro de téléphone doit contenir 10 chiffres');
        }
        return Promise.resolve();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                statut_paiement: 'en_attente',
            }}
            className="participant-form"
        >
            <div className="form-header">
                <Text strong style={{ fontSize: '20px' }}>
                    {initialValues ? 'Modifier le participant' : 'Nouveau participant'}
                </Text>
            </div>

            <Form.Item
                name="prenom"
                label="Prénom"
                rules={[{ required: true, message: 'Le prénom est requis' }]}
                validateStatus={formErrors.prenom ? 'error' : ''}
                help={formErrors.prenom}
            >
                <Input placeholder="Entrez le prénom" />
            </Form.Item>

            <Form.Item
                name="nom"
                label="Nom"
                rules={[{ required: true, message: 'Le nom est requis' }]}
                validateStatus={formErrors.nom ? 'error' : ''}
                help={formErrors.nom}
            >
                <Input placeholder="Entrez le nom" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'L\'email est requis' },
                    { type: 'email', message: 'Email invalide' }
                ]}
                validateStatus={formErrors.email ? 'error' : ''}
                help={formErrors.email}
            >
                <Input placeholder="exemple@email.com" />
            </Form.Item>

            <Form.Item
                name="telephone"
                label={
                    <span>
                        Téléphone
                        <Tooltip title="Format: 10 chiffres">
                            <InfoCircleOutlined style={{ marginLeft: 8 }} />
                        </Tooltip>
                    </span>
                }
                rules={[
                    { validator: validatePhone }
                ]}
                validateStatus={formErrors.telephone ? 'error' : ''}
                help={formErrors.telephone}
            >
                <Input placeholder="0123456789" maxLength={10} />
            </Form.Item>

            <Form.Item
                name="date_naissance"
                label="Date de naissance"
                validateStatus={formErrors.date_naissance ? 'error' : ''}
                help={formErrors.date_naissance}
            >
                <DatePicker 
                    format="DD/MM/YYYY" 
                    style={{ width: '100%' }} 
                    placeholder="JJ/MM/AAAA"
                    disabledDate={current => {
                        return current && current > moment().endOf('day');
                    }}
                />
            </Form.Item>

            <Form.Item
                name="ville"
                label="Ville"
            >
                <Select>
                    <Select.Option value="paris">Paris</Select.Option>
                    <Select.Option value="lyon">Lyon</Select.Option>
                    <Select.Option value="marseille">Marseille</Select.Option>
                    <Select.Option value="bordeaux">Bordeaux</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="niveau_etude"
                label="Niveau d'étude"
                validateStatus={formErrors.niveau_etude ? 'error' : ''}
                help={formErrors.niveau_etude}
            >
                <Select placeholder="Sélectionnez le niveau d'étude">
                    <Option value="Bac">Bac</Option>
                    <Option value="Bac+2">Bac+2</Option>
                    <Option value="Bac+3">Bac+3</Option>
                    <Option value="Bac+4">Bac+4</Option>
                    <Option value="Bac+5">Bac+5</Option>
                    <Option value="Doctorat">Doctorat</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="attentes"
                label="Attentes"
                validateStatus={formErrors.attentes ? 'error' : ''}
                help={formErrors.attentes}
            >
                <TextArea 
                    rows={4} 
                    placeholder="Décrivez les attentes du participant concernant la formation"
                    maxLength={500}
                    showCount
                />
            </Form.Item>

            <Form.Item
                name="statut_paiement"
                label="Statut du paiement"
                rules={[{ required: true, message: 'Le statut du paiement est requis' }]}
                validateStatus={formErrors.statut_paiement ? 'error' : ''}
                help={formErrors.statut_paiement}
            >
                <Select placeholder="Sélectionnez le statut du paiement">
                    <Option value="en_attente">En attente</Option>
                    <Option value="paye">Payé</Option>
                    <Option value="annule">Annulé</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {initialValues ? 'Mettre à jour' : 'Créer'}
                    </Button>
                    <Button onClick={onCancel}>Annuler</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ParticipantForm; 
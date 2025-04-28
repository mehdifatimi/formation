import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Space, message } from 'antd';
import api from '../../services/api';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const FormationForm = ({ initialValues, onFinish, onCancel }) => {
    const [form] = Form.useForm();
    const [formateurs, setFormateurs] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [lieux, setLieux] = useState([]);

    useEffect(() => {
        fetchFormateurs();
        fetchParticipants();
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                dates: [moment(initialValues.date_debut), moment(initialValues.date_fin)],
                formateur_id: initialValues.formateur?.id,
                participants: initialValues.participants?.map(p => p.id) || [],
                hotel_id: initialValues.hotel?.id,
                lieu_id: initialValues.lieu?.id
            });
        }
        loadOptions();
    }, [initialValues, form]);

    const fetchFormateurs = async () => {
        try {
            const response = await api.get('/formateurs');
            setFormateurs(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des formateurs:', error);
            message.error('Erreur lors du chargement des formateurs');
        }
    };

    const fetchParticipants = async () => {
        try {
            const response = await api.get('/participants');
            setParticipants(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des participants:', error);
            message.error('Erreur lors du chargement des participants');
        }
    };

    const loadOptions = async () => {
        try {
            const response = await api.get('/formations/options');
            setHotels(response.data.hotels);
            setLieux(response.data.lieux);
        } catch (error) {
            console.error('Erreur lors du chargement des options:', error);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const [dateDebut, dateFin] = values.dates;
            const formationData = {
                ...values,
                date_debut: dateDebut.format('YYYY-MM-DD'),
                date_fin: dateFin.format('YYYY-MM-DD'),
            };
            await onFinish(formationData);
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
        }
        setLoading(false);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="titre"
                label="Titre"
                rules={[{ required: true, message: 'Veuillez saisir le titre' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Veuillez saisir la description' }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="dates"
                label="Dates"
                rules={[{ required: true, message: 'Veuillez sélectionner les dates' }]}
            >
                <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="prix"
                label="Prix"
                rules={[{ required: true, message: 'Veuillez saisir le prix' }]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    min={0}
                />
            </Form.Item>

            <Form.Item
                name="places_disponibles"
                label="Places disponibles"
                rules={[{ required: true, message: 'Veuillez saisir le nombre de places' }]}
            >
                <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
                name="formateur_id"
                label="Formateur"
                rules={[{ required: true, message: 'Veuillez sélectionner un formateur' }]}
            >
                <Select>
                    {formateurs.map(formateur => (
                        <Select.Option key={formateur.id} value={formateur.id}>
                            {formateur.nom} {formateur.prenom}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="participants"
                label="Participants"
            >
                <Select
                    mode="multiple"
                    placeholder="Sélectionnez les participants"
                    optionFilterProp="children"
                >
                    {participants.map(participant => (
                        <Select.Option key={participant.id} value={participant.id}>
                            {participant.nom} {participant.prenom}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="hotel_id"
                label="Hôtel"
                rules={[{ required: false, message: 'Veuillez sélectionner un hôtel' }]}
            >
                <Select
                    placeholder="Sélectionnez un hôtel"
                    allowClear
                >
                    {hotels.map(hotel => (
                        <Select.Option key={hotel.id} value={hotel.id}>
                            {hotel.nom}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="lieu_id"
                label="Lieu"
                rules={[{ required: false, message: 'Veuillez sélectionner un lieu' }]}
            >
                <Select
                    placeholder="Sélectionnez un lieu"
                    allowClear
                >
                    {lieux.map(lieu => (
                        <Select.Option key={lieu.id} value={lieu.id}>
                            {lieu.nom} ({lieu.type} - {lieu.capacite} places)
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {initialValues ? 'Modifier' : 'Créer'}
                    </Button>
                    <Button onClick={onCancel}>
                        Annuler
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default FormationForm;
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { createAbsence, updateAbsence } from '../../../services/absenceService';
import moment from 'moment';

const { TextArea } = Input;

const AbsenceForm = ({ visible, onCancel, onSuccess, initialValues, participants, formations }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    date: initialValues.date ? moment(initialValues.date) : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
            };

            if (initialValues) {
                await updateAbsence(initialValues.id, formattedValues);
                message.success('Absence mise à jour avec succès');
            } else {
                await createAbsence(formattedValues);
                message.success('Absence créée avec succès');
            }
            onSuccess();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde de l\'absence');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={initialValues ? 'Modifier l\'absence' : 'Ajouter une absence'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="participant_id"
                    label="Participant"
                    rules={[{ required: true, message: 'Veuillez sélectionner un participant' }]}
                >
                    <Select
                        placeholder="Sélectionner un participant"
                        options={participants.map(p => ({
                            label: `${p.nom} ${p.prenom}`,
                            value: p.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="formation_id"
                    label="Formation"
                    rules={[{ required: true, message: 'Veuillez sélectionner une formation' }]}
                >
                    <Select
                        placeholder="Sélectionner une formation"
                        options={formations.map(f => ({
                            label: f.titre,
                            value: f.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="reason"
                    label="Motif"
                    rules={[{ required: true, message: 'Veuillez entrer un motif' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Statut"
                    rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
                >
                    <Select
                        placeholder="Sélectionner un statut"
                        options={[
                            { label: 'Justifiée', value: 'justified' },
                            { label: 'Non justifiée', value: 'unjustified' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AbsenceForm; 
import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useFilter } from '../../hooks/useFilter';

const { RangePicker } = DatePicker;

const FilterBar = ({
    filters,
    onFilter,
    onReset,
    searchPlaceholder = 'Search...',
    showSearch = true,
    showDateRange = false,
    dateRangeField,
    loading = false
}) => {
    const { updateFilters, resetFilters } = useFilter(filters);

    const handleFilter = (values) => {
        // Convert date range to start_date and end_date if present
        if (values[dateRangeField] && dateRangeField) {
            const [startDate, endDate] = values[dateRangeField];
            values.start_date = startDate?.format('YYYY-MM-DD');
            values.end_date = endDate?.format('YYYY-MM-DD');
            delete values[dateRangeField];
        }

        // Remove empty values
        Object.keys(values).forEach(key => {
            if (values[key] === undefined || values[key] === null || values[key] === '') {
                delete values[key];
            }
        });

        updateFilters(values);
        onFilter(values);
    };

    const handleReset = () => {
        resetFilters();
        onReset();
    };

    return (
        <Form
            onFinish={handleFilter}
            layout="vertical"
            style={{ marginBottom: 24 }}
        >
            <Row gutter={16}>
                {showSearch && (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item name="search">
                            <Input
                                placeholder={searchPlaceholder}
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                )}
                
                {Object.entries(filters).map(([key, config]) => {
                    if (key === 'search' || (key === dateRangeField && showDateRange)) {
                        return null;
                    }

                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={key}>
                            <Form.Item
                                name={key}
                                label={config.label}
                            >
                                {config.type === 'select' ? (
                                    <Select
                                        placeholder={`Select ${config.label}`}
                                        allowClear
                                        options={config.options}
                                    />
                                ) : (
                                    <Input placeholder={`Enter ${config.label}`} />
                                )}
                            </Form.Item>
                        </Col>
                    );
                })}

                {showDateRange && dateRangeField && (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                            name={dateRangeField}
                            label="Date Range"
                        >
                            <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                )}

                <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label=" " colon={false}>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SearchOutlined />}
                                loading={loading}
                            >
                                Search
                            </Button>
                            <Button
                                onClick={handleReset}
                                icon={<ReloadOutlined />}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default FilterBar; 
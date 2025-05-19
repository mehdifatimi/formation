import React, { useState, useCallback } from 'react';
import { Card, Table, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import FilterBar from './FilterBar';
import { useFilter } from '../../hooks/useFilter';

const { Search } = Input;

const DataTable = ({
    title,
    columns,
    dataSource,
    loading,
    filters,
    onFilter,
    searchPlaceholder,
    showDateRange,
    dateRangeField,
    extra,
    onSearch,
}) => {
    const { filters: currentFilters, updateFilters, resetFilters } = useFilter(filters);
    const [searchText, setSearchText] = useState('');

    const handleFilter = (values) => {
        updateFilters(values);
        onFilter?.(values);
    };

    const handleReset = () => {
        resetFilters();
        onFilter?.({});
    };

    const handleSearch = useCallback((value) => {
        setSearchText(value);
        if (onSearch) {
            onSearch(value);
        }
    }, [onSearch]);

    const filteredData = useCallback(() => {
        if (!searchText) return dataSource;

        return dataSource.filter(item => {
            return Object.values(item).some(val => 
                val && val.toString().toLowerCase().includes(searchText.toLowerCase())
            );
        });
    }, [dataSource, searchText]);

    return (
        <Card
            title={title}
            extra={
                <Space>
                    {extra}
                </Space>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder={searchPlaceholder || "Rechercher..."}
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={handleSearch}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        value={searchText}
                    />
                </Space>

                {filters && onFilter && (
                    <FilterBar
                        filters={filters}
                        onFilter={handleFilter}
                        onReset={handleReset}
                        showDateRange={showDateRange}
                        dateRangeField={dateRangeField}
                    />
                )}

                <Table
                    columns={columns}
                    dataSource={filteredData()}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} éléments`,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    scroll={{ x: 'max-content' }}
                />
            </Space>
        </Card>
    );
};

export default DataTable; 
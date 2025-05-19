import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useFilter = (initialFilters) => {
    const [filters, setFilters] = useState(initialFilters || {});

    const updateFilters = useCallback((newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({});
    }, []);

    return {
        filters,
        updateFilters,
        resetFilters
    };
};

const useFilterWithNavigate = (initialFilters = {}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [filters, setFilters] = useState(() => {
        const params = new URLSearchParams(location.search);
        const initial = {};
        
        // Convert URL parameters to filter state
        for (const [key, value] of params.entries()) {
            if (value) {
                initial[key] = value;
            }
        }
        
        return { ...initialFilters, ...initial };
    });

    const updateFilters = useCallback((newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        
        // Remove empty filters
        Object.keys(updatedFilters).forEach(key => {
            if (updatedFilters[key] === '' || updatedFilters[key] === null || updatedFilters[key] === undefined) {
                delete updatedFilters[key];
            }
        });

        setFilters(updatedFilters);

        // Update URL with new filters
        const params = new URLSearchParams();
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value) {
                params.append(key, value);
            }
        });

        navigate({
            pathname: location.pathname,
            search: params.toString()
        }, { replace: true });
    }, [filters, navigate, location]);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
        navigate({
            pathname: location.pathname,
            search: ''
        }, { replace: true });
    }, [initialFilters, navigate, location]);

    const getFilterParams = useCallback(() => {
        return Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }, [filters]);

    return {
        filters,
        updateFilters,
        resetFilters,
        getFilterParams
    };
};

export default useFilterWithNavigate; 
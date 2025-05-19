<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    public function scopeFilter($query, array $filters)
    {
        foreach ($filters as $field => $value) {
            if (method_exists($this, 'scope' . ucfirst($field))) {
                $query->{$field}($value);
            } elseif ($value !== null && $value !== '') {
                if (is_array($value)) {
                    if (isset($value['operator']) && isset($value['value'])) {
                        $query->where($field, $value['operator'], $value['value']);
                    } else {
                        $query->whereIn($field, $value);
                    }
                } else {
                    $query->where($field, $value);
                }
            }
        }
        return $query;
    }

    public function scopeSearch($query, $term)
    {
        $searchableFields = $this->searchable ?? [];
        
        if (empty($searchableFields)) {
            return $query;
        }

        return $query->where(function ($q) use ($searchableFields, $term) {
            foreach ($searchableFields as $field) {
                $q->orWhere($field, 'LIKE', "%{$term}%");
            }
        });
    }

    public function scopeDateRange($query, $field, $start, $end)
    {
        if ($start) {
            $query->whereDate($field, '>=', $start);
        }
        if ($end) {
            $query->whereDate($field, '<=', $end);
        }
        return $query;
    }

    public function scopeSort($query, $field, $direction = 'asc')
    {
        if ($field && in_array(strtolower($direction), ['asc', 'desc'])) {
            return $query->orderBy($field, $direction);
        }
        return $query;
    }
} 
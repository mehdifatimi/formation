<?php

namespace App\Models\Traits;

use App\Models\Role;
use App\Models\Permission;

trait HasRoles
{
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('slug', $role);
        }
        return !!$role->intersect($this->roles)->count();
    }

    public function hasPermission($permission)
    {
        if (is_string($permission)) {
            return $this->roles->flatMap->permissions->contains('slug', $permission);
        }
        return !!$permission->intersect($this->roles->flatMap->permissions)->count();
    }

    public function getAllPermissions()
    {
        return $this->roles->flatMap->permissions->unique('id');
    }

    public function giveRoleTo($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }
        $this->roles()->syncWithoutDetaching($role);
        return $this;
    }

    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }
        $this->roles()->detach($role);
        return $this;
    }

    public function syncRoles($roles)
    {
        if (is_string($roles)) {
            $roles = Role::where('slug', $roles)->get();
        }
        $this->roles()->sync($roles);
        return $this;
    }
} 
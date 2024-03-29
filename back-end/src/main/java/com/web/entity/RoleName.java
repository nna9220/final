package com.web.entity;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;

public enum RoleName {
    Admin,
    Student,
    Lecturer,
    Guest,
    HeadOfDepartment;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = new ArrayList<SimpleGrantedAuthority>();

        // Thêm quyền (role) vào danh sách quyền
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));

        return authorities;
    }
}


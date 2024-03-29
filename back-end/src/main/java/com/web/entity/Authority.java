package com.web.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "authority")
@Getter
@Setter
@ToString
public class Authority {
    @Id
    private String name;
    // Thêm một hàm tạo nhận tham số là String
    public Authority(String name) {
        this.name = name;
    }

    // Thêm một hàm tạo mặc định (yêu cầu bởi JPA)
    public Authority() {
    }
}

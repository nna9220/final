package com.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration

public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/Admin/HDSD_SauDaiHoc_HocVien.pdf")
                        .allowedOrigins("http://test-env.eba-2tbbdpy7.ap-southeast-2.elasticbeanstalk.com"); // Thay đổi domain của ứng dụng của bạn
            }
        };
    }
}

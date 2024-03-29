package com.web.config;

import com.web.jwt.JWTConfigurer;
import com.web.jwt.JwtTokenProvider;
import com.web.repository.PersonRepository;
import com.web.utils.Contains;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtTokenProvider tokenProvider;

    private final PersonRepository userRepository;

    private final CorsFilter corsFilter;

    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    public WebSecurityConfig(JwtTokenProvider tokenProvider, PersonRepository userRepository, CorsFilter corsFilter, TokenAuthenticationFilter tokenAuthenticationFilter, OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.corsFilter = corsFilter;
        this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        // Get AuthenticationManager bean
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf()
                .disable()
                .addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling()
                .and()
                .headers()
                .and()
                .authorizeRequests()
                .antMatchers("/api/public/**").permitAll()
                .antMatchers("/student/**").hasAuthority(Contains.ROLE_STUDENT)
                .antMatchers("/admin/**").hasAuthority(Contains.ROLE_ADMIN)
                .antMatchers("/lecturer/**").hasAuthority(Contains.ROLE_LECTURER)
                .antMatchers("/headOfDepartment/**").hasAuthority(Contains.ROLE_HEAD)
                .antMatchers("/login-form").permitAll()
                .and().apply(securityConfigurerAdapter()).and()
                .oauth2Login()
                .successHandler(oAuth2AuthenticationSuccessHandler);


//                .and()
//                .apply(securityConfigurerAdapter());
    }
    @Override
    public void configure(WebSecurity web) throws Exception {

    }
    private JWTConfigurer securityConfigurerAdapter() {
        return new JWTConfigurer(tokenProvider, userRepository);
    }

}


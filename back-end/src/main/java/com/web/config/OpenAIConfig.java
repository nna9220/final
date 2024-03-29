package com.web.config;

import com.web.utils.Contains;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "",
                        email = "",
                        url = ""
                ),
                description = "FAMS",
                title = "",
                version = "",
                license = @License(
                        name = "",
                        url = ""
                ),
                termsOfService = ""
        ),
        servers = {
                @Server(
                        description = "",
                        url = Contains.URL
                ),
                @Server(
                        description = "",
                        url = "#"
                ),
        }
)
@SecurityScheme(
        name = "Authorization",
        description = "JWT Token",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer",
        in = SecuritySchemeIn.HEADER
)

public class OpenAIConfig {

}

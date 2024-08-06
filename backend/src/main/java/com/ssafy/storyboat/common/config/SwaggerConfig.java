package com.ssafy.storyboat.common.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("Spring Boot REST API Specifications")
                .description("Specification")
                .version("1.0.0");
    }

    @Bean
    public GroupedOpenApi userOpenApi() {
        String[] paths = {"/users/**"};
        return GroupedOpenApi.builder().group("users").pathsToMatch(paths)
                .build();
    }

    @Bean
    public GroupedOpenApi studioOpenApi() {
        String[] paths = {"/studios/{studioId}", "/studios"};
        return GroupedOpenApi.builder().group("studios").pathsToMatch(paths)
                .build();
    }

    @Bean
    public GroupedOpenApi ideaOpenApi() {
        String[] paths = {"/studios/*/ideas/**"};
        return GroupedOpenApi.builder().group("ideas").pathsToMatch(paths)
                .build();
    }

    @Bean
    public GroupedOpenApi storyOpenApi() {
        String[] paths = {"/studios/*/stories/**"};
        return GroupedOpenApi.builder().group("stories").pathsToMatch(paths)
                .build();
    }

    @Bean
    public GroupedOpenApi characterOpenApi() {
        String[] paths = {"/studios/*/characters/**"};
        return GroupedOpenApi.builder().group("characters").pathsToMatch(paths)
                .build();

    }
}
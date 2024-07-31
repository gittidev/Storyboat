package com.ssafy.storyboat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class StoryboatApplication {
	public static void main(String[] args) {
		SpringApplication.run(StoryboatApplication.class, args);
	}
}

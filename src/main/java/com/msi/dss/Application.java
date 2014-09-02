package com.msi.dss;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan
@EnableAutoConfiguration
@EnableJpaRepositories
// @Import(RepositoryRestMvcConfiguration.class)
@PropertySource("classpath:application.properties")
public class Application extends SpringBootServletInitializer {
  //
  // public static void main(String[] args) {
  // SpringApplication.run(Application.class, args);
  // }

  @Override
  protected SpringApplicationBuilder configure(
      SpringApplicationBuilder application) {
    return application.sources(Application.class);
  }

  public static void main(String... args) {
    System.setProperty("spring.profiles.default",
        System.getProperty("spring.profiles.default", "dev"));
    SpringApplication.run(Application.class, args);
  }

  @Bean(destroyMethod = "shutdown")
  public Executor taskScheduler(
      final @Value("${dss.scheduled-thread-pool-size:10}") int scheduledThreadPoolSize) {
    return Executors.newScheduledThreadPool(scheduledThreadPoolSize);
  }
}

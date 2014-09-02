package com.msi.dss.web.config;

import java.util.EnumSet;

import javax.servlet.DispatcherType;
import javax.servlet.MultipartConfigElement;

import org.springframework.boot.context.embedded.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

	/**
	 * Maps all AngularJS routes to index so that they work with direct linking.
	 */
	@Controller
	static class Routes {

		@RequestMapping({ "/station", "/about" })
		public String index() {
			return "forward:/index.html";
		}
	}

	@Bean
	public ServletContextInitializer servletContextInitializer() {
		return servletContext -> {
			final CharacterEncodingFilter characterEncodingFilter = new CharacterEncodingFilter();
			characterEncodingFilter.setEncoding("UTF-8");
			characterEncodingFilter.setForceEncoding(false);

			servletContext.addFilter("characterEncodingFilter",
					characterEncodingFilter).addMappingForUrlPatterns(
					EnumSet.of(DispatcherType.REQUEST), false, "/*");
		};
	}

	@Bean
	public MultipartConfigElement multipartConfigElement() {
		return new MultipartConfigElement("", 5 * 1024 * 1024, 5 * 1024 * 1024,
				1024 * 1024);
	}

	/**
	 * Enable favor of format parameter over requested content type, needed for
	 * {@link OEmbedController#getEmbeddableTrack(java.lang.String, java.lang.String, java.lang.Integer, java.lang.Integer, javax.servlet.http.HttpServletRequest)}
	 *
	 * @param configurer
	 */
	@Override
	public void configureContentNegotiation(
			ContentNegotiationConfigurer configurer) {
		super.configureContentNegotiation(configurer);
		configurer.favorParameter(true);
	}

	/**
	 * This makes mapping of
	 * {@link TracksController#downloadTrack(java.lang.String, java.lang.String, javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)}
	 * and the default mapping in separate methods possible.
	 * 
	 * @param configurer
	 */
	@Override
	public void configurePathMatch(final PathMatchConfigurer configurer) {
		configurer.setUseRegisteredSuffixPatternMatch(true);
	}

}
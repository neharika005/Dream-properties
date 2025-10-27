package com.example.real_estate.config;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.real_estate.dto.PropertyDto;
import com.example.real_estate.model.Property;



@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        
        mapper.addMappings(new PropertyMap<PropertyDto, Property>() {
            @Override
            protected void configure() {
                skip(destination.getAgent());
            }
        });

        return mapper;
    }
}

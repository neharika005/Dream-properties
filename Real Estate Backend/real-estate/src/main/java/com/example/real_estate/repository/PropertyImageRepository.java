package com.example.real_estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.real_estate.model.PropertyImage;

public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {

    List<PropertyImage> findByProperty_Id(Long propertyId);
     List<PropertyImage> findByProperty_Title(String title);
}

package com.example.real_estate.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.real_estate.model.Inquiry;
import com.example.real_estate.model.Property;
import com.example.real_estate.model.User;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByBuyer(User buyer);
    List<Inquiry> findByProperty(Property property);
    List<Inquiry> findByProperty_Id(Long propertyId);
 List<Inquiry> findByProperty_IdIn(List<Long> propertyIds);


}
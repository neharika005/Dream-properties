package com.example.real_estate.service;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.real_estate.model.User;
import com.example.real_estate.repository.UserRepository;
import com.example.real_estate.security.CustomUserDetails;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException(email + " not found"));

        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority(user.getRole().getName())
        );

        return new CustomUserDetails(
            user.getId(),         
            user.getEmail(),      
            user.getPassword(),
            authorities
        );
    }
}

package com.example.real_estate.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.real_estate.dto.AgentApprovalDto;
import com.example.real_estate.dto.UserDto;
import com.example.real_estate.exception.DuplicateResourceException;
import com.example.real_estate.exception.ResourceNotFoundException;
import com.example.real_estate.model.Role;
import com.example.real_estate.model.User;
import com.example.real_estate.repository.RoleRepository;
import com.example.real_estate.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDto createUser(UserDto dto, Long roleId) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already registered: " + dto.getEmail());
        }

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId));

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(role)
                .build();

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    // Agent Approval for Admin Dashboard
    public List<AgentApprovalDto> getAllAgentApprovals() {
        return userRepository.findByRole_Name("AGENT")
                .stream()
                .map(user -> AgentApprovalDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .approved(user.isApproved())
                        .build()
                ).collect(Collectors.toList());
    }

    // Utility for UserDto mapping
    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // Approve/disapprove functions for admin
    public boolean approveAgentById(Long agentId) {
        return setApprovalStatus(agentId, true);
    }
    public boolean disapproveAgentById(Long agentId) {
        return setApprovalStatus(agentId, false);
    }
    private boolean setApprovalStatus(Long userId, boolean status) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getRole() != null && "AGENT".equalsIgnoreCase(user.getRole().getName())) {
                user.setApproved(status);
                userRepository.save(user);
                return true;
            }
        }
        return false; //false
    }
}

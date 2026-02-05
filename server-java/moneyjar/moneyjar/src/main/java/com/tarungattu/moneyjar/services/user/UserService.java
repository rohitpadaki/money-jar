package com.tarungattu.moneyjar.services.user;

import com.tarungattu.moneyjar.dto.PrivateUserDto;
import com.tarungattu.moneyjar.models.User;
import com.tarungattu.moneyjar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User addUser(PrivateUserDto userDto) {
        User user = new User();
        user.setName(userDto.getName());
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(UUID userId, PrivateUserDto userDto) {
        return userRepository.findById(userId).map(user -> {
            if (userDto.getName() != null) user.setName(userDto.getName());
            if (userDto.getUsername() != null) user.setUsername(userDto.getUsername());
            if (userDto.getPassword() != null) user.setPassword(passwordEncoder.encode(userDto.getPassword())); // Optional update?
            // NestJS code: await this.userRepository.update(userId, user); 
            // This implies partial update.
            return userRepository.save(user);
        }).orElse(null);
    }

    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User findById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }
}

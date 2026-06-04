package com.smartinvoice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20,
          message = "Username must be between 3 and 20 characters")
    @Pattern(
        regexp = "^[a-zA-Z0-9_]+$",
        message = "Username can only contain letters, numbers and underscore"
    )
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8,
          message = "Password must be at least 8 characters")
    @Pattern(
    	regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*@._-])[A-Za-z\\d!@#$%^&*@._-]{8,}$",
    	message = "Password must have at least 1 uppercase letter, 1 number and 1 special character (!@#$%^&*@._-)"
    )
    private String password;

    private String role;
}
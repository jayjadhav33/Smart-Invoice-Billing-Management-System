package com.smartinvoice.security;

import com.smartinvoice.entity.User;
import com.smartinvoice.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User =
                (OAuth2User) authentication.getPrincipal();

        // Extract user info from Google
        String email = oAuth2User.getAttribute("email");
        String name  = oAuth2User.getAttribute("name");

        // Find or create user in our DB
        Optional<User> existingUser =
                userRepository.findByUsername(email);

        User user;
        if (existingUser.isPresent()) {
            // User already exists — just login
            user = existingUser.get();
        } else {
            // New Google user — auto-register
            user = new User();
            user.setUsername(email);
            // Google users don't need a password
            user.setPassword("GOOGLE_AUTH_"
                    + System.currentTimeMillis());
            user.setRole(User.Role.STAFF);
            userRepository.save(user);
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name());

        // Redirect to frontend with token + user info
        String redirectUrl = frontendUrl
                + "/oauth2/success"
                + "?token=" + token
                + "&username=" + encode(email)
                + "&role=" + user.getRole().name()
                + "&name=" + encode(name);

        getRedirectStrategy()
                .sendRedirect(request, response, redirectUrl);
    }

    private String encode(String value) {
        try {
            return java.net.URLEncoder.encode(
                    value, "UTF-8");
        } catch (Exception e) {
            return value;
        }
    }
}
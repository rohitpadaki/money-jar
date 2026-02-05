package com.tarungattu.moneyjar.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Match NestJS format: { statusCode: 400, message: "...", error: "Bad Request" }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        // Simulating NestJS validation pipe error structure roughly or just standard message
        Map<String, Object> body = new HashMap<>();
        body.put("statusCode", HttpStatus.BAD_REQUEST.value());
        body.put("message", errors); // Or join them
        body.put("error", "Bad Request");

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String errorLabel = "Internal Server Error";
        
        // Map common exceptions if specific ones exist, e.g. ResourceNotFound -> 404
        String msg = ex.getMessage();
        if (msg.contains("not found")) {
            status = HttpStatus.NOT_FOUND;
            errorLabel = "Not Found";
        } else if (msg.contains("Unauthorized") || msg.contains("not permitted")) {
            status = HttpStatus.FORBIDDEN;
            errorLabel = "Forbidden";
        } else if (msg.contains("required") || msg.contains("Invalid")) {
             status = HttpStatus.BAD_REQUEST;
             errorLabel = "Bad Request";
        }

        Map<String, Object> body = new HashMap<>();
        body.put("statusCode", status.value());
        body.put("message", ex.getMessage());
        body.put("error", errorLabel);

        return new ResponseEntity<>(body, status);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("statusCode", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("message", ex.getMessage());
        body.put("error", "Internal Server Error");
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

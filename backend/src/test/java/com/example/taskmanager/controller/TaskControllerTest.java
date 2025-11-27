package com.example.taskmanager.controller;

import com.example.taskmanager.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Basic test to verify Task Controller and Spring Boot 4 dependency injection
 */
@SpringBootTest
class TaskControllerTest {

    @Autowired
    private TaskController taskController;

    @Autowired
    private TaskService taskService;

    @Test
    void contextLoads() {
        // Verify that Spring Boot 4 can inject beans correctly
        assertThat(taskController).isNotNull();
        assertThat(taskService).isNotNull();
    }

    @Test
    void taskControllerIsCreated() {
        // Verify the controller is properly instantiated
        assertThat(taskController).isInstanceOf(TaskController.class);
    }
}

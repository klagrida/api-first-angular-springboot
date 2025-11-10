package com.example.taskmanager.controller;

import com.example.taskmanager.entity.TaskEntity;
import com.example.taskmanager.generated.api.TasksApi;
import com.example.taskmanager.generated.model.*;
import com.example.taskmanager.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Task Controller Implementation
 *
 * This controller implements the generated TasksApi interface, ensuring
 * compliance with the OpenAPI specification.
 *
 * API-First Approach:
 * - TasksApi interface is auto-generated from api/task-api.yaml
 * - All endpoint signatures, annotations, and validations come from the spec
 * - This class only contains business logic implementation
 * - Changes to the API require updating the OpenAPI spec first
 */
@RestController
@RequestMapping("/api/v1")
public class TaskController implements TasksApi {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public ResponseEntity<List<Task>> getTasks(Boolean completed, Integer limit) {
        List<TaskEntity> entities = taskService.getAllTasks(completed, limit);
        List<Task> tasks = entities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    @Override
    public ResponseEntity<Task> getTaskById(Long id) {
        return taskService.getTaskById(id)
                .map(entity -> ResponseEntity.ok(mapToDto(entity)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Task> createTask(TaskCreate taskCreate) {
        TaskEntity entity = mapToEntity(taskCreate);
        TaskEntity savedEntity = taskService.createTask(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(savedEntity));
    }

    @Override
    public ResponseEntity<Task> updateTask(Long id, TaskUpdate taskUpdate) {
        TaskEntity entity = mapToEntity(taskUpdate);
        return taskService.updateTask(id, entity)
                .map(updated -> ResponseEntity.ok(mapToDto(updated)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> deleteTask(Long id) {
        boolean deleted = taskService.deleteTask(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // Mapping methods
    private Task mapToDto(TaskEntity entity) {
        Task dto = new Task();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setCompleted(entity.getCompleted());
        dto.setPriority(entity.getPriority() != null ?
                Task.PriorityEnum.valueOf(entity.getPriority().name()) : null);
        dto.setDueDate(entity.getDueDate());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    private TaskEntity mapToEntity(TaskCreate dto) {
        return TaskEntity.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .completed(dto.getCompleted() != null ? dto.getCompleted() : false)
                .priority(dto.getPriority() != null ?
                        TaskEntity.Priority.valueOf(dto.getPriority().name()) : TaskEntity.Priority.MEDIUM)
                .dueDate(dto.getDueDate())
                .build();
    }

    private TaskEntity mapToEntity(TaskUpdate dto) {
        return TaskEntity.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .completed(dto.getCompleted())
                .priority(dto.getPriority() != null ?
                        TaskEntity.Priority.valueOf(dto.getPriority().name()) : null)
                .dueDate(dto.getDueDate())
                .build();
    }
}

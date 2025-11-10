package com.example.taskmanager.controller;

import com.example.taskmanager.entity.TaskEntity;
import com.example.taskmanager.model.*;
import com.example.taskmanager.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Custom Task Controller
 * This controller extends/implements the generated API interface.
 *
 * Implementation Strategy:
 * - Generated interfaces will be in target/generated-sources after running mvn generate-sources
 * - This controller implements the business logic
 * - You can regenerate the API without losing this custom code
 */
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false, defaultValue = "20") Integer limit) {

        List<TaskEntity> entities = taskService.getAllTasks(completed, limit);
        List<Task> tasks = entities.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .map(entity -> ResponseEntity.ok(mapToDto(entity)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@RequestBody TaskCreate taskCreate) {
        TaskEntity entity = mapToEntity(taskCreate);
        TaskEntity savedEntity = taskService.createTask(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(savedEntity));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody TaskUpdate taskUpdate) {

        TaskEntity entity = mapToEntity(taskUpdate);
        return taskService.updateTask(id, entity)
                .map(updated -> ResponseEntity.ok(mapToDto(updated)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
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

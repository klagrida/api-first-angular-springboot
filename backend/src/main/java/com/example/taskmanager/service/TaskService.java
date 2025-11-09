package com.example.taskmanager.service;

import com.example.taskmanager.entity.TaskEntity;
import com.example.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;

    public List<TaskEntity> getAllTasks(Boolean completed, Integer limit) {
        List<TaskEntity> tasks;

        if (completed != null) {
            tasks = taskRepository.findByCompleted(completed);
        } else {
            tasks = taskRepository.findAll();
        }

        if (limit != null && limit > 0 && limit < tasks.size()) {
            return tasks.subList(0, limit);
        }

        return tasks;
    }

    public Optional<TaskEntity> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Transactional
    public TaskEntity createTask(TaskEntity task) {
        return taskRepository.save(task);
    }

    @Transactional
    public Optional<TaskEntity> updateTask(Long id, TaskEntity updatedTask) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(updatedTask.getTitle());
                    existingTask.setDescription(updatedTask.getDescription());
                    existingTask.setCompleted(updatedTask.getCompleted());
                    existingTask.setPriority(updatedTask.getPriority());
                    existingTask.setDueDate(updatedTask.getDueDate());
                    return taskRepository.save(existingTask);
                });
    }

    @Transactional
    public boolean deleteTask(Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    taskRepository.delete(task);
                    return true;
                })
                .orElse(false);
    }
}

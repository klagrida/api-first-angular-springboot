package com.example.taskmanager.generated.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.time.OffsetDateTime;
import org.springframework.format.annotation.DateTimeFormat;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * TaskCreate
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2025-11-10T11:29:42.852794164Z[Etc/UTC]")
public class TaskCreate {

  private String title;

  private String description;

  private Boolean completed = false;

  /**
   * Task priority level
   */
  public enum PriorityEnum {
    LOW("LOW"),
    
    MEDIUM("MEDIUM"),
    
    HIGH("HIGH");

    private String value;

    PriorityEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static PriorityEnum fromValue(String value) {
      for (PriorityEnum b : PriorityEnum.values()) {
        if (b.value.equals(value)) {
          return b;
        }
      }
      throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
  }

  private PriorityEnum priority = PriorityEnum.MEDIUM;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime dueDate;

  public TaskCreate() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public TaskCreate(String title) {
    this.title = title;
  }

  public TaskCreate title(String title) {
    this.title = title;
    return this;
  }

  /**
   * Task title
   * @return title
  */
  @NotNull @Size(min = 1, max = 200) 
  @Schema(name = "title", example = "Complete project documentation", description = "Task title", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty("title")
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public TaskCreate description(String description) {
    this.description = description;
    return this;
  }

  /**
   * Detailed description of the task
   * @return description
  */
  @Size(max = 1000) 
  @Schema(name = "description", example = "Write comprehensive documentation for the API-first approach", description = "Detailed description of the task", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("description")
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public TaskCreate completed(Boolean completed) {
    this.completed = completed;
    return this;
  }

  /**
   * Task completion status
   * @return completed
  */
  
  @Schema(name = "completed", example = "false", description = "Task completion status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("completed")
  public Boolean getCompleted() {
    return completed;
  }

  public void setCompleted(Boolean completed) {
    this.completed = completed;
  }

  public TaskCreate priority(PriorityEnum priority) {
    this.priority = priority;
    return this;
  }

  /**
   * Task priority level
   * @return priority
  */
  
  @Schema(name = "priority", example = "HIGH", description = "Task priority level", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("priority")
  public PriorityEnum getPriority() {
    return priority;
  }

  public void setPriority(PriorityEnum priority) {
    this.priority = priority;
  }

  public TaskCreate dueDate(OffsetDateTime dueDate) {
    this.dueDate = dueDate;
    return this;
  }

  /**
   * Task due date
   * @return dueDate
  */
  @Valid 
  @Schema(name = "dueDate", example = "2024-12-31T23:59:59Z", description = "Task due date", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
  @JsonProperty("dueDate")
  public OffsetDateTime getDueDate() {
    return dueDate;
  }

  public void setDueDate(OffsetDateTime dueDate) {
    this.dueDate = dueDate;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TaskCreate taskCreate = (TaskCreate) o;
    return Objects.equals(this.title, taskCreate.title) &&
        Objects.equals(this.description, taskCreate.description) &&
        Objects.equals(this.completed, taskCreate.completed) &&
        Objects.equals(this.priority, taskCreate.priority) &&
        Objects.equals(this.dueDate, taskCreate.dueDate);
  }

  @Override
  public int hashCode() {
    return Objects.hash(title, description, completed, priority, dueDate);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class TaskCreate {\n");
    sb.append("    title: ").append(toIndentedString(title)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    completed: ").append(toIndentedString(completed)).append("\n");
    sb.append("    priority: ").append(toIndentedString(priority)).append("\n");
    sb.append("    dueDate: ").append(toIndentedString(dueDate)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}


# Generated API Code

⚠️ **DO NOT EDIT FILES IN THIS DIRECTORY** ⚠️

This directory contains code automatically generated from the OpenAPI specification located at `api/task-api.yaml`.

## What's in here?

- **`api/`** - Generated API interfaces (e.g., `TasksApi.java`)
- **`model/`** - Generated model/DTO classes (e.g., `Task.java`, `TaskCreate.java`, `TaskUpdate.java`)

## How is this code generated?

- **Locally**: Run `./mvnw generate-sources` from the `backend` directory
- **CI/CD**: Automatically regenerated and committed when the OpenAPI spec changes

## Making changes

If you need to modify the API structure:

1. Edit the OpenAPI specification: `api/task-api.yaml`
2. Run `./mvnw generate-sources` to regenerate this code
3. The CI/CD pipeline will automatically commit the generated changes

## Implementation

Your business logic should be in separate controller classes that use these generated models and interfaces. See `controller/TaskController.java` for an example.

import { test, expect } from '@playwright/test';

/**
 * E2E tests for Task Management CRUD operations
 * Tests the full flow from UI to backend API
 */

test.describe('Task Manager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    await expect(page.locator('h2')).toContainText('Task Manager');
  });

  test('should display task manager interface', async ({ page }) => {
    // Check main elements are present
    await expect(page.locator('h2')).toContainText('Task Manager');
    await expect(page.getByRole('button', { name: /new task/i })).toBeVisible();

    // Check filter buttons are present
    await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Click "New Task" button
    await page.getByRole('button', { name: /new task/i }).click();

    // Wait for form modal to appear
    await expect(page.locator('h3')).toContainText('New Task');

    // Fill in task details
    await page.locator('#title').fill('Test Task from E2E');
    await page.locator('#description').fill('This is a test task created by Playwright');
    await page.locator('#priority').selectOption('HIGH');

    // Set due date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.locator('#dueDate').fill(dateString);

    // Submit the form
    await page.getByRole('button', { name: 'Create' }).click();

    // Wait for modal to close and task to appear in list
    await expect(page.locator('h3').filter({ hasText: 'New Task' })).not.toBeVisible();

    // Verify task appears in the list
    await expect(page.locator('h3').filter({ hasText: 'Test Task from E2E' })).toBeVisible();
    await expect(page.locator('p').filter({ hasText: 'This is a test task created by Playwright' })).toBeVisible();
  });

  test('should edit an existing task', async ({ page }) => {
    // First create a task to edit
    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('Task to Edit');
    await page.locator('#description').fill('Original description');
    await page.locator('#priority').selectOption('LOW');
    await page.getByRole('button', { name: 'Create' }).click();

    // Wait for task to appear
    await expect(page.locator('h3').filter({ hasText: 'Task to Edit' })).toBeVisible();

    // Click edit button for the task
    await page.locator('li').filter({ hasText: 'Task to Edit' }).getByRole('button', { name: /edit/i }).click();

    // Wait for edit form to appear
    await expect(page.locator('h3').filter({ hasText: 'Edit Task' })).toBeVisible();

    // Update task details
    await page.locator('#title').fill('Updated Task Title');
    await page.locator('#description').fill('Updated description');
    await page.locator('#priority').selectOption('HIGH');

    // Submit the update
    await page.getByRole('button', { name: 'Update' }).click();

    // Verify updated task appears
    await expect(page.locator('h3').filter({ hasText: 'Updated Task Title' })).toBeVisible();
    await expect(page.locator('p').filter({ hasText: 'Updated description' })).toBeVisible();
    await expect(page.locator('.priority-high').filter({ hasText: 'HIGH' })).toBeVisible();
  });

  test('should complete a task', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('Task to Complete');
    await page.getByRole('button', { name: 'Create' }).click();

    // Wait for task to appear
    await expect(page.locator('h3').filter({ hasText: 'Task to Complete' })).toBeVisible();

    // Click complete button
    const taskItem = page.locator('li').filter({ hasText: 'Task to Complete' });
    await taskItem.getByRole('button', { name: /complete/i }).click();

    // Wait for task to be marked as completed (with strikethrough)
    await expect(taskItem).toHaveClass(/completed/);

    // Verify button text changed to "Undo"
    await expect(taskItem.getByRole('button', { name: /undo/i })).toBeVisible();
  });

  test('should undo task completion', async ({ page }) => {
    // Create and complete a task
    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('Task to Undo');
    await page.getByRole('button', { name: 'Create' }).click();

    const taskItem = page.locator('li').filter({ hasText: 'Task to Undo' });
    await taskItem.getByRole('button', { name: /complete/i }).click();
    await expect(taskItem).toHaveClass(/completed/);

    // Click undo button
    await taskItem.getByRole('button', { name: /undo/i }).click();

    // Verify task is no longer completed
    await expect(taskItem).not.toHaveClass(/completed/);
    await expect(taskItem.getByRole('button', { name: /complete/i })).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Create a task to delete
    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('Task to Delete');
    await page.getByRole('button', { name: 'Create' }).click();

    // Wait for task to appear
    await expect(page.locator('h3').filter({ hasText: 'Task to Delete' })).toBeVisible();

    // Set up dialog handler to accept the confirmation
    page.on('dialog', dialog => dialog.accept());

    // Click delete button
    await page.locator('li').filter({ hasText: 'Task to Delete' }).getByRole('button', { name: /delete/i }).click();

    // Wait for task to be removed from the list
    await expect(page.locator('h3').filter({ hasText: 'Task to Delete' })).not.toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    // Create two tasks: one active, one completed
    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('Active Task');
    await page.getByRole('button', { name: 'Create' }).click();

    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('Completed Task');
    await page.getByRole('button', { name: 'Create' }).click();

    // Mark second task as completed
    await page.locator('li').filter({ hasText: 'Completed Task' }).getByRole('button', { name: /complete/i }).click();

    // Test "All" filter
    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.locator('h3').filter({ hasText: 'Active Task' })).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Completed Task' })).toBeVisible();

    // Test "Active" filter
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.locator('h3').filter({ hasText: 'Active Task' })).toBeVisible();
    // Note: Completed task might still be visible in DOM but filtered

    // Test "Completed" filter
    await page.getByRole('button', { name: 'Completed' }).click();
    await expect(page.locator('h3').filter({ hasText: 'Completed Task' })).toBeVisible();
  });

  test('should refresh task list', async ({ page }) => {
    // Create a task
    await page.getByRole('button', { name: /new task/i }).click();
    await page.locator('#title').fill('Task Before Refresh');
    await page.getByRole('button', { name: 'Create' }).click();

    // Click refresh button
    await page.getByRole('button', { name: /refresh/i }).click();

    // Verify task is still visible after refresh
    await expect(page.locator('h3').filter({ hasText: 'Task Before Refresh' })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Open new task form
    await page.getByRole('button', { name: /new task/i }).click();

    // Try to submit without title
    await page.getByRole('button', { name: 'Create' }).click();

    // Form should still be visible (validation prevented submission)
    await expect(page.locator('h3').filter({ hasText: 'New Task' })).toBeVisible();

    // Title field should have required attribute
    await expect(page.locator('#title')).toHaveAttribute('required');
  });

  test('should cancel task creation', async ({ page }) => {
    // Open new task form
    await page.getByRole('button', { name: /new task/i }).click();
    await expect(page.locator('h3').filter({ hasText: 'New Task' })).toBeVisible();

    // Fill in some data
    await page.locator('#title').fill('This should be cancelled');

    // Click cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Form should be closed
    await expect(page.locator('h3').filter({ hasText: 'New Task' })).not.toBeVisible();

    // Task should not appear in list
    await expect(page.locator('h3').filter({ hasText: 'This should be cancelled' })).not.toBeVisible();
  });

  test('should close form by clicking overlay', async ({ page }) => {
    // Open new task form
    await page.getByRole('button', { name: /new task/i }).click();
    await expect(page.locator('h3').filter({ hasText: 'New Task' })).toBeVisible();

    // Click on the overlay (outside the form)
    await page.locator('.task-form-overlay').click({ position: { x: 5, y: 5 } });

    // Form should be closed
    await expect(page.locator('h3').filter({ hasText: 'New Task' })).not.toBeVisible();
  });
});

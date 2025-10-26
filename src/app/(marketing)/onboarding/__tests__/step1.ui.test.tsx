// UI tests for Step 1 (Personal Details)
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import Step1 from '../step1';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/server';

describe('Step 1: Personal Details - User Workflows', () => {
  it('user successfully creates a new profile and moves to next step', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // User fills in all required fields
    await user.type(screen.getByPlaceholderText(/first name/i), 'Jane');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Smith');
    await user.type(screen.getByPlaceholderText(/email address/i), 'jane@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');

    // Fill date of birth (use document.querySelector for date input)
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, '1995-05-15');

    // User submits the form
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    // User sees loading state
    expect(await screen.findByRole('button', { name: /creating/i })).toBeInTheDocument();

    // Wait for API call to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  it('user encounters duplicate phone error and sees helpful message', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // User fills form with duplicate phone
    await user.type(screen.getByPlaceholderText(/first name/i), 'Jane');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email address/i), 'unique@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '700000000');

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, '1990-01-15');

    // User submits
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees duplicate phone error in alert box
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/this phone number is already registered/i);
  });

  it('user encounters network error and sees error message', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // Override handler to simulate network error
    server.use(
      http.post('*/api/user-profiles', () => {
        return HttpResponse.error();
      })
    );

    // User fills valid form
    await user.type(screen.getByPlaceholderText(/first name/i), 'John');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, '1990-01-15');

    // User submits
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees network error in alert box
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/network error/i);
  });

  it('button is disabled while creating profile', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // Fill form
    await user.type(screen.getByPlaceholderText(/first name/i), 'John');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, '1990-01-15');

    const continueButton = screen.getByRole('button', { name: /continue/i });

    // Button is enabled before submit
    expect(continueButton).not.toBeDisabled();

    // Submit
    await user.click(continueButton);

    // Button becomes disabled
    const creatingButton = await screen.findByRole('button', { name: /creating/i });
    expect(creatingButton).toBeDisabled();
  });

  it('validates date of birth is required', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // Fill all fields except date of birth
    await user.type(screen.getByPlaceholderText(/first name/i), 'Jane');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Smith');
    await user.type(screen.getByPlaceholderText(/email address/i), 'jane@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');

    // User submits without date of birth
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees validation error
    expect(await screen.findByText(/date of birth is required/i)).toBeInTheDocument();
  });

  it('validates user must be at least 18 years old', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // Fill form with valid data
    await user.type(screen.getByPlaceholderText(/first name/i), 'Minor');
    await user.type(screen.getByPlaceholderText(/last name/i), 'User');
    await user.type(screen.getByPlaceholderText(/email address/i), 'minor@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');

    // Enter date of birth for someone under 18 (e.g., 15 years old)
    const today = new Date();
    const fifteenYearsAgo = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    const dateString = fifteenYearsAgo.toISOString().split('T')[0];

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, dateString);

    // User submits
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees age validation error
    expect(await screen.findByText(/you must be at least 18 years old/i)).toBeInTheDocument();
  });

  it('accepts user who is exactly 18 years old', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // Fill form with valid data
    await user.type(screen.getByPlaceholderText(/first name/i), 'Just');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Eighteen');
    await user.type(screen.getByPlaceholderText(/email address/i), 'eighteen@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');

    // Enter date of birth for someone exactly 18 years old today
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const dateString = eighteenYearsAgo.toISOString().split('T')[0];

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, dateString);

    // User submits
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Should NOT see age validation error - should see loading state instead
    expect(await screen.findByRole('button', { name: /creating/i })).toBeInTheDocument();

    // Wait for API call to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  it('rejects future date of birth', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // Fill form with valid data
    await user.type(screen.getByPlaceholderText(/first name/i), 'Future');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Person');
    await user.type(screen.getByPlaceholderText(/email address/i), 'future@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');

    // Enter future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, dateString);

    // User submits
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees age validation error
    expect(await screen.findByText(/you must be at least 18 years old/i)).toBeInTheDocument();
  });
});

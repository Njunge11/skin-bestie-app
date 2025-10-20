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

  it('user encounters validation errors and recovers to submit successfully', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // User submits empty form
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees ALL validation errors
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/mobile number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();

    // User fills first and last name
    await user.type(screen.getByPlaceholderText(/first name/i), 'John');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');

    // User submits again
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Name errors should be gone, others still visible
    expect(screen.queryByText(/first name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/last name is required/i)).not.toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    // User enters invalid email
    await user.type(screen.getByPlaceholderText(/email address/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees email validation error
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();

    // User corrects email
    await user.clear(screen.getByPlaceholderText(/email address/i));
    await user.type(screen.getByPlaceholderText(/email address/i), 'john@example.com');

    // User fills phone number and date
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, '1990-01-15');

    // User submits successfully
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Loading state appears
    expect(await screen.findByRole('button', { name: /creating/i })).toBeInTheDocument();
  });

  it('user encounters duplicate email error and sees helpful message', async () => {
    const user = userEvent.setup();
    render(<Step1 />);

    // User fills form with duplicate email
    await user.type(screen.getByPlaceholderText(/first name/i), 'Jane');
    await user.type(screen.getByPlaceholderText(/last name/i), 'Doe');
    await user.type(screen.getByPlaceholderText(/email address/i), 'duplicate@example.com');
    await user.type(screen.getByPlaceholderText(/712 345 678/i), '712345678');

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, '1990-01-15');

    // User submits
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees duplicate email error in alert box
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/this email is already registered/i);
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
});

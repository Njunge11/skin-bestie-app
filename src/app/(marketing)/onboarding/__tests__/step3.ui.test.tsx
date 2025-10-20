// UI tests for Step 3 (Skin Concerns)
import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import Step3 from '../step3';
import { useFormContext } from 'react-hook-form';

function Step3WithProfile() {
  const { setValue } = useFormContext();
  React.useEffect(() => {
    setValue('userProfileId', 'test-profile-123');
  }, [setValue]);
  return <Step3 />;
}

describe('Step 3: Skin Concerns - User Workflows', () => {
  it('user selects concerns and saves successfully', async () => {
    const user = userEvent.setup();
    render(<Step3WithProfile />);

    // Select Acne and Dryness
    await user.click(screen.getByLabelText(/acne/i));
    await user.click(screen.getByLabelText(/dryness/i));

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('user encounters validation error when no concern selected and recovers', async () => {
    const user = userEvent.setup();
    render(<Step3WithProfile />);

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByText(/pick at least one concern/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/acne/i));

    await waitFor(() => {
      expect(screen.queryByText(/pick at least one concern/i)).not.toBeInTheDocument();
    });
  });

  it('user selects "Other" and text field appears with validation', async () => {
    const user = userEvent.setup();
    render(<Step3WithProfile />);

    // Text field should not be visible initially
    expect(screen.queryByPlaceholderText(/write something/i)).not.toBeInTheDocument();

    // Select "Other"
    await user.click(screen.getByLabelText(/^other$/i));

    // Text field appears
    expect(screen.getByPlaceholderText(/write something/i)).toBeInTheDocument();

    // Submit without filling text
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Validation error for empty "Other" field
    expect(await screen.findByText(/please describe "other"/i)).toBeInTheDocument();

    // Fill in the text field
    await user.type(screen.getByPlaceholderText(/write something/i), 'Custom concern here');

    // Submit successfully
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('user deselects "Other" and text field disappears', async () => {
    const user = userEvent.setup();
    render(<Step3WithProfile />);

    // Select "Other"
    await user.click(screen.getByLabelText(/^other$/i));
    expect(screen.getByPlaceholderText(/write something/i)).toBeInTheDocument();

    // Type something
    await user.type(screen.getByPlaceholderText(/write something/i), 'My concern');

    // Deselect "Other"
    await user.click(screen.getByLabelText(/^other$/i));

    // Text field disappears
    expect(screen.queryByPlaceholderText(/write something/i)).not.toBeInTheDocument();
  });

  it('user can select multiple concerns including Other', async () => {
    const user = userEvent.setup();
    render(<Step3WithProfile />);

    await user.click(screen.getByLabelText(/acne/i));
    await user.click(screen.getByLabelText(/pigmentation/i));
    await user.click(screen.getByLabelText(/^other$/i));

    await user.type(screen.getByPlaceholderText(/write something/i), 'Pores');

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();
  });
});

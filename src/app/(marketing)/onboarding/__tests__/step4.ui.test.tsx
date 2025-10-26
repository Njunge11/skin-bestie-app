// UI tests for Step 4 (Allergies)
import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import Step4 from '../step4';
import { useFormContext } from 'react-hook-form';

function Step4WithProfile() {
  const { setValue } = useFormContext();
  React.useEffect(() => {
    setValue('userProfileId', 'test-profile-123');
  }, [setValue]);
  return <Step4 />;
}

describe('Step 4: Allergies - User Workflows', () => {
  it('user selects "No" for allergies and submits successfully', async () => {
    const user = userEvent.setup();
    render(<Step4WithProfile />);

    // Select "No"
    await user.click(screen.getByLabelText(/^no$/i));

    // Submit
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  it('user submits with default "No" selection', async () => {
    const user = userEvent.setup();
    render(<Step4WithProfile />);

    // "No" is selected by default (schema has .default('No'))
    const noRadio = screen.getByLabelText(/^no$/i) as HTMLInputElement;
    expect(noRadio).toBeChecked();

    // Submit without explicitly selecting (default "No" is already selected)
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Should save successfully
    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  it('user selects "Yes" and text field appears with validation', async () => {
    const user = userEvent.setup();
    render(<Step4WithProfile />);

    // Text field should not be visible initially
    expect(screen.queryByLabelText(/message/i)).not.toBeInTheDocument();

    // Select "Yes"
    await user.click(screen.getByLabelText(/^yes$/i));

    // Text field appears
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    // Submit without filling text
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Validation error for empty allergy field
    expect(await screen.findByText(/please describe your allergy/i)).toBeInTheDocument();

    // Fill in the allergy details
    const allergyTextarea = screen.getByLabelText(/message/i);
    await user.type(allergyTextarea, 'Allergic to fragrance and parabens');

    // Submit successfully
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  it('user switches from "Yes" to "No" and text field disappears', async () => {
    const user = userEvent.setup();
    render(<Step4WithProfile />);

    // Select "Yes"
    await user.click(screen.getByLabelText(/^yes$/i));
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    // Type something
    await user.type(screen.getByLabelText(/message/i), 'Some allergy');

    // Switch to "No"
    await user.click(screen.getByLabelText(/^no$/i));

    // Text field disappears
    expect(screen.queryByLabelText(/message/i)).not.toBeInTheDocument();

    // Can submit successfully
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  it('button is disabled while saving', async () => {
    const user = userEvent.setup();
    render(<Step4WithProfile />);

    await user.click(screen.getByLabelText(/^no$/i));

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).not.toBeDisabled();

    await user.click(continueButton);

    const savingButton = await screen.findByRole('button', { name: /saving/i });
    expect(savingButton).toBeDisabled();

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });
});

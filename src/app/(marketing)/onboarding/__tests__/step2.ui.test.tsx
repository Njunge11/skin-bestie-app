// UI tests for Step 2 (Skin Type)
import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import Step2 from '../step2';
import { useFormContext } from 'react-hook-form';

// Helper component to pre-fill userProfileId
function Step2WithProfile() {
  const { setValue } = useFormContext();

  // Set userProfileId on mount
  React.useEffect(() => {
    setValue('userProfileId', 'test-profile-123');
  }, [setValue]);

  return <Step2 />;
}

describe('Step 2: Skin Type - User Workflows', () => {
  it('user selects multiple skin types and saves successfully', async () => {
    const user = userEvent.setup();
    render(<Step2WithProfile />);

    // User sees skin type options
    expect(screen.getByLabelText(/dry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/oily/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/combination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sensitive/i)).toBeInTheDocument();

    // User selects Dry and Sensitive
    await user.click(screen.getByLabelText(/dry/i));
    await user.click(screen.getByLabelText(/sensitive/i));

    // User clicks continue
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees loading state
    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();

    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  it('user encounters validation error when no skin type selected and recovers', async () => {
    const user = userEvent.setup();
    render(<Step2WithProfile />);

    // User clicks continue without selecting anything
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // User sees validation error
    expect(await screen.findByText(/select at least one option/i)).toBeInTheDocument();

    // User selects a skin type
    await user.click(screen.getByLabelText(/combination/i));

    // Error should disappear (validation happens on selection)
    await waitFor(() => {
      expect(screen.queryByText(/select at least one option/i)).not.toBeInTheDocument();
    });

    // User submits successfully
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('user can select and deselect skin types', async () => {
    const user = userEvent.setup();
    render(<Step2WithProfile />);

    const dryCheckbox = screen.getByLabelText(/dry/i);
    const oilyCheckbox = screen.getByLabelText(/oily/i);

    // Initial state - not checked
    expect(dryCheckbox).not.toBeChecked();
    expect(oilyCheckbox).not.toBeChecked();

    // User selects Dry
    await user.click(dryCheckbox);
    expect(dryCheckbox).toBeChecked();

    // User selects Oily
    await user.click(oilyCheckbox);
    expect(oilyCheckbox).toBeChecked();
    expect(dryCheckbox).toBeChecked(); // Both selected

    // User deselects Dry
    await user.click(dryCheckbox);
    expect(dryCheckbox).not.toBeChecked();
    expect(oilyCheckbox).toBeChecked(); // Only Oily remains
  });

  it('user selects "I\'m Not Sure" option', async () => {
    const user = userEvent.setup();
    render(<Step2WithProfile />);

    // User selects "I'm Not Sure"
    await user.click(screen.getByLabelText(/i'm not sure/i));

    // User submits
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Should save successfully
    expect(await screen.findByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('button is disabled while saving skin type', async () => {
    const user = userEvent.setup();
    render(<Step2WithProfile />);

    await user.click(screen.getByLabelText(/dry/i));

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).not.toBeDisabled();

    await user.click(continueButton);

    const savingButton = await screen.findByRole('button', { name: /saving/i });
    expect(savingButton).toBeDisabled();
  });
});

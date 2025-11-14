"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ServerActionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a Server Action error
    const errorWithDigest = error as Error & { digest?: string };
    const isServerActionError = Boolean(
      error.message?.includes("Failed to find Server Action") ||
        error.message?.includes("Server Action") ||
        errorWithDigest.digest?.startsWith("NEXT_"),
    );

    return {
      hasError: isServerActionError,
      error: isServerActionError ? error : null,
    };
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Update Available</AlertDialogTitle>
              <AlertDialogDescription>
                We&apos;ve released a new version of the app. Please refresh to
                continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                onClick={this.handleRefresh}
                className="bg-skinbestie-primary hover:bg-skinbestie-primary/90"
              >
                Refresh Now
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    return this.props.children;
  }
}

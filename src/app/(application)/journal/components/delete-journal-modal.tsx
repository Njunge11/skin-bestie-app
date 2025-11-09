"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteJournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journalTitle: string;
  onConfirm: () => Promise<void>;
}

export function DeleteJournalModal({
  open,
  onOpenChange,
  journalTitle,
  onConfirm,
}: DeleteJournalModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onConfirm();
    // Always reset loading state after delete attempt
    // Parent handles closing modal on success, or showing error toast on failure
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Journal Entry?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{journalTitle}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-skinbestie-primary hover:bg-skinbestie-primary/90 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

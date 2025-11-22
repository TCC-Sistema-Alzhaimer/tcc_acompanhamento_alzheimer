import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function GenericModal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            position: "relative",
            textAlign: "center",
            fontWeight: 600,
            px: 6,
            py: 2.5,
          }}
        >
          {title}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              color: "grey.600",
            }}
            aria-label="Fechar"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}

      {/* Conteúdo do modal */}
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>{children}</Box>
      </DialogContent>
    </Dialog>
  );
}

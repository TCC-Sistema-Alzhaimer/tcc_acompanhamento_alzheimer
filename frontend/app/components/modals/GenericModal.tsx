import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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

export default function GenericModal({ isOpen, onClose, title, children }: ModalProps) {
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
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          color: "grey.600",
        }}
        aria-label="Fechar"
      >
        <CloseIcon />
      </IconButton>

      {title && (
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          {title}
        </DialogTitle>
      )}

      {/* Conteúdo do modal */}
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>{children}</Box>
      </DialogContent>
      <Button onClick={onClose}>Fechar</Button>
    </Dialog>
  );
}

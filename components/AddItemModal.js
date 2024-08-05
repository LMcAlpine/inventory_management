import { useState } from "react";
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";

const AddItemModal = ({ open, onClose, addItem }) => {
  const [itemName, setItemName] = useState(""); // itemName is initialized as an empty string, setItemName is a function to update the state

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="white"
        border="2px solid #0000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{ transform: "translate(-50%,-50%)" }}
      >
        <Typography variant="h6">Add Item</Typography>
        <Stack width="100%" direction="row" spacing={2}>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName);
              setItemName("");
              onClose();
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
export default AddItemModal;

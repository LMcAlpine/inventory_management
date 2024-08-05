import { Stack } from "@mui/material";
import InventoryItem from "./InventoryItem";

const InventoryList = ({ inventory, addItem, removeItem }) => (
  <Stack width="800px" height="300px" spacing={2} overflow="auto">
    {inventory.map(({ name, quantity }) => (
      <InventoryItem
        key={name}
        name={name}
        quantity={quantity}
        addItem={addItem}
        removeItem={removeItem}
      ></InventoryItem>
    ))}
  </Stack>
);

export default InventoryList;

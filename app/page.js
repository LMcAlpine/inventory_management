// Next.js directive to declare a boundary between a Server and Client Component modules
// Meaning that by defining a "use client" in a file, all other modules imported into it,
// including child components, are considered part of the client bundle

// A component is a reusable piece of UI
// "use client" marks this file and all components defined within it as Client Components
// Any components imported into this file are made into Client Components

// "use client" marks the entire file and dependencies as client-side components
// meaning that
// client-side execution: the code in this file is executed in the browser, not the server
// hydration: the component is pre-rendered on the server (if possible) and then hydrated on the client to become interactive
// browser apis: allows usage of browser specific features such as 'useState', 'useEffect' and other hooks requiring client-side execution

// A bundle is a file that contains multiple JavaScript modules combined
// "use client" affects how Next.js creates bundles
// Code marked with 'use client' (and its dependencies) are put into a client-side bundle
// This bundle is sent to the browser for execution

"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Typography, Stack, Button } from "@mui/material";
import {
  collection,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import AddItemModal from "../components/AddItemModal";
import InventoryList from "../components/InventoryList";

// Defines a functional React component named 'Home'
export default function Home() {
  // State variables
  // the brackets [] containing the state variable and function are used to destructure the array returned by the 'useState' hook
  // calling 'useState' returns an array with two elements
  // the destructuring assignment syntax unpacks the elements in the array into individual variables
  const [inventory, setInventory] = useState([]); // inventory is initialized as an empty array, setInventory is function to update the state
  const [open, setOpen] = useState(false); // open is initialized as false, setOpen is a function to update the state
  //  const [itemName, setItemName] = useState(""); // itemName is initialized as an empty string, setItemName is a function to update the state

  console.log(inventory);

  // useState is a React hook for defining state variables

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });

    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // in material UI, box is the most basic starting block
  return (
    /**this box is the whole page */
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <AddItemModal open={open} onClose={handleClose} addItem={addItem} />

      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>

      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>

        <InventoryList
          inventory={inventory}
          addItem={addItem}
          removeItem={removeItem}
        />
      </Box>
    </Box>
  );
}

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  collection,
  query,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

export const useInventory = () => {
    const [inventory, setInventory] = useState([]); // inventory is initialized as an empty array, setInventory is function to update the state



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


      return { inventory, addItem, removeItem };
}
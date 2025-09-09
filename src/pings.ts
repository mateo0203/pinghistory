import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../firebase';
import * as Location from 'expo-location';

export interface Ping {
  id: string;
  uid: string;
  message?: string;
  coords?: {
    lat: number;
    lng: number;
  };
  createdAt: any;
}

/**
 * Creates a new ping with optional message and location data
 * @param uid - User ID from Firebase Auth
 * @param message - Optional message to include with the ping
 * @returns Promise that resolves when ping is created
 */
export const createPing = async (uid: string, message?: string): Promise<void> => {
  try {
    
    let coords: { lat: number; lng: number } | undefined;
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        coords = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
      }
    } catch (locationError) {
      console.warn('Location failed:', locationError);
    }

    const pingData = {
      uid,
      message: message || null,
      coords: coords || null,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'pings'), pingData);
    
  } catch (error) {
    console.error('Error creating ping:', error);
    throw error;
  }
};

/**
 * Listens to the pings collection and calls callback with updates
 * @param callback - Function to call with array of pings
 * @returns Unsubscribe function to stop listening
 */
export const listenPings = (callback: (pings: Ping[]) => void): Unsubscribe => {
  const q = query(
    collection(db, 'pings'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const pings: Ping[] = [];
      snapshot.forEach((doc) => {
        pings.push({
          id: doc.id,
          ...doc.data(),
        } as Ping);
      });
      callback(pings);
    },
    (error) => {
      console.error('Error listening to pings:', error);
    }
  );
};

import {create} from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '@/constants/api';


// Zustand Store
export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    loading: false,
  
    register: async ({ username, email, password }) => {
      set({ loading: true });
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });
  
        const data = await res.json();
  
        console.log(data, "data");
  
        if (!res.ok) throw new Error(data.message || "Something went wrong");
  
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token);
  
        set({ user: data.user, token: data.token, loading: false });
  
        return { success: true, data };
      } catch (error) {
        set({ loading: false });
        return { success: false, message: error.message };
      }
    },

    login : async ({email , password}) => {
      set({loading : true})

      try {
       const response =  await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Something went wrong");

        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token);

      } catch (error) {
        set({ loading: false });
        return { success: false, message: error.message
        };
      }
    },

    checkAuth : async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userJson = await AsyncStorage.getItem("user");
        const user =userJson ? JSON.parse(userJson) : null;
        set({ token, user });
      } catch (error) {
        console.log("Auth check failed" , error);
      }
    },

    logOut : async () => {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null });
    },
   
  }));
  
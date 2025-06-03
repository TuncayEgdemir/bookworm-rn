import { useAuthStore } from "@/store/authStore";
import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {

  const {user , token , checkAuth , logOut} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <View
      style={styles.container}
    > 
      <Text style={styles.text}>Hello {user?.username}</Text>
      <Text style={styles.text}>Token {token}</Text>

      <TouchableOpacity onPress={logOut}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <Link href='/(auth)/signup'>Sign Up Page</Link>
      <Link href='/(auth)'>Login Page</Link>
    </View>
  );
}


const styles = StyleSheet.create({ 

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 22,
  },

 });

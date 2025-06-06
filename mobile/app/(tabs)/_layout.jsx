import { StyleSheet, Text, View } from 'react-native'
import {Tabs} from "expo-router"
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import COLORS from "@/constants/colors";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabLayout = () => {

  const insets = useSafeAreaInsets();

  return (
    <Tabs screenOptions={{
     headerShown: false  ,
     tabBarActiveTintColor : COLORS.primary,
     headerTitleStyle : { 
      color : COLORS.textPrimary,
      fontWeight : "600",
     },
     headerShadowVisible : false,
     tabBarStyle : {
      backgroundColor : COLORS.white,
      borderTopWidth : 1,
      borderTopColor : COLORS.border,
      paddingTop  :5 ,
      paddingBottom : insets.bottom,
      height : 60 + insets.bottom,
    }

     }}>
        <Tabs.Screen name="index"  
            options={{
                title : "Home",
                tabBarIcon : ({color , size}) => (<Ionicons 
                    name='home-outline'
                    size={size}
                    color={color}
                  />),
                
            }}
        />
        <Tabs.Screen name="create"  options={{
                title : "Create",
                tabBarIcon : ({color , size}) => (<Ionicons 
                    name='add-circle-outline'
                    size={size}
                    color={color}
                  />),
                
            }}/>
        <Tabs.Screen name="profile"options={{
                title : "Profile",
                tabBarIcon : ({color , size}) => (<Ionicons 
                    name='person-outline'
                    size={size}
                    color={color}
                  />),
                
            }} />
    </Tabs>
  )
}

export default TabLayout

const styles = StyleSheet.create({})
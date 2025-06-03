import { ActivityIndicator, Alert, Button, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../../assets/styles/login.styles'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '@/constants/colors'
import { Link, useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'

const Login = () => {

  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [showPassword , setShowPassword] = useState(false);

  const router = useRouter();

  const {user , loading , login} = useAuthStore();

  const handleLogin = async() => {
   const result = await login({email , password});
    if(!result.success)Alert.alert('Error' , result.message);
  }



  return (
    <KeyboardAvoidingView style={{flex:  1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

    <View style={styles.container}>
        <View style={styles.topIllustration}>
            <Image source={require("../../assets/images/1.png")} style={styles.illustrationImage} resizeMode='contain' />
        </View>

        <View style={styles.card}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
             <Ionicons name='mail-outline' size={20} color={COLORS.primary} style={styles.inputIcon} />
             <TextInput style={styles.input} placeholder='Enter your email' placeholderTextColor={COLORS.placeholderText} value={email} onChangeText={setEmail} keyboardType='email-address' autoCapitalize='none'/>
              
            </View>

            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
             <Ionicons name='lock-closed' size={20} color={COLORS.primary} style={styles.inputIcon} />
             <TextInput style={styles.input} placeholder='Enter your password' placeholderTextColor={COLORS.placeholderText} value={password} onChangeText={setPassword} secureTextEntry={!showPassword}/>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color={COLORS.primary} style={styles.inputIcon} />
              </TouchableOpacity>
            </View>

            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
            </View>


          </View>
        </View>
        </View>
    </KeyboardAvoidingView>

  )
}

export default Login

import { Alert, KeyboardAvoidingView, Platform, ScrollView, Image, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import styles from "../../assets/styles/create.styles"
import Ionicons from 'react-native-vector-icons/Ionicons'
import COLORS from '../../constants/colors'
import * as ImagePicker from 'expo-image-picker'
import { useAuthStore } from '../../store/authStore'
import { API_URL } from '@/constants/api';

import * as FileSystem from 'expo-file-system'
const Create = () => {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)
  const [rating, setRating] = useState(3)
  const [loading, setLoading] = useState(false)
  const [imageBase64, setImageBase64] = useState(null)

  const router = useRouter()

  const {token} = useAuthStore();
  

  const pickImage = async () => {
    try {
        if(Platform.OS !== "web") {
          const {status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          console.log(status)
          if(status  !== "granted") {
            Alert.alert("Sorry, we need camera roll permissions to make this work!");
            return;
          }
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes : "images",
          allowsEditing : true,
          aspect : [4,3],
          quality : 0.5,
          base64 : true
        });


        if(!result.canceled) {
          setImage(result.assets[0].uri)

          if(result.assets[0].base64) {
            setImageBase64(result.assets[0].base64)
          }else {
             const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
              encoding : FileSystem.EncodingType.Base64
            });
            setImageBase64(base64)
          }
        }
    } catch (error) {
        console.log(error)
        Alert.alert("An error occurred while picking the image.")
    }
  }
  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Please fill in all fields");
      return;
    }
  
    try {
      setLoading(true);
  
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
  
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;
  
      console.log(imageDataUrl.slice(0, 100), "Preview imageDataUrl");
  
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          image: imageDataUrl, // ✅ gerçek base64 verisi buraya
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        Alert.alert("Error", data.error || "Something went wrong");
        setLoading(false);
        return;
      }
  
      Alert.alert("Success", "Book recommendation created!");
      router.push("/"); // yönlendirme yapıyorsan
    } catch (error) {
      console.log("Submit Error:", error);
      Alert.alert("Error", "An error occurred while creating the book recommendation");
    } finally {
      setLoading(false);
    }
  };
  

  const renderRatingPicker = () => {
      const ratingArray = []

      for (let i = 1; i <= 5; i++) {
          ratingArray.push(
            <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.ratingButton}>
              <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={32} color={i <= rating ? "#f4b400" : COLORS.textSecondary} />
            </TouchableOpacity>
          )
      }

      return <View style={styles.ratingContainer}>{ratingArray}</View>
  }
  return (
    <KeyboardAvoidingView
      style = {{flex : 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
          <View style={styles.card}>
              <View style={styles.header}>
                  <Text style={styles.title}>Add Book Recommendation</Text>
                  <Text style={styles.subtitle}>Share your favorite reads with others</Text>
              </View>
              <View style={styles.form}>
                  <View style={styles.formGroup}>
                      <Text style={styles.label}>Book Title</Text>

                      <View style={styles.inputContainer}>
                          <Ionicons name='book-outline' size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                          <TextInput
                              style={styles.input}
                              placeholder='Enter book title'
                              value={title}
                              onChangeText={setTitle}
                              placeholderTextColor={COLORS.placeholderText}
                          />
                      </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Your Rating</Text>
                    {renderRatingPicker()}
                  </View>

                  <View style={styles.formGroup}>
                      <Text style={styles.label}>Book Cover Image</Text>
                      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                          {image ? (
                              <Image source={{ uri: image }} style={styles.previewImage} />
                          ) : (
                              <View style={styles.placeholderContainer}>
                                <Ionicons name='image-outline' size={24} color={COLORS.textSecondary} />
                                <Text style={styles.placeholderText}>Tap to select image</Text>

                              </View>
                          )}
                          <Ionicons name='camera-outline' size={24} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                  </View>

                  <View style={styles.formGroup}> 
                            <Text style={styles.label}>Caption</Text>
                            <TextInput 
                            style = {styles.textArea}
                            placeholder='Write a short caption about the book'
                            value={caption}
                            onChangeText={setCaption}
                            multiline
                            />

                  </View>

                  <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                         {loading ?   (
                            <ActivityIndicator color={COLORS.white} size={24} />
                         ) : (
                          <>
                            <Ionicons 
                              name='cloud-upload-outline'
                              size={20}
                              color={COLORS.white}
                              style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>Share </Text>
                          </>
                         )} 
                  </TouchableOpacity>
              </View>
          </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Create

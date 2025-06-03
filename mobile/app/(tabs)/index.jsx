import { FlatList, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useAuthStore } from "../../store/authStore"
import styles from '../../assets/styles/home.styles'
import { API_URL } from '../../constants/api'
import { Image } from "expo-image"
import Ionicons from 'react-native-vector-icons/Ionicons'
import COLORS from '../../constants/colors'

const Home = () => {
  
  const {token , logOut} = useAuthStore();  
  const [books , setBooks] = useState([]);
  console.log("Kitaplar : " , books);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore , setHasMore] = useState(true);

  

  const fetchBook = async (pageNum = 1 , refresh = false) => { 
        if(refresh) setRefreshing(true);
        else if (pageNum === 1 ) setLoading(true);
        try { 

          const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
              headers : {
                Authorization: `Bearer ${token}`
              },
              
          })

          const data = await response.json();


          if(!response.ok) {
            throw new Error('Failed to fetch books');
          }
          setBooks((prevBooks) => [...prevBooks, ...data.books]);
          
          setHasMore(pageNum < data.totalPages);
          setPage(pageNum);
          
        } catch (error) {
          console.error(error);
        }finally{
            if(refresh) setRefreshing(false);
            else setLoading(false);
        }
  }


  const renderRatingPicker = (rating) => {
    const ratingArray = []

    for (let i = 1; i <= 5; i++) {
        ratingArray.push(
            <Ionicons key={i} name={i <= rating ? 'star' : 'star-outline'} size={16} style={{marginRight : 2}} color={i <= rating ? "#f4b400" : COLORS.textSecondary}  />
        )
    }

    return <View style={styles.ratingContainer}>{ratingArray}</View>
}

  useEffect(() => {
    fetchBook();
  }, []);

  const handleMore = () => {
    if(!loading && hasMore){
      setPage(page + 1);
      fetchBook(page + 1);
    }
  }

  const renderItem = ({item}) => {
    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
              <Text style={styles.username}>
                  {item.user.username}
              </Text>
          </View>
      </View>


          <View style={styles.bookImageContainer}>
            <Image source={item.image} style ={styles.bookImage} contentFit= "cover" />
          </View>

          <View style={styles.bookDetails}>
              <Text style={styles.bookTitle}>
                {item.title}
              </Text>
              <View style={styles.ratingContainer}>
                {renderRatingPicker(item.rating)}
              </View>
          </View>
        </View>
    )
  }

  return (
    <View  style={styles.container}>
      <FlatList
        data = {books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default Home

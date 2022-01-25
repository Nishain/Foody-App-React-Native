import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../assets/food.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height : undefined,
    aspectRatio:0.8,
    marginBottom: 8,
  },
})
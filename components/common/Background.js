import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView,View } from 'react-native'
import theme from '../common/theme'
const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.surface,
    },
    container: {
      flex: 1,
      padding: 20,
      width: '100%',
    //   maxWidth: "100%",
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
export default function Background({children}) {
  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
        <View style={styles.container}>{children}</View>
    {/* <KeyboardAvoidingView style={styles.container} behavior="padding">
        {children}
      </KeyboardAvoidingView> */}
    </ImageBackground>
  )
}


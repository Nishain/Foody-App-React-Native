import React from 'react'
import { View, StyleSheet, Text,TextInput as NativeInput } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { useState } from 'react/cjs/react.development'
import theme from './theme'

export default function TextInput({ errorText, description, ...props }) {
  const [isFocused,setIsFocused] = useState(false)
    return (
      <View style={{...props.containerStyle,...styles.container}}>
        {description && !errorText ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        {/* <Input
          
          style={{...styles.input,...props.inputStyle}}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          
          mode="outlined"
          {...props}
        /> */}
        <NativeInput  style={{...styles.input2,...props.inputStyle,borderColor : isFocused ? theme.colors.primary : theme.colors.secondary}} 
        
        onFocus={()=>setIsFocused(true)}
        onBlur={()=>setIsFocused(false)}
        {...props} />
        
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      </View>
    )
  }
const styles = StyleSheet.create({
    container: {
      // width: '100%',
      marginVertical: 12,
    },
    input: {
      backgroundColor: '#fff',
      
    },  
    input2: {
      backgroundColor: '#fff',
      borderWidth : 2,
      borderColor : theme.colors.primary,
      borderRadius : 5,
      paddingHorizontal : 10
    },
    description: {
      fontSize: 13,
      color: theme.colors.secondary,
      paddingBottom: 8,
    },
    error: {
      fontSize: 13,
      color: theme.colors.error,
      paddingTop: 8,
    },
  })
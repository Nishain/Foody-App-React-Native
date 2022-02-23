import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput as NativeInput } from 'react-native'
import theme from './theme'

export default function TextInput({ errorText, description, children, ...props }) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <View style={{ ...props.containerStyle, ...styles.container }}>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {/* <Input
          
          style={{...styles.input,...props.inputStyle}}
          selectionColor={theme.colors.primary}
          underlineColor="transparent"
          
          mode="outlined"
          {...props}
        /> */}
      <View style={{flexDirection : 'row'}}>
        <NativeInput style={{ ...styles.input2, ...props.inputStyle, borderColor: isFocused ? theme.colors.primary : theme.colors.secondary }}
          {...props.innerRef ? { ref: props.innerRef } : null}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props} />
        {children}
      </View>
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
    width : '100%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10
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
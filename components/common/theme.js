import { DefaultTheme } from 'react-native-paper'
const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: '#000000',
      primary: '#560CCE',
      secondary: '#414757',
      error: '#f13a59',
    },
    headerStyle: {
      alignSelf: 'center',
      fontSize: 29,
      color: '#560CCE',//primary color
      fontWeight: 'bold',
      paddingVertical: 12,
  }
}
export default theme
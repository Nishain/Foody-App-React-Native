import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Switch, Text } from 'react-native'
import Background from './common/Background'
import Logo from './common/logo'
import TextInput from './common/TextInput'
import auth from '@react-native-firebase/auth';
import theme from './common/theme'
import CustomSnackBar from './common/CustomSnackBar'
import database from '@react-native-firebase/database'
import CustomButton from './common/CustomButton'
import UserRoleContext from './contexts/UserRoleContext'
import { useContext } from 'react/cjs/react.development'

const EMAIL = 'email', PASSWORD = 'password', CONFIRM_PASSWORD = 'confirmPassword'
export default function LoginScreen({ navigation }) {
    const reference = database().ref('/user/')
    const [inputFields, setInputFields] = useState({
        email: {}, password: {}, confirmPassword: {}, isAdmin: false
    })
    const [snackbarMessage, setSnackbarMessage] = useState(null)
    const [authMode, setAuthMode] = useState('login')
    const userRoleContext = useContext(UserRoleContext)
    const signUp = async () => {
        if (validate())
            return
        if (get(PASSWORD) != get(CONFIRM_PASSWORD)) {
            setInputFields({
                ...inputFields,
                password: { error: 'password not matched confirmed password' },
                confirmPassword: { error: 'confirm password not matched password' },
            })
            return
        }
        try {
            const newUser =  await auth().createUserWithEmailAndPassword(get(EMAIL), get(PASSWORD))
            reference.child(newUser.user.uid).set({isAdmin : inputFields.isAdmin},()=>{
                userRoleContext.setIsAdmin(inputFields.isAdmin)
                navigation.replace('home') 
                // setSnackbarMessage('successfully created an account')
            })
            
        } catch (error) {
            handleError(error)
        }
        // userCredentials.user.
    }
    const requestForgetPassword = async () => {
        const emailAddress = (get(EMAIL) || '')
        if (emailAddress == '') {
            setInputFields({ ...inputFields, 'email': { error: 'You should at least provide an email address' } })
            return
        }
        try {
            await auth().sendPasswordResetEmail(emailAddress)
            setSnackbarMessage(`password reset link successfully sent to ${emailAddress}`)
        } catch (error) {
            handleError(error)
        }
    }
    const get = (key) => inputFields[key].value
    const login = async () => {
        if (validate())
            return
        try {
            const user = await auth().signInWithEmailAndPassword(get(EMAIL), get(PASSWORD))
            
            reference.child(user.user.uid).once('value',(snapshot)=>{
                userRoleContext.setIsAdmin(snapshot.val().isAdmin)
                navigation.replace('home') 
                
            })
            // setSnackbarMessage('login successful!')
        } catch (error) {
            handleError(error)
        }
    }
    const handleError = (error) => {
        if (!(error.code && error.code.startsWith('auth')))
            throw error //another sort of error thrown
        var message = ''
        switch (error.code) {
            case 'auth/invalid-email':
                message = 'Please enter a valid email'
                break
            case 'auth/user-disabled':
                message = 'Sorry your account is banned'
                break
            case 'auth/user-not-found':
                message = 'no such user found with given email'
                break
            case 'auth/wrong-password':
                message = 'incorrect credentials'
                break
            case 'auth/weak-password':
                message = 'Your password is too weak!. Enter stronger password'
                break
            case 'auth/email-already-in-use':
                message = 'Sorry already such user exists'
                break
            default:
                message = 'Sorry unknown error has occured'
        }
        if (message.length > 0)
            setSnackbarMessage(message)
    }
    const changeAuthMode = () => {
        setAuthMode(authMode == 'login' ? 'signup' : 'login')
    }
    function validate() {
        const validatingFields = authMode == 'login' ? [EMAIL, PASSWORD] : [EMAIL, PASSWORD, CONFIRM_PASSWORD]
        var validateError = false
        var newValue = { ...inputFields }
        for (const field of validatingFields) {
            if ((inputFields[field].value || '') == '') {
                newValue[field] = { 'error': `${field} should not be empty` }
                validateError = true
            }
        }
        if (validateError)
            setInputFields(newValue)
        return validateError
    }
    const primaryAction = () => {
        (authMode == 'signup' ? signUp : login)()
    }

    const changeInputText = (fieldLabel, value) => {
        setInputFields({ ...inputFields, [fieldLabel]: { 'value': value } })
    }
    return (
        <Background>
            <Logo />
            <View style={styles.card}>
                <Text style={styles.header}>Welcome</Text>
                <TextInput
                    description="Email"
                    returnKeyType="next"
                    // value={email.value}
                    onChangeText={(text) => changeInputText(EMAIL, text)}
                    error={inputFields.email.error}
                    errorText={inputFields.email.error || ''}
                    autoCapitalize="none"
                    autoCompleteType="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                />
                <TextInput
                    description="Password"
                    returnKeyType={authMode == "login" ? "done" : "next"}
                    // value={password.value}
                    onChangeText={(text) => changeInputText(PASSWORD, text)}
                    error={inputFields.password.error}
                    errorText={inputFields.password.error || ''}
                    secureTextEntry
                />
                {authMode == 'signup' && <><TextInput
                    description="ConfirmPassword"
                    returnKeyType="done"
                    // value={confirmPassword.value}
                    onChangeText={(text) => changeInputText(CONFIRM_PASSWORD, text)}
                    error={inputFields.confirmPassword.error}
                    errorText={inputFields.confirmPassword.error || ''}
                    secureTextEntry
                />
                    <View style={styles.row}>
                        <Text style={styles.secondaryText}>Register as Admin ?</Text>

                        <Switch value={inputFields.isAdmin} onValueChange={(value)=>{setInputFields({...inputFields,isAdmin : value})}}/>
                    </View>
                </>}

                <View style={styles.forgotPassword}>
                    <TouchableOpacity
                        onPress={requestForgetPassword}
                    >
                        <Text style={styles.secondaryText}>Forgot your password?</Text>
                    </TouchableOpacity>
                </View>
                <CustomButton mode="contained" title={authMode == 'login' ? 'Login' : 'Sign Up'} onPress={primaryAction} />
                <View style={styles.row}>
                    <Text>{authMode == 'signup' ? 'Already have an account?' : 'Don’t have an account?'} </Text>
                    <TouchableOpacity onPress={changeAuthMode}>
                        <Text style={styles.link}>{authMode == 'login' ? 'Sign up' : 'Sign in'}</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <CustomSnackBar setMessage={setSnackbarMessage} message={snackbarMessage} />
        </Background>
    )

}

const styles = StyleSheet.create({
    header: {
        alignSelf: 'center',
        fontSize: 29,
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 12,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
    },
    secondaryText: {
        fontWeight: 'bold',
        fontSize: 13,
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    card: { backgroundColor: '#fff', elevation: 3, borderRadius: 7, width: '100%', padding: 15 }
})


import React, {Component} from 'react'
import {
    View,
    KeyboardAvoidingView,
    StyleSheet,
    AsyncStorage,
    TouchableHighlight,
    Text,
    Alert,
    Button
} from 'react-native'
import AuthService from '../../../../services/authService'
import Header from '../../../../components/header'
import Colors from '../../../../config/colors'
import Auth from './../../../../util/auth'
import resetNavigation from './../../../../util/resetNavigation'
import TextInput from './../../../../components/textInput'

export default class AmountEntry extends Component {
    static navigationOptions = {
        title: 'Verify with two factor auth app',
    }

    constructor(props) {
        super(props)
        this.state = {
            token: ''
        }
    }

    verify = async () => {
        let responseJson = await AuthService.authMfa({code: this.state.token})
        if (responseJson.status === "success") {
            if (this.props.navigation.state.params.isTwoFactor) {
                await AsyncStorage.removeItem("token")
                Auth.login(this.props.navigation, this.props.navigation.state.params.loginInfo)
            } else {
                await resetNavigation.dispatchUnderTwoFactor(this.props.navigation)
            }
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Verify with mfa app"
                />
                <KeyboardAvoidingView style={styles.mainContainer} behavior={'padding'}>
                    <View style={{flex: 1}}>
                        <TextInput
                            title="Enter the OTP"
                            placeholder="OTP"
                            autoCapitalize="none"
                            keyboardType="numeric"
                            underlineColorAndroid="white"
                            onChangeText={(token) => this.setState({token})}
                        />
                    </View>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => this.verify()}>
                        <Text style={{color: 'white', fontSize: 20}}>
                            Verify
                        </Text>
                    </TouchableHighlight>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop:10,
    },
    textInputContainer: {
        paddingVertical: 16
    },
    textInput: {
        padding: 8,
        backgroundColor: 'white'
    },
    VerifyButton: {
        backgroundColor: Colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        borderRadius: 4,
        height: 50
    },
    buttonColor: {
        fontSize: 18,
        color: 'white'
    },
    submit: {
        marginBottom: 10,
        marginHorizontal: 20,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
    },
})


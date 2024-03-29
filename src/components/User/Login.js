import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Touchable, ActivityIndicator, Button, ImageBackground, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import API, { authApi, endpoints } from "../../configs/API";
import MyContext from "../../configs/MyContext";
import MyStyles from "../../styles/MyStyles";
import Style from "./Style";
import InputField from "../Inputs/InputField";
import { COLOR, backgroundImage } from "../../constants";
import moment from "moment";


const Login = ({navigation}) => {
    const [username, setUsername] = useState('nurse1');
    const [password, setPassword] = useState('123');
    const [loading, setLoading] = useState(false);
    const [user, dispatch] = useContext(MyContext);
    
    const handleRegister = () => {
        navigation.navigate('Register');
      };

    const login = async () => {
        setLoading(true);

        last_login = moment().format('YYYY-MM-DD HH:mm:ss')
        try {
            let res = await API.post(endpoints['login'], {
                "username": username, 
                "password": password,
                // "client_id": "tdBEzfTaLmHuVhjYG1GrufOpe3wU5e3tzpZT1UZl",
                // "client_secret": "OrxshyKZIFWR366hHu6BdwCmwBSCCqzIGNVpoPagT3miVab2yw3MpX2kZaTWEDqbKcLZUa8ydBES1jTAK0SXx9yyekIxU1yOz39vshuY5E0n8hRVj4G2BBUHBRHVpYGZ",
                "grant_type": "password",
            });
                await AsyncStorage.setItem("access-token", res.data.access_token)
                let user = await authApi(res.data.access_token).get(endpoints['current-user']);
                dispatch({
                    type: "login",
                    payload: user.data
                });
                form = new FormData()
                form.append('last_login', last_login)
                await authApi(res.data.access_token).patch(endpoints['update'](user.data.id), form, {headers: {'Content-Type': 'multipart/form-data'}})
                navigation.navigate.replace('Home');
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                Alert.alert('Error', 'Username or password is incorrect');
            }
        } finally {
            setLoading(false);
        }
    }
    const [hidden, setHidden] = React.useState(true)
    return (
        <View style={[MyStyles.container, {margin: 0}]}>
            <ImageBackground source={require('../../assets/images/appBG.jpg')} style={[MyStyles.container,{width: '100%', height: '100%', margin: 0}]} resizeMode="cover">

                <Text style={MyStyles.subject}>LOGIN</Text>

                <InputField label="Username" style={[{width: 300}]} value={username} placeholder="user123" icon="user" onChangeText={t => setUsername(t)}/>
                <InputField label="Password" style={[{width: 300}]} value={password} placeholder="pass" icon="eye" onChangeText={t => setPassword(t)} secureEntry={hidden} OnPressIncon={t => setHidden(!hidden)}/>

                {loading===true?<ActivityIndicator />:<>
                    <TouchableOpacity style={MyStyles.button} onPress={login}>
                        <Text style={MyStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </>}


            <TouchableOpacity onPress={handleRegister}>
            <Text>If you don't have an account, register here.</Text>
            </TouchableOpacity>
            </ImageBackground>
            
        </View>
    );
}

export default Login;
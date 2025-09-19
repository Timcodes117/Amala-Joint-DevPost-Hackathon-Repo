import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import Constants from 'expo-constants'
import { color_scheme } from '../../utils/constants/app_constants'
import BackButton from '../../components/buttons/back_button'
import { global_style } from '../../utils/stylesheets/general_style'
import { onboarding_sheet } from '../../utils/stylesheets/onboarding_sheet'
import { input_style } from '../../utils/stylesheets/input_style'
import CircularInputField from '../../components/auth_screens/input_field'
import { router } from 'expo-router'
import Checkbox from '../../components/auth_screens/checkbox'
import WideButton from '../../components/auth_screens/wideButton'
import { useAuth } from '../../contexts/auth'

const LoginPage = () => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { signInWithGoogle, signInWithEmail, isLoading } = useAuth();

    const handleEmailLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!isChecked) {
            Alert.alert('Error', 'Please accept the terms and conditions');
            return;
        }

        setIsSubmitting(true);
        const result = await signInWithEmail({ email, password });
        setIsSubmitting(false);

        if (!result.success) {
            Alert.alert('Login Failed', result.error || 'Please try again');
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: color_scheme.light }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: Constants.statusBarHeight,
                    padding: 24,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: color_scheme.light
                }}>
                <View style={{
                    display: "flex", flexDirection: "row", paddingTop: 20,
                    justifyContent: "flex-start", width: "100%"
                }}>

                    <BackButton onTap={() => router.back()} />
                </View>

                <View style={[global_style.centered, { display: "flex", flexDirection: "column", gap: 20, width: "100%" }]}>
                    <Text style={onboarding_sheet.title}>Login to Account</Text>
                    <Text style={onboarding_sheet.subtitle}>Login to access the sweetest Amala near you!</Text>
                </View>

                <TouchableOpacity 
                    style={[
                        input_style.input_container, 
                        global_style.centered, 
                        { 
                            flexDirection: "row", 
                            gap: 10, 
                            alignItems: "center", 
                            borderRadius: 50, 
                            marginTop: 30, 
                            marginBottom: 30,
                            opacity: isLoading ? 0.7 : 1
                        }
                    ]}
                    onPress={signInWithGoogle}
                    disabled={isLoading}
                >
                    <Image source={require("../../assets/images/google.png")} style={{ height: 24, width: 24 }} />
                    {isLoading ? (
                        <ActivityIndicator size="small" color={color_scheme.dark} />
                    ) : (
                        <Text style={[onboarding_sheet.title, { fontSize: 14 }]}>Sign in with Google</Text>
                    )}
                </TouchableOpacity>


                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={global_style.ver_line} />
                    <Text style={global_style.text}>or</Text>
                    <View style={global_style.ver_line} />
                </View>

                <View style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
                    <View style={{ width: "100%", flexDirection: "column", gap: 10, }}>
                        <Text style={global_style.text}>Email Address</Text>
                        <CircularInputField 
                            placeHolder='Enter your Email Address' 
                            type='email' 
                            value={email}
                            onChange={setEmail}
                        />
                    </View>
                    <View style={{ width: "100%", flexDirection: "column", gap: 10, }}>
                        <Text style={global_style.text}>Password</Text>
                        <CircularInputField 
                            placeHolder='Enter your Password' 
                            type='password' 
                            value={password}
                            onChange={setPassword}
                            showPasswordToggle={true}
                        />
                    </View>

                    <Checkbox isChecked={isChecked} onChange={() => setIsChecked(!isChecked)} />

                    <WideButton 
                        onTap={handleEmailLogin} 
                        type='fill' 
                        fillColor={color_scheme.button_color}
                        disabled={isSubmitting || isLoading}
                        loading={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </WideButton>
                    <Text style={[global_style.text, { color: color_scheme.link_color, textAlign: "center" }]}>Don’t have an Account?</Text>
                    <TouchableOpacity style={global_style.centered} onPress={() => router.push("(auth)/signup")}>
                        <Text style={[global_style.text, { color: color_scheme.dark, textAlign: "center", textDecorationLine: "underline" }]}>Sign up</Text>
                    </TouchableOpacity>


                </View>


            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default LoginPage
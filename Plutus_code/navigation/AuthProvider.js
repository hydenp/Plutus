/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await auth().signInWithEmailAndPassword(email, password);
                    } catch (err) {
                        console.log(err);
                        // console.log(password);
                        if(email === undefined){
                            alert('Please enter a valid email');
                        }else{
                            alert('Wrong password.');
                        }
                    }
                },
                register: async (email, password) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password);
                    } catch (err) {
                        console.log(err);
                        if (email === undefined){
                            alert('Please enter a valid email');
                        }
                        else {
                            alert('Invalid password.');
                        }
                    }
                },
                logout: async () => {
                    try {
                        await auth().signOut();
                    } catch (err){
                        console.log(err);
                    }
                },
            }}>
            {children}
        </AuthContext.Provider>
    );
};

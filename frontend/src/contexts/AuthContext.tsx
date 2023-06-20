"use client"
import { createContext, ReactNode, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { setCookie, parseCookies, destroyCookie } from "nookies";

import api from '@/services/api';

interface AuthProviderProps {
    children: ReactNode
}

interface SignInData {
    email: string,
    password: string
}

interface User {
    id: number,
    name: string,
    email: string,
    whatsapp: string,
    role: string | undefined
}

interface AuthContextType {
    isAuthenticaded: boolean,
    user: User | null,
    signIn: (data: SignInData) => Promise<{
        status: number,
        statusText: string
    }>,
    signOut: () => Promise<void>,
    loading: boolean
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
    const [ user, setUser ] = useState<User | null>(null);
    const [ loading, setLoading ] = useState(true);
    const router = useRouter();


    const isAuthenticaded = !!user;

    useEffect(() => {
        const { 'epcakes.token': token } = parseCookies();

        if(token){
            api.get('sessions').then(response => {
                const user = response.data.user;

                setUser({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    whatsapp: user.whatsapp,
                    role: user.role
                })

                setLoading(false);
            });
        } else
            setLoading(false);
    }, []);

    const signIn = async ({ email, password }: SignInData) => {
        let status = 200;
        let statusText = 'OK';

        await api.post('sessions', {
            email,
            password
        }).then((res)=>{
            const { token, user } = res.data;

            setCookie(undefined, 'epcakes.token', token, {
                maxAge: 60 * 60 * 24, // 1 dia
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            setUser(user);

            router.push('/');
        }).catch(e => {
            status = e.response.status;
            statusText = e.response.statusText;
        });

        return {
            status,
            statusText
        }
    }

    const signOut = async () => {
        await api.delete('sessions');

        destroyCookie(undefined, 'epcakes.token');
        setUser(null);
        
        api.defaults.headers['Authorization'] = null;

        router.push('/');
    }

    return (
        <AuthContext.Provider value={{ isAuthenticaded, user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
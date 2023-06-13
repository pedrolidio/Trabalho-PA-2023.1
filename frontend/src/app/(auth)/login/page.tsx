'use client'
import { useState, useContext } from 'react';
import Link from 'next/link';
import { FiUserPlus } from 'react-icons/fi';

import { AuthContext } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Login - Eliane Perrut ♡ Sweet Cake',
}

export interface UserAuth {
  email: string,
  password: string
}

export default function Login() {
  const { signIn } = useContext(AuthContext);

  const [ user, setUser ] = useState<UserAuth>({
    email: '',
    password: ''
  });
  const [ noUserFound, setNoUserFound ] = useState(false);
  const [ invalidCredentials, setInvalidCredentials ] = useState(false);
  

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { status, statusText } = await signIn(user);

    if (status == 400){
      setNoUserFound(true);
      setInvalidCredentials(false);
    }

    if(status == 401) {
      setNoUserFound(false);
      setInvalidCredentials(true);
    }

    if(status != 200)
    {
      if(status != 400 && status != 401)
        alert(`Error ${status}: ${statusText}`)
      return;
    }
  }

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h1>Fazer login</h1>

      <label>E-mail</label>
      <input 
        required
        type="email" 
        placeholder="Insira o seu e-mail"
        value={user.email}
        onChange={e => setUser({...user, email: e.target.value})}
      />

      <label>Senha</label>
      <input 
        required
        type="password" 
        placeholder="Insira a sua senha"
        value={user.password}
        onChange={e => setUser({...user, password: e.target.value})}
      />
      {
        noUserFound ? (
          <label className="error-label">
            * Usuário não encontrado!
          </label>
        ) : (
          null
        )
      }
      {
        invalidCredentials ? (
          <label className="error-label">
            * Credenciais inválidas!
          </label>
        ) : (
          null
        )
      }
      
      <button 
        type="submit" 
        className="button"
      >
        Entrar
      </button>

      <Link href="/register" className="link">
        <FiUserPlus size={16} color="#F48192"/>
        Faça seu cadastro
      </Link>
    </form>
  )
}

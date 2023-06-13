'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLogIn } from 'react-icons/fi';
import InputMask from 'react-input-mask';

import api from '@/services/api';

export const metadata = {
  title: 'Cadastro - Eliane Perrut ♡ Sweet Cake',
}

interface UserRegister {
  name: string,
  email: string,
  whatsapp: string,
  password: string,
  passwordConfirmation: string
}

export default function Register() {
  const router = useRouter();

  const [ user, setUser ] = useState<UserRegister>({
    name: "",
    email: "",
    whatsapp: "",
    password: "",
    passwordConfirmation: ""
  })
  const [ repeatedEmail, setRepeatedEmail ] = useState(false);
  const [ differentPasswords, setDifferentPasswords ] = useState(false);
  

  const checkEmail = async () => {
    const response = await api.post('check/email', { email: user.email });

    if(!response.data.available) {
      setRepeatedEmail(true);
      return false;
    }
      
    else {
      setRepeatedEmail(false);
      return true;
    }
  }

  const checkPasswords = () => {
    if(user.password != user.passwordConfirmation) {
      setDifferentPasswords(true);
      return false;
    }
    else {
      setDifferentPasswords(false);
      return true;
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validPasswords = checkPasswords();
    const validEmail = await checkEmail();

    if(!validPasswords || !validEmail)
      return;

    api.post('users', user);
    alert("Cadastro efetuado com sucesso!");
    router.push('/login');
  }

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h1>Criar conta</h1>

      <label>Nome</label>
      <input 
        required 
        placeholder="Insira o seu nome"
        value={user.name}
        onChange={e => setUser({ ...user, name: e.target.value })}
      />
    
      <label>E-mail</label>
      <input 
        required 
        type="email" 
        placeholder="Insira o seu e-mail"
        value={user.email}
        onChange={e => setUser({ ...user, email: e.target.value })}
        onBlur={checkEmail}
      />
      {
        repeatedEmail ? (
          <label className="error-label">
            * Este e-mail já está sendo utilizado!
          </label>
        ) : (
          null
        )
      }
    
      <label>Senha</label>
      <input 
        required 
        type="password" 
        placeholder="Insira a sua senha"
        value={user.password}
        onChange={e => setUser({ ...user, password: e.target.value })}
        onBlur={checkPasswords}
      />
    
      <label>Confirmação de senha</label>
      <input 
        required 
        type="password" 
        placeholder="Repita a sua senha"
        value={user.passwordConfirmation}
        onChange={e => setUser({ ...user, passwordConfirmation: e.target.value })}
        onBlur={checkPasswords}
      />

      {
        differentPasswords ? (
          <label className="error-label">
            * Ambas as senhas devem ser iguais!
          </label>
        ) : (
          null
        )
      }

      <label>Whatsapp</label>
      <InputMask
        required
        type="tel"
        placeholder="(21) 91234-5678"
        pattern="^\(\d{2}\)\s\d{5}-\d{4}$"
        mask="(99) 99999-9999"
        value={user.whatsapp}
        onChange={e => setUser({ ...user, whatsapp: e.target.value })}
      />

      <button type="submit" className="button">Cadastrar</button>

      <Link href="/login" className="link">
        <FiLogIn size={16} color="#F48192"/>
        Fazer login
      </Link>
    </form>
  )
}

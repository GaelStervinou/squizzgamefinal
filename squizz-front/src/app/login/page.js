"use client";

import LoginForm from '@/components/LoginForm';
import CreateAccountForm from '@/components/CreateAccountForm';

export default function Login() {
  return <>
    <h1>Se connecter</h1>
    <LoginForm />
    <h1>Créer un compte</h1>
    <CreateAccountForm />
  </>
}

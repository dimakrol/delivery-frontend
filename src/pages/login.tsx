import React from 'react';
import {useForm} from "react-hook-form";
import {FormError} from "../components/form-error";
import {gql, useMutation} from "@apollo/client";
import {LoginMutation, LoginMutationVariables} from "../__generated__/LoginMutation";
import logo from '../images/logo.svg';
import {Link} from "react-router-dom";
import {Button} from "../components/button";
import { Helmet } from 'react-helmet-async';
import {authToken, isLoggedInVar} from "../apollo";
import {LOCALSTORAGE_TOKEN} from "../constants";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok,
      token,
      error
    }
  }
`;

interface ILoginForm {
  email: string,
  password: string,
}

export const Login = () => {
  const { register, getValues, formState: { errors }, handleSubmit, formState } = useForm<ILoginForm>({
    mode: "onBlur"
  });
  const onCompleted = (data: LoginMutation) => {
    const { login: {ok, token} } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authToken(token);
      isLoggedInVar(true);
    }
  };

  const [loginMutation, {data: loginMutationResult, loading}] = useMutation<
    LoginMutation, LoginMutationVariables
    >(LOGIN_MUTATION, {
      onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password
          }
        }
      })
    }
  }

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet><title>Login | Delivery</title></Helmet>
      <div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
        <img src={logo} className='w-52 mb-10' alt="logo"/>
        <h4 className='w-full font-medium text-left text-3xl mb-5'>Welcome back</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 mt-5 w-full mb-5">
          <input { ...register('email', { required: 'Email is required', pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ }) }
                 type="email"
                 required
                 placeholder="Email"
                 className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message}/>
          )}
          {errors.email?.message === 'pattern' && (
            <FormError errorMessage="Please enter a valid email"/>
          )}
          <input { ...register('password', { required: 'Password is required', minLength: 6 }) }
                 type="password"
                 required
                 placeholder="Password"
                 className="input"/>
          {errors.password?.type === 'minLength' && (
            <FormError errorMessage="Password must be more than 6 chars."/>
          )}
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message}/>
          )}
          <Button canClick={formState.isValid} loading={loading} actionText='Log In' />
          {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error}/>}
        </form>
        <div>
          New to Delivery? <Link to="/create-account" className="link">Create an Account</Link>
        </div>
      </div>
    </div>)
}
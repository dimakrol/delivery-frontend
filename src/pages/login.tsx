import React from 'react';
import {useForm} from "react-hook-form";
import {FormError} from "../components/form-error";
import {ApolloError, gql, useMutation} from "@apollo/client";
import {LoginMutation, LoginMutationVariables} from "../__generated__/LoginMutation";

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
  const { register, getValues, formState: { errors }, handleSubmit } = useForm<ILoginForm>();
  const onCompleted = (data: LoginMutation) => {
    const { login: {error, ok, token} } = data;
    if (ok) {
      console.log(token)
    } else {
      if (error) {}
    }
  };

  const [loginMutation, {data: loginMutationResult}] = useMutation<
    LoginMutation, LoginMutationVariables
    >(LOGIN_MUTATION, {
      onCompleted,
  });

  const onSubmit = () => {
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

  return (<span className="h-screen flex items-center justify-center bg-gray-800">
    <div className="bg-white w-full max-w-lg py-7 rounded-lg text-center">
      <h3 className="text-3xl text-gray-800">Log In</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 mt-5 px-5">
        <input { ...register('email', { required: 'Email is required' }) }
               type="email"
               required
               placeholder="Email"
               className="input mb-3"
        />
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message}/>
        )}
        <input { ...register('password', { required: 'Password is required', minLength: 6 }) }
               type="password"
               required
               placeholder="Password"
               className="input mb-3"/>
        {errors.password?.type === 'minLength' && (
          <FormError errorMessage="Password must be more than 6 chars."/>
        )}
        {errors.password?.message && (
          <FormError errorMessage={errors.password?.message}/>
        )}
        <button className="btn">Log In</button>
        {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error}/>}
      </form>
    </div>
  </span>)
}
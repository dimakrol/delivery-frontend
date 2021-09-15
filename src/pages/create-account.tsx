import React from 'react';
import {useForm} from "react-hook-form";
import {FormError} from "../components/form-error";
import {gql, useMutation} from "@apollo/client";
import logo from '../images/logo.svg';
import {Link, useHistory} from "react-router-dom";
import {Button} from "../components/button";
import { Helmet } from 'react-helmet-async';
import {UserRole} from "../__generated__/globalTypes";
import {createAccountMutation, createAccountMutationVariables} from "../__generated__/createAccountMutation";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(
      input: $createAccountInput
    ) {
      ok,
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string,
  password: string,
  role: UserRole
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    formState
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client
    }
  });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {createAccount: {ok}} = data;
    if(ok) {
      alert('Account Created! Log in now!')
      history.push('/login');
    }
  }
  const [createAccountMutation, {loading, data: createAccountMutationResult }] = useMutation<
      createAccountMutation,
      createAccountMutationVariables
    >(
      CREATE_ACCOUNT_MUTATION,
      {
        onCompleted
      }
    );

  const onSubmit = () => {
    if (!loading) {
      const {email, password, role} = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role}
        }
      })
    }
  }

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet><title>Create Account | Delivery</title></Helmet>
      <div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
        <img src={logo} className='w-52 mb-10' alt="logo"/>
        <h4 className='w-full font-medium text-left text-3xl mb-5'>Let's get started</h4>
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
          <select { ...register('role', { required: true }) } className="input">
            {Object.keys(UserRole).map((role) => <option key={role}>{role}</option>)}
          </select>
          <Button canClick={formState.isValid} loading={loading} actionText='Create Account' />
          {createAccountMutationResult?.createAccount.error && <FormError errorMessage={createAccountMutationResult.createAccount.error}/>}
        </form>
        <div>
          Already have an account? <Link to="/login" className="link">Log in now</Link>
        </div>
      </div>
    </div>)
}
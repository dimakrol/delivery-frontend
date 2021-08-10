import React from 'react';
import {useForm} from "react-hook-form";

interface IForm {
  email: string,
  password: string,
}

export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<IForm>();

  const onSubmit = () => {
    console.log(watch())
  }
  const onInvalid = () => {
    console.log('not valid ', errors)
  }
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register('email', {
              required: 'this is required',
              validate: (email:string) => email.includes('@gmail.com')})}
            type="email"
            placeholder="email"
          />
          {errors.email?.message && <span className="font-bold text-red-600">{errors.email?.message}</span>}
          {errors.email?.type === 'validate' && <span className="font-bold text-red-600">Only Gmail</span>}
        </div>
        <div>
          <input
            {...register('password', {required: true})}
            type="password"
            placeholder="password"
          />
        </div>
        <button className="bg-yellow-300 text-white">Login</button>
      </form>
    </div>
  );
}

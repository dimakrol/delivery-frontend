import React from 'react';
import {useForm} from "react-hook-form";

interface ILoginForm {
  email?: string,
  password?: string,
}

export const Login = () => {
  const { register, getValues, formState: { errors }, handleSubmit } = useForm<ILoginForm>();
  const onSubmit = () => {
    console.log(getValues())
  }
  return <span className="h-screen flex items-center justify-center bg-gray-800">
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
          <span className="font-medium text-red-500">
            {errors.email?.message}
          </span>
        )}
        <input { ...register('password', { required: 'Password is required', minLength: 6 }) }
               type="password"
               required
               placeholder="Password"
               className="input mb-3"/>
        {errors.password?.type === 'minLength' && (
          <span className="font-medium text-red-500">
            Password must be more than 6 chars.
          </span>
        )}
        {errors.password?.message && (
          <span className="font-medium text-red-500">
            {errors.password?.message}
          </span>
        )}
        <button className="btn">Log In</button>
      </form>
    </div>
  </span>
}
//
// import React from 'react';
// import {useForm} from "react-hook-form";
//

//
// export const LoggedOutRouter = () => {
//   const { register, watch, handleSubmit, formState: { errors } } = useForm<IForm>();
//
//   const onSubmit = () => {
//     console.log(watch())
//   }
//   const onInvalid = () => {
//     console.log('not valid ', errors)
//   }
//   return (
//     <div>
//       <h1>Logged Out</h1>
//       <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
//         <div>
//           <input
//             {...register('email', {
//               required: 'this is required',
//               validate: (email:string) => email.includes('@gmail.com')})}
//             type="email"
//             placeholder="email"
//           />
//           {errors.email?.message && <span className="font-bold text-red-600">{errors.email?.message}</span>}
//           {errors.email?.type === 'validate' && <span className="font-bold text-red-600">Only Gmail</span>}
//         </div>
//         <div>
//           <input
//             {...register('password', {required: true})}
//             type="password"
//             placeholder="password"
//           />
//         </div>
//         <button className="bg-yellow-300 text-white">Login</button>
//       </form>
//     </div>
//   );
// }
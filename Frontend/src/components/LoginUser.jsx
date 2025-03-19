import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/Appcontext';
import { assets } from '../assets/assets';

const LoginUser = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('');
  const [password, setPasword] = useState('');
  const [email, setEmail] = useState('');
  const {setShowLogin}=useContext(AppContext);
  const onSubmitHandler = async (e) => {
    e.preventDefault();

  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [])
  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
        {state === 'Login' ? <p className='text-sm'>Welcome back! Please sign in to continue</p> : <p className='text-sm'>New here? Create an account to get started</p>}
        {state !== 'Login' && (
          <div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
            <img src={assets.person_icon} alt="" />
            <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type='text' placeholder='Name' required />
          </div>
        )}

        <div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
          <img src={assets.email_icon} alt="" />
          <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type='email' placeholder='Email Id' required />
        </div>
        <div className='border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
          <img src={assets.lock_icon} alt="" />
          <input className='outline-none text-sm' onChange={e => setPasword(e.target.value)} value={password} type='password' placeholder='Password' required />
        </div>

        {state === 'Login' && <p className='text-sm text-gray-600 cursor-pointer mt-3'>Forgot Password?</p>}
        <button type='submit' className='bg-gray-700 text-white py-2 items-center rounded-full w-full mt-3'>
          {
            state == 'Login' ? 'Login' : 'SignIn'
          }
        </button>

        {
          state == 'Login'
            ?
            <p className='mt-5 text-center ml-3 text-sm'>Don't have an account? <span className='cursor-pointer text-gray-700' onClick={() => setState('Sign Up')}>Sign Up</span></p>
            :
            <p className='mt-5 text-center ml-3 text-sm'>Already have an account? <span className='cursor-pointer text-gray-700' onClick={() => setState('Login')}>Login</span></p>
        }

        <img onClick={e => setShowLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} />
      </form>
    </div>
  )
}

export default LoginUser
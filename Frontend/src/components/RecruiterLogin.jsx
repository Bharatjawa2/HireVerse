import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'; 

const RecruiterLogin = () => {
    const navigate = useNavigate();
    const [state, setState] = useState('Login');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

    const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData} = useContext(AppContext);

    useEffect(() => {
        if (image) {
            const imgUrl = URL.createObjectURL(image);
            setPreview(imgUrl);
            return () => URL.revokeObjectURL(imgUrl); 
        }
    }, [image]);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    
        if (state === 'Sign Up' && !isTextDataSubmitted) {
            return setIsTextDataSubmitted(true);
        }
        try {
            if (state === 'Login') {
                const { data } = await axios.post(`${backendUrl}/api/v2/company/login`,{email,password},{withCredentials:true});
                if (data.success) {
                    console.log("API Response:", data);
                    setCompanyData(data.company);
                    setCompanyToken(true);
                    setShowRecruiterLogin(false);
                    navigate('/dashboard');
                }
                else{
                    toast.error(data.message);
                }
            }else{
                const formData=new FormData();
                formData.append('name',name);
                formData.append('password',password);
                formData.append('email',email); 
                formData.append('image',image);

                const { data } = await axios.post(`${backendUrl}/api/v2/company/register `,formData,{withCredentials:true});
                if(data.success){
                    console.log("API Response:", data);
                    setCompanyData(data.company);  
                    setCompanyToken(true);
                    setShowRecruiterLogin(false);
                    navigate('/dashboard');
                }else{
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("Company not found");
                } else if (error.response.status === 401) {
                    toast.error("Invalid credentials");
                } else {
                    toast.error(error.response.data.message || "Something went wrong. Please try again.");
                }
            } else {
                toast.error("Something went wrong. Please check your network and try again.");
            }
        }
    };
    

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500">
                <h1 className="text-center text-2xl text-neutral-700 font-medium">Recruiter {state}</h1>
                {state === 'Login' ? (
                    <p className="text-sm">Welcome back! Please sign in to continue</p>
                ) : (
                    <p className="text-sm">New here? Create an account to get started</p>
                )}

                {state === 'Sign Up' && isTextDataSubmitted ? (
                    <div className="flex items-center gap-4 my-10">
                        <label htmlFor="image">
                            <img className="w-16 h-16 rounded-full object-cover" src={preview || assets.upload_area} alt="Company Logo" />
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                        </label>
                        <p>Upload Company <br /> Logo </p>
                    </div>
                ) : (
                    <>
                        {state !== 'Login' && (
                            <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                                <img src={assets.person_icon} alt="Company Icon" />
                                <input
                                    className="outline-none text-sm w-full"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    type="text"
                                    placeholder="Company Name"
                                    required
                                />
                            </div>
                        )}

                        <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                            <img src={assets.email_icon} alt="Email Icon" />
                            <input
                                className="outline-none text-sm w-full"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                placeholder="Email Id"
                                required
                            />
                        </div>

                        <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                            <img src={assets.lock_icon} alt="Lock Icon" />
                            <input
                                className="outline-none text-sm w-full"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type="password"
                                placeholder="Password"
                                required
                            />
                        </div>
                    </>
                )}

                {state === 'Login' && <p className="text-sm text-gray-600 cursor-pointer mt-3">Forgot Password?</p>}

                <button type="submit" className="bg-gray-700 text-white py-2 rounded-full w-full mt-3">
                    {state === 'Login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next'}
                </button>

                {state === 'Login' ? (
                    <p className="mt-5 text-center text-sm">
                        Don't have an account? <span className="cursor-pointer text-gray-700" onClick={() => setState('Sign Up')}>Sign Up</span>
                    </p>
                ) : (
                    <p className="mt-5 text-center text-sm">
                        Already have an account? <span className="cursor-pointer text-gray-700" onClick={() => setState('Login')}>Login</span>
                    </p>
                )}

                <img onClick={() => setShowRecruiterLogin(false)} className="absolute top-5 right-5 cursor-pointer" src={assets.cross_icon} alt="Close Icon" />
            </form>
        </div>
    );
};

export default RecruiterLogin;

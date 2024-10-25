/**
 * Register Component: Handles user registration by allowing users to sign up with email and password.
 * It ensures form validation, shows/hides passwords, and provides user feedback through error messages and disabling buttons.
 */

import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext/index';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Register = () => {
    // State management for form fields and UI control
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);  // Tracks if registration is in progress
    const [errorMessage, setErrorMessage] = useState('');        // Stores error messages
    const [showPassword, setShowPassword] = useState(false);     // Toggles visibility of password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggles visibility of confirm password

    const { userLoggedIn } = useAuth();  // Access authentication context to check login status

    /**
     * Handles form submission for user registration.
     * If registration is already in progress, disables multiple submissions.
     */
    const onSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload on form submission

        if (!isRegistering) {
            try {
                setIsRegistering(true);
                await doCreateUserWithEmailAndPassword(email, password);
            } catch (error) {
                setErrorMessage(error.message); // Displays error if registration fails
            } finally {
                setIsRegistering(false); // Re-enables the form after attempt
            }
        }
    };

    // If the user is already logged in, redirect to the sign-in page.
    if (userLoggedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return (
        <main className="w-full h-screen flex self-center place-content-center place-items-center">
            <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                <div className="text-center mb-6">
                    <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                        Create a New Account
                    </h3>
                </div>

                {/* Registration Form */}
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Email Input Field */}
                    <div>
                        <label className="text-sm text-gray-600 font-bold">Email</label>
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg transition duration-300"
                        />
                    </div>

                    {/* Password Input Field */}
                    <div className="relative">
                        <label className="text-sm text-gray-600 font-bold">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg transition duration-300"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-2 top-9"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </button>
                    </div>

                    {/* Confirm Password Input Field */}
                    <div className="relative">
                        <label className="text-sm text-gray-600 font-bold">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="off"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-green-600 shadow-sm rounded-lg transition duration-300"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-2 top-9"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </button>
                    </div>

                    {/* Display error message if any */}
                    {errorMessage && (
                        <span className="text-red-600 font-bold">{errorMessage}</span>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isRegistering}
                        className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                            isRegistering
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 hover:shadow-xl transition duration-300'
                        }`}
                    >
                        {isRegistering ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    {/* Link to sign-in page */}
                    <div className="text-sm text-center">
                        Already have an account?{' '}
                        <Link to="/sign-in" className="text-center text-sm hover:underline font-bold">
                            Continue
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Register;

import React, { useState } from "react";
import Builder from "../components/Builder";
import { useNavigate } from "react-router-dom";
import { performPostActionAsync } from "./utils";
import { FIREBASE_API_KEY, FIREBASE_SIGN_IN_URL } from "./config";
import LoadingIcon from "./../icons/LoadingIcon";
import { jwtDecode } from "jwt-decode";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitEvent = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const requestData = {
      email: formData.get("email"),
      password: formData.get("password"),
      returnSecureToken: true,
    };

    const response = await performPostActionAsync(
      FIREBASE_SIGN_IN_URL + FIREBASE_API_KEY,
      requestData,
    );

    if (response.error) {
      console.log(response.error.message);
      // alert(`Error: ${response.error.message}`);
    } else {
      const token = response.idToken;
      localStorage.setItem("jwt", token);

      const decodedToken = jwtDecode(token);
      const custom_claims = decodedToken.custom_claims;

      if (custom_claims && custom_claims.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }

    setLoading(false);
  };

  return (
    <Builder className="!p-0 grid lg:grid-cols-2 bg-gradient-to-r from-sky-500 to-indigo-500">
      <div className="col-span-1 text-4xl text-white p-12">
        <div className="flex items-center justify-center h-full">
          <h1 className="text-white text-3xl sm:text-5xl lg:text-7xl font-bold max-w-[28rem] lg:max-w-[42rem] text-center lg:text-left">
            Welcome to{" "}
            <span className="text-5xl sm:text-7xl lg:text-[6rem]">
              MeetCode
            </span>
          </h1>
        </div>
      </div>
      <div className="col-span-1 flex items-center justify-center lg:bg-[#F5F5FA] p-6">
        <div className="w-[80%] max-w-lg bg-[#F5F5FA] p-8 md:p-12 rounded-lg place-self-start lg:bg-transparent lg:place-self-center">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-6">
            Login Page
          </h1>

          <form
            onSubmit={handleSubmitEvent}
            className="block font-medium text-gray-700 space-y-6"
          >
            <div>
              <label htmlFor="user-email">Email:</label>
              <input
                type="email"
                id="user-email"
                name="email"
                placeholder="Enter your email here"
                aria-describedby="user-email"
                aria-invalid="false"
                className="font-normal mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="font-normal mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button className="btn-submit bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-4 py-2 rounded-lg">
              {loading ? <LoadingIcon className="size-6" /> : "Sign Up"}
            </button>

            <div
              onClick={() => navigate("/register")}
              className="cursor-pointer"
            >
              <u>Create an account?</u>
            </div>
          </form>
        </div>
      </div>
    </Builder>
  );
}

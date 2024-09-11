import React, { useState } from "react";
import { ADMIN_SIGN_UP_URL, BACKEND_ADDRESS } from "../config";
import { performPostActionAsync } from "../utils";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../icons/LoadingIcon";
import Builder from "../../components/Builder";

export default function AdminSignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitEvent = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const loginCode = formData.get("loginCode");

    const endpoint = BACKEND_ADDRESS + (loginCode ? ADMIN_SIGN_UP_URL : "");

    console.log("BACKEND_ADDRESS: " + endpoint);

    const data = {
      displayName: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      ...(loginCode && { loginCode }),
    };

    console.log("Register data:" + data.loginCode);

    const response = await performPostActionAsync(endpoint, data);

    if (response.error) {
      alert(response.message);
    } else {
      alert("You've successfully signed up!");
      navigate("/login");
    }

    setLoading(false);
  };

  return (
    <Builder className=" !p-0 grid lg:grid-cols-2 bg-gradient-to-r from-sky-500 to-indigo-500">
      <div className="col-span-1 text-4xl text-white p-12">
        <div className="flex items-center justify-center lg:justify-start  h-full">
          <h1 className="text-white text-5xl lg:text-7xl font-bold max-w-[32rem] lg:max-w-[42rem] text-center md:text-left">
            <p>Let's </p>
            <span className="text-7xl lg:text-[6rem]">Get Start</span>
          </h1>
        </div>
      </div>
      <div className="col-span-1 flex items-center justify-center lg:bg-[#F5F5FA] p-6">
        <div className="w-[80%] max-w-lg bg-[#F5F5FA] p-8 md:p-12 rounded-lg place-self-start lg:bg-transparent lg:place-self-center">
          <h1 className="text-4xl font-bold mb-6">Sign Up Page</h1>

          <form
            onSubmit={handleSubmitEvent}
            className="block font-medium text-gray-700 space-y-6"
          >
            <div>
              <label htmlFor="user-name">Userame:</label>
              <div id="user-name" className="text-xs">
                Please enter a valid username. It must contain at least 6
                characters.
              </div>
              <input
                type="text"
                id="user-name"
                name="name"
                placeholder="Joe Doe"
                aria-invalid="false"
                className="font-normal mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="user-email">Email:</label>
              <div id="user-email" className="text-xs">
                Please enter a valid email. It must contain at least 6
                characters.
              </div>
              <input
                type="email"
                id="user-email"
                name="email"
                placeholder="example@yahoo.com"
                aria-describedby="user-email"
                aria-invalid="false"
                className="font-normal mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <div id="user-password" className="text-xs">
                your password should be more than 6 character
              </div>
              <input
                type="password"
                id="password"
                name="password"
                aria-describedby="user-password"
                aria-invalid="false"
                className="font-normal mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="adminCode">Admin Code:</label>
              <input
                type="text"
                id="adminCode"
                name="loginCode"
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
              Already have an account? <u>Go to Log in</u>
            </div>
          </form>
        </div>
      </div>
    </Builder>
  );
}

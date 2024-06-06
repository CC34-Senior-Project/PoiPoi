"use client";
import React, { useState } from "react";
import { User } from "../_utils/global";
import { Button } from "../_components/ui/button";
import { createUser, loginUser } from "../_actions/authenticationActions";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [user, setUser] = useState<User>({} as User);

  const toggleLogin = () => {
    setIsLogin(!isLogin);
    console.log("login status", isLogin);
  };

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setUser((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleCreateNewAccount = async (
    e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    console.log("User", user, "attempting to create a new account.");

    try {
      if (!user.email || !user.password) throw 'Invalid User/Password';
      await createUser(user.email, user.password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    console.log("Attempting to login");
    try{
      if (!user.email || !user.password) throw 'Invalid User/Password';
      await loginUser(user.email, user.password);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-between">
      {isLogin ? (
        <div className="bg-white border rounded shadow-lg mt-2 p-2">
          {/* {toggleLogin ? (<h4>Log in:</h4> ): (<h4>Create new account:</h4>)} */}
          Log in:
          <form onSubmit={handleCreateNewAccount}>
            {/* BEWARE! onSubmit event fires when user presses "enter" key at any point */}
            <div>
              <label htmlFor="email">Email address:</label>
              <input
                className="border border-black rounded"
                type="text"
                required
                onChange={handleInputChange}
                name="email"
                value={user.email}
              ></input>
            </div>
            <div>
              <label htmlFor="password">Set password:</label>
              <input
                className="border border-black rounded"
                type="password"
                required
                onChange={handleInputChange}
                name="password"
                value={user.password}
              ></input>
            </div>
            <Button onClick={handleLogin}>Log in</Button>
            <Button onClick={toggleLogin}> Create new account</Button>
          </form>
        </div>
      ) : (
        <div className="absolute bg-white border rounded shadow-lg mt-2 p-2 top-[100px] left-0 z-[1000]">
          Create new account:
          <form onSubmit={handleCreateNewAccount}>
            <div>
              <label htmlFor="email">Email address:</label>
              <input
                className="border border-black rounded"
                type="text"
                required
                onChange={handleInputChange}
                name="email"
                value={user.email}
              ></input>
            </div>
            <div>
              <label htmlFor="username">Set display name:</label>
              <input
                className="border border-black rounded"
                type="text"
                required
                onChange={handleInputChange}
                name="displayName"
                value={user.displayName}
              ></input>
            </div>
            <div>
              <label htmlFor="password">Set password:</label>
              <input
                className="border border-black rounded"
                type="password"
                required
                onChange={handleInputChange}
                name="password"
                value={user.password}
              ></input>
            </div>
            <Button onClick={handleCreateNewAccount}>Create account</Button>
            <Button onClick={toggleLogin}> Return</Button>
          </form>
        </div>
      )}

      {/* creation */}
      <div>
        <Button onClick={() => {
          console.log("Test click");
        }}>Click here to test if verified</Button>
      </div>
    </div>
  );
};

export default LoginPage;

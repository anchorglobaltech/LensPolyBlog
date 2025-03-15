import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Redux/theme/themeSlice";
import { signoutSuccess } from "../Redux/user/userSlice";
import logo from "../logo.jpg";

const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="border-b-2 shadow-md bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 flex flex-col items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mb-4">
          <img src={logo} alt="LensBlog Logo" className="h-23 w-23 rounded" />
        </Link>

        {/* Navbar */}
        <Navbar className="w-full flex flex-wrap justify-between items-center">
          {/* Navigation Links */}
          <div className="flex space-x-6 text-lg font-medium">
            <Link to="/" className={path === "/" ? "text-blue-500" : "text-gray-700 dark:text-gray-300"}>Home</Link>
            <Link to="/team" className={path === "/team" ? "text-blue-500" : "text-gray-700 dark:text-gray-300"}>Team</Link>
            <Link to="/about" className={path === "/about" ? "text-blue-500" : "text-gray-700 dark:text-gray-300"}>About</Link>
            <Link to="/dashboard?tab=profile" className={path === "/dashboard?tab=profile" ? "text-blue-500" : "text-gray-700 dark:text-gray-300"}>Profile</Link>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="hidden md:flex">
            <TextInput
              type="text"
              placeholder="Search..."
              rightIcon={AiOutlineSearch}
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* User & Theme Controls */}
          <div className="flex items-center space-x-4">
            <Button
              className="w-10 h-10"
              color="gray"
              pill
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>

            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={<Avatar alt="user" img={currentUser.profilePicture} rounded className="border" />}
              >
                <Dropdown.Header>
                  <span className="block text-sm">{currentUser.username}</span>
                  <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                </Dropdown.Header>
                <Link to="/dashboard?tab=profile">
                  <Dropdown.Item>Profile</Dropdown.Item>
                  <Dropdown.Divider />
                </Link>
                <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
              </Dropdown>
            ) : (
              <Link to="/sign-in">
                <Button gradientDuoTone="purpleToBlue" outline>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </Navbar>
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import PostCardSmall from "../components/PostCardSmall"; // Small Card for Trending
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Import images from src/images
import banner1 from "../images/banner1.jpg";
import banner2 from "../images/banner2.jpg";
import banner3 from "../images/banner3.jpg";

const carouselImages = [banner1, banner2, banner3];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  // Function to get the current time in Nigeria
  const updateTime = () => {
    const options = {
      timeZone: "Africa/Lagos",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    setCurrentTime(new Date().toLocaleString("en-NG", options));
  };

  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts");
        const data = await res.json();
        console.log("Recent Posts:", data);
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    const fetchTrendingPosts = async () => {
      try {
        const res = await fetch("/api/post/getTrendingPosts");
        const data = await res.json();
        console.log("Trending Posts:", data);
        setTrendingPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      }
    };

    fetchPosts();
    fetchTrendingPosts();

    // Update time every second
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div>
      {/* Date & Time */}
      <div className="bg-gray-800 text-white text-center py-2">
        <p className="text-lg font-semibold">{currentTime}</p>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[500px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {carouselImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[500px]">
                <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-4">
                  <h1 className="text-3xl font-bold lg:text-6xl">Welcome to My Blog</h1>
                  <p className="text-lg text-gray-200 mt-4">
                    Discover insightful articles on News, Technology, Sports, Science, and more.
                  </p>
                  <Link to={"/search"} className="mt-4 text-lg bg-teal-500 px-6 py-2 rounded-full font-semibold hover:bg-teal-600 transition duration-300">
                    View All Posts
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Content: Trending + Recent Posts (Two-Column Layout) */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 py-7">
        
        {/* Trending Posts (Left Column - 1/3 Width) */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">🔥 Trending Posts</h2>
          <div className="flex flex-col gap-4">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => <PostCardSmall key={post._id} post={post} />)
            ) : (
              <p className="text-center text-gray-500">No trending posts found.</p>
            )}
          </div>
          <Link to={"/trending"} className="block text-lg text-teal-500 hover:underline mt-4 text-center md:text-left">
            View all Trending Posts →
          </Link>
        </div>

        {/* Recent Posts (Right Column - 2/3 Width) */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">🆕 Recent Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <p className="text-center text-gray-500 col-span-2">No recent posts available.</p>
            )}
          </div>
          <Link to={"/search"} className="block text-lg text-teal-500 hover:underline mt-4 text-center md:text-left">
            View all Posts →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

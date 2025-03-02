import React, { useEffect, useState } from "react";
import proprietor from "../images/proprietor.png";
import beejay from "../images/beejay.jpeg";

// Team Members Data
const teamMembers = [
  {
    id: 1,
    name: "Dr. Yisa Azeez Bukola",
    role: "Proprietor, Lens Polytechnic",
    description: "Committed to excellence in education and leadership.",
    image: proprietor,
    userId: "user123",
  },
  {
    id: 2,
    name: "Mr. Banuso Hammed",
    role: "School Librarian",
    description: "Passionate about knowledge management and research.",
    image: "/images/librarian.jpg",
    userId: "user456",
  },
  {
    id: 3,
    name: "Mr. Oni Victor",
    role: "Head of Multimedia Department",
    description: "Expert in media production, photography, and digital arts.",
    image: "/images/multimedia.jpg",
    userId: "user789",
  },
  {
    id: 4,
    name: "Mr. Aileru Habeeb Abolaji",
    role: "Website Developer",
    description: "Passionate about modern web technologies and user experience.",
    image: beejay,
    userId: "user101",
  },
];

const Team = () => {
  const [latestPosts, setLatestPosts] = useState({});

  useEffect(() => {
    const fetchLatestPosts = async () => {
      const postsData = {};
      for (const member of teamMembers) {
        try {
          const res = await fetch(`/api/post/getLatestPostByUser/${member.userId}`);
          const data = await res.json();
          postsData[member.id] = data.post || null;
        } catch (error) {
          console.error(`Error fetching post for ${member.name}:`, error);
        }
      }
      setLatestPosts(postsData);
    };
    fetchLatestPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Meet Our Team</h1>
        <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
          Our dedicated professionals strive to deliver excellence in education, technology, and research.
        </p>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="w-full h-100">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
              <p className="text-sm text-teal-600 font-semibold mt-1">{member.role}</p>
              <p className="text-gray-700 mt-3">{member.description}</p>

              {/* Latest Post */}
              {latestPosts[member.id] ? (
                <div className="mt-5">
                  <h3 className="text-lg font-semibold text-gray-800">Latest Post:</h3>
                  <p className="text-sm text-gray-700">{latestPosts[member.id].title}</p>
                  <a
                    href={`/post/${latestPosts[member.id]._id}`}
                    className="inline-block mt-2 text-teal-500 hover:underline text-sm"
                  >
                    Read More →
                  </a>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-4">No recent posts available.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;

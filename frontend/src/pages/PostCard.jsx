import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  if (!post) return null;

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
      <img className="w-full h-48 object-cover" src={post.image} alt={post.title} />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-gray-600 text-sm mt-2">{post.content.substring(0, 100)}...</p>
        <Link to={`/post/${post._id}`} className="mt-4 block text-teal-500 hover:underline">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;

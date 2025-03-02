import React from "react";
import { Link } from "react-router-dom";

const PostCardSmall = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center">
      <img src={post.image} alt={post.title} className="w-24 h-24 object-cover rounded-l-lg" />
      <div className="p-3">
        <Link to={`/post/${post.slug}`} className="text-lg font-semibold text-gray-900 hover:underline">
          {post.title}
        </Link>
        <p className="text-gray-600 text-sm">{post.category}</p>
      </div>
    </div>
  );
};

export default PostCardSmall;

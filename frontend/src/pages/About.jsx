import React from "react";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-10 text-center">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold text-gray-800 my-7">About LensPolyBlog</h1>
          
          <div className="text-lg text-gray-700 flex flex-col gap-6 text-justify leading-relaxed">
            <p>
              Welcome to <strong>LensPolyBlog</strong>, a platform dedicated to insightful articles, 
              engaging stories, and thought-provoking discussions. Whether you are a student, 
              educator, or knowledge enthusiast, our goal is to provide a space where ideas are shared, 
              knowledge is expanded, and meaningful conversations take place.
            </p>

            <p>
              LensPolyBlog is designed to bring valuable content on various topics, including 
              technology, education, campus news, career advice, and personal development. 
              We aim to build a community where users can express their thoughts, learn from others, and stay informed.
            </p>

            <p>
              Our platform allows readers to explore different articles while giving admins 
              the ability to create and manage blog posts. Users can engage by commenting, liking, 
              and participating in discussions. We also support Google OAuth for easy account creation 
              and profile customization.
            </p>

            <p>
              This blog was created as a collaborative project, with <strong>Aileru Habeeb Abolaji</strong> serving as a consultant. 
              The project was supervised by <strong>Oni Victor</strong>, Head of the Multimedia Department, and <strong>Mr. Banuso Hammed</strong>, 
              the School Librarian. Together, they guided the development of this platform, 
              which showcases expertise in full-stack web development using cutting-edge technologies 
              like JavaScript, React, Node.js, Express.js, and MongoDB as the database.
            </p>

            <p>
              Join us on this journey of learning, discovery, and growth. 
              Your voice matters, and we encourage you to be a part of the <strong>LensPolyBlog</strong> community!
            </p>

            <p className="text-center text-gray-600 text-xl font-semibold mt-6">
              Made with passion for knowledge and community ♥️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

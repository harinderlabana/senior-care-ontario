// In src/components/pages/BlogPost.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Meta from "../common/Meta";

const BlogPost = () => {
  const { slug } = useParams();
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");

  useEffect(() => {
    import(`../../blog/${slug}.md`)
      .then((res) => {
        fetch(res.default)
          .then((response) => response.text())
          .then((text) => {
            const firstLine = text.split("\n")[0];
            const title = firstLine.replace("# ", "");
            setPostTitle(title);
            setPostContent(text);
          })
          .catch((err) => console.error("Could not fetch post:", err));
      })
      .catch((err) => console.error("Could not import post:", err));

    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <main className="animate-fade-in bg-white">
      <Meta title={`${postTitle} | SeniorCare Ontario`} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/blog" className="text-[#145DA0] hover:underline">
              &larr; Back to Resource Center
            </Link>
          </div>
          {/* FIX: Added prose classes for styling */}
          <article className="prose lg:prose-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {postContent}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </main>
  );
};

export default BlogPost;

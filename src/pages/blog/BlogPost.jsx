import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import blogPosts from "../../data/blogPosts";
import Giscus from "../../components/ui/Giscus";
import styles from "./BlogPost.module.scss";

const BlogPost = () => {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    const loadPost = async () => {
      try {
        // Dynamic import of markdown file
        const markdown = await import(`../../content/blog/${slug}.md?raw`);

        // Remove frontmatter (content between --- markers)
        const contentWithoutFrontmatter = markdown.default.replace(
          /^---[\s\S]*?---\n*/,
          "",
        );

        setContent(contentWithoutFrontmatter);
        setLoading(false);
      } catch (err) {
        setError("Post not found");
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.blogPost}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.blogPost}>
        <h1>Post not found</h1>
        <Link to="/blog" className={styles.backLink}>
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.blogPost}>
      <header className={styles.header}>
        <Link to="/blog" className={styles.backLink}>
          &larr; Back to blog
        </Link>
        <time className={styles.date}>{post.date}</time>
      </header>

      <article className={styles.prose}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>

      <section className={styles.comments}>
        <h2>Comments</h2>
        <Giscus
          repo="allenocvb/my-portfolio"
          repoId="R_kgDOMr1AAw"
          category="General"
          categoryId="DIC_kwDOMr1AA84C0F76"
        />
      </section>

      <footer className={styles.footer}>
        <Link to="/blog" className={styles.backLink}>
          &larr; Back to blog
        </Link>
      </footer>
    </div>
  );
};

export default BlogPost;

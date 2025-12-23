import React from "react";
import { Link } from "react-router-dom";
import blogPosts from "../../data/blogPosts";
import Footer from "../../components/layout/Footer";
import styles from "./index.module.scss";

const BlogIndex = () => {
  // Group posts by year (extracted from date string)
  const postsByYear = blogPosts.reduce((acc, post) => {
    const year = post.date.split("-")[0];
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  // Sort years descending (newest first)
  const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a);

  // Format date for display (e.g., "Dec 21")
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day); // Local date, no timezone shift
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <div className={styles.blogContainer}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Blog</h1>
          <img
            src="/assets/naruto.jpeg"
            alt="Naruto"
            className={styles.titleImage}
          />
        </div>

        {sortedYears.length > 0 ? (
          sortedYears.map((year) => (
            <div key={year} className={styles.yearSection}>
              <h2 className={styles.year}>{year}</h2>
              <ul className={styles.postList}>
                {postsByYear[year].map((post) => (
                  <li key={post.slug} className={styles.postItem}>
                    <span className={styles.date}>{formatDate(post.date)}</span>
                    <Link to={`/blog/${post.slug}`} className={styles.postLink}>
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className={styles.comingSoon}>Coming soon...</p>
        )}

        <Link to="/" className={styles.backLink}>
          Back to home
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default BlogIndex;

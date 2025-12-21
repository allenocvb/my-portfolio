import React from "react";
import { Link } from "react-router-dom";
import styles from "./Blog.module.scss";

const Blog = () => {
  const posts = [
    {
      date: "Dec 21",
      title: "Reading List",
      slug: "reading-list",
    },
  ];

  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = "2025";
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  return (
    <div className={styles.blogContainer}>
      <h1 className={styles.title}>Blog</h1>

      {Object.keys(postsByYear).length > 0 ? (
        Object.entries(postsByYear).map(([year, yearPosts]) => (
          <div key={year} className={styles.yearSection}>
            <h2 className={styles.year}>{year}</h2>
            <ul className={styles.postList}>
              {yearPosts.map((post, index) => (
                <li key={index} className={styles.postItem}>
                  <span className={styles.date}>{post.date}</span>
                  <span className={styles.postTitle}>{post.title}</span>
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
  );
};

export default Blog;

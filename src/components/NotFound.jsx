import React, { useEffect } from 'react';
import { PowerGlitch } from 'powerglitch';

const NotFound = () => {
  useEffect(() => {
    PowerGlitch.glitch('body');
  }, []);

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
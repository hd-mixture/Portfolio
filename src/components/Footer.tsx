import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <span>&copy; {currentYear} Darshan Prajapati. All rights reserved.</span>
      </div>
    </footer>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header component
 */
export default function Header(): JSX.Element {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light rounded shadow-sm mb-4 px-3">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Meeting Scheduler
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

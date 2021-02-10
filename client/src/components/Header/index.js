import React from "react";
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";

function Nav() {

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <ul className="d-flex flex-row">
          <li className="mx-3 text-dec">
            <Link to="/OrderHistory">
              Order History
            </Link>
          </li>
          <li className="mx-3 text-dec">
            <Link to="/profile">
              My Profile
            </Link>
          </li>
          <li className="mx-3 text-dec">
            {/* this is not using the Link component to logout or user and then refresh the application to the start */}
            <a href="/" onClick={() => Auth.logout()}>
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="d-flex flex-row">
          <li className="mx-3 text-dec">
            <Link to="/signup">
              Signup
            </Link>
          </li>
          <li className="mx-3 text-dec">
            <Link to="/login">
              Login
            </Link>
          </li>
        </ul>
      );
    }
  }

  return (
    <header className="d-flex flex-row px-1 align-items-center header">
      <h1>
        <Link to="/">
          <span role="img" aria-label="shopping bag">💻</span>
          The Virtual Yard Sale
        </Link>
      </h1>

      <nav>
        {showNavigation()}
      </nav>
    </header>
  );
}

export default Nav;

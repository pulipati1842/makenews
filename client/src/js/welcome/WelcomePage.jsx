import React, { Component } from "react";
import { Link } from "react-router";

export default class WelcomePage extends Component {
    render() {
        const user = localStorage.getItem("userName") || "user";
        return (
            <div className="welcome-page">
                <header>
                    <img className="logo" src="./images/makenews-logo.png" alt="makenews logo" />
                </header>
                <main>
                    <div className="welcome-message">
                        <p className="welcome-user">Hello {user},</p>
                        <p className="intro">
                            Welcome onboard. Hungry for news? Lets get started to collect and sort your news at one stop. Here are a few things you might want to know.
                        </p>
                    </div>
                </main>
                <footer>
                    <Link to="/configure-intro" className="makenews-desc-link">
                        <span> <i className="fa fa-arrow-right" /> Next </span>
                    </Link>
                </footer>
            </div>
        );
    }
}

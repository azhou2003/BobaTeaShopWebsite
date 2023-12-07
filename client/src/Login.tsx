// @ts-ignore
import React, { Component, useRef, useEffect } from 'react';
import './App.css';
import { config } from "./LoginConfig";
import { PublicClientApplication } from '@azure/msal-browser';
import { Link } from 'react-router-dom';
// @ts-ignore
import styles from './Login.module.css';
// @ts-ignore
import stLogo from '/src/public/ShareTeaTitle.png';

interface LoginState {
    error: any;
    isAuthenticated: boolean;
    user: any;
    login_attempt: string;
    error_msg: string;
    user_name: string;
    name: string;
    isManager: boolean;
}

/**
 * A class that sets up an authentication system using Microsoft Azure
 * @class
 *
 * @example
 * // Usage:
 * const loginInstance = new Login({});
 *
 * @prop {Object} props - The component properties.
 * @prop {boolean} props.isAuthenticated - True if the user has logged in via microsoft
 * @prop {boolean} props.isManager - True if the user is a manager
 * @prop {string} props.user_name - The individual's username, usually an email address
 * @prop {string} props.name - The logged in user's associated first name
 * @returns {JSX.Element} React component to render
 */
class Login extends Component<{}, LoginState> {
    private PCA: PublicClientApplication;
    /**
     * Creates a new Login instance.
     * @constructor
     *
     * @param {Object} props - The component properties.
     */
    constructor(props: {}) {
        super(props);
        this.state = {
            error: null,
            isAuthenticated: false,
            user: {},
            login_attempt: "no",
            error_msg: "-",
            user_name: "no username",
            name: "no name",
            isManager: false
        };
        this.login = this.login.bind(this);

        // Initialize the MSAL application object
        this.PCA = new PublicClientApplication({
            auth: {
                clientId: config.appId,
                redirectUri: config.redirectUri,
                authority: config.authority
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: true
            }
        });
    }

    /**
     * Lifecycle method called after the component mounts.
     * @method
     * @param {void} - No parameters are expected.
     */
    async componentDidMount() {
        // Ensure MSAL is initialized before rendering
        await this.PCA.initialize();
        await this.PCA.handleRedirectPromise();
    }

    /**
     * Calls popup to log in the user.
     * @method
     * @param {void} - No parameters are expected.
     */
    async login() {
        try {
            // login via popup
            // information saved in loginResponse.account
            const loginResponse = await this.PCA.loginPopup({
                scopes: config.scopes,
                prompt: "select_account"
            });
            this.setState({
                isAuthenticated: true,
                login_attempt: "Yes",
                // @ts-ignore
                name: loginResponse.account.name,
                user_name: loginResponse.account.username
            });
            if (loginResponse.account.username == "manager@nahteqwerty01gmail.onmicrosoft.com") {
                this.setState({
                    isManager: true
                });
            }
            const isManager = loginResponse.account.username === "manager@nahteqwerty01gmail.onmicrosoft.com";
            // Store isManager in session storage
            sessionStorage.setItem('isManager', JSON.stringify(isManager));
        } catch (err) {
            this.setState({
                isAuthenticated: false,
                user: {},
                error: err,
            });
            if (err instanceof Error) {
                this.setState({
                    error_msg: err.message
                });
            }
        }
    }

    /**
     * Logs out the user.
     * @method
     * @param {void} - No parameters are expected.
     */
    async logout() {
        this.PCA.logout();
        this.setState({
            isAuthenticated: false,
            isManager: false,
            login_attempt: "Logged out",
            user_name: "no username"
        });
    }
    
    /**
     * Renders the Login component.
     * @method
     * @returns {JSX.Element} React component
     */
    render() {
        return (
            <div className={styles.loginContainer}>
                <img className={styles.titleImg} src={stLogo} alt="ShareTea"></img>
                <h1 className={styles.empTitle}>Employee Portal</h1>
                <Link to="/">
                    <button className={styles.exitButton}>Exit</button>
                </Link>
                {this.state.isAuthenticated ? (
                    <div className={styles.loggedInContent}>
                        <button className={styles.logoutButton} onClick={() => this.logout()}>Logout</button>
                        <Link to="/cashier">
                            <button className={styles.enterButton}>{this.state.isManager ? 'Go to Manager View' : 'Go to Cashier View'}</button>
                        </Link>
                    </div>
                ) : (
                    <p>
                        <button className={styles.loginButton} onClick={() => this.login()}>Login</button>
                    </p>
                )}
            </div>
        );
    }
}

export default Login;

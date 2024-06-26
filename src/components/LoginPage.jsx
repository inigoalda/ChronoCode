import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { Container, Form, Input, Button } from './StyledComponents';

import {VscRobot} from "react-icons/vsc";

const LoginPage = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginData = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.statusCode === 200) {
                    setError("");
                    props.userHandler(username);
                }
                else {
                    setError(data.message || "Login failed");
                }
                
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <VscRobot size={100}/>
                <h1>Login</h1>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit">Login</Button>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                </Form>
            </Container>
        </ThemeProvider>
    );
};

export default LoginPage;

import React, { useState } from "react";
import {
    Container,
    Card,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Avatar,
} from "@mui/material";
const UserFinder = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const handleSearch = async (e) => {
        e.preventDefault();
        const query = e.target.elements.search.value.trim() || "";
        if (query) {
            const userResponse = await fetch(`https://api.github.com/users/${query}`);
            const repositoriesResponse = await fetch(
                `https://api.github.com/users/${query}/repos`
            );
            if (userResponse.ok && repositoriesResponse.ok) {
                const userData = await userResponse.json();
                const repositoriesData = await repositoriesResponse.json();
                setUser(userData);
                setRepositories(repositoriesData);
            } else {
                setUser(null);
                setRepositories([]);
            }
        }
    };
    return (
        <Container
            maxWidth="md"
            sx={{
                minHeight: "100vh",
                py: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card sx={{ p: 3 }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    GitHub User Finder
                </Typography>
                <form onSubmit={handleSearch}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Enter GitHub username"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        name="search" // Add the name attribute
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Search
                    </Button>
                </form>
                {user && (
                    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar
                                    src={user.avatar_url}
                                    alt={user.name}
                                    sx={{ width: 100, height: 100 }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography variant="h5" component="h3">
                                    {user.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {user.bio}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                )}
                <Typography variant="h5" component="h3" sx={{ mt: 4 }}>
                    Repositories
                </Typography>
                {repositories.length > 0 ? (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {repositories.map((repo) => (
                            <Grid item key={repo.id} xs={12} sm={6} md={4}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" component="h4">
                                        {repo.name}
                                    </Typography>

                                    <Typography variant="body1" color="textSecondary">
                                        <b>Description:</b>{" "}
                                        {repo.description && repo.description.length > 100
                                            ? repo.description.slice(0, 100) + "..."
                                            : repo.description || "N/A"}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <b>Language:</b> {repo.language || "N/A"}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <b>Stars: </b>{repo.stargazers_count}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <b>Forks: </b>{repo.forks}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        fullWidth
                                    >
                                        View Repository
                                    </Button>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                        No repositories found
                    </Typography>
                )}
            </Card>
        </Container>
    );
};

export default UserFinder;

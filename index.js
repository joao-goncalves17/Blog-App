import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// In-memory posts array
let posts = [];

// Routes

// Home route to display posts
app.get('/', (req, res) => {
    // Sort posts by date (newest first)
    const sortedPosts = posts.slice().sort((a, b) => b.date - a.date);
    res.render('index', { posts: sortedPosts });
});

// Route to handle post creation
app.post('/new-post', (req, res) => {
    const newPost = {
        id: posts.length + 1, // Assign a unique ID
        title: req.body.title,
        content: req.body.content,
        date: new Date() // current date and time
    };

    // Add new post to the posts array
    posts.push(newPost);

    // Redirect to home to display updated posts
    res.redirect('/');
});

// Route to display edit form for a specific post
app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postToEdit = posts.find(post => post.id === postId);

    if (postToEdit) {
        res.render('edit', { post: postToEdit });
    } else {
        res.status(404).send('Post not found');
    }
});

// Route to handle the submission of edited post
app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId);

    if (postIndex !== -1) {
        // Update the post with new values
        posts[postIndex].title = req.body.title;
        posts[postIndex].content = req.body.content;
        posts[postIndex].date = new Date(); // Update the date to current date

        // Redirect to home page after editing
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

// Route to handle post deletion
app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(post => post.id !== postId); // Remove the post by filtering out its ID
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
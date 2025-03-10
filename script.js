const postContainer = document.getElementById("post-container");
const userModal = document.getElementById("user-modal");
const userName = document.getElementById("user-name");
const userMail = document.getElementById("user-mail");
const userAddress = document.getElementById("user.address");
const closeModal = document.querySelector(".close");

const API_POSTS = "https://dummyjson.com/posts";
const API_USERS = "https://dummyjson.com/users";
const API_COMMENTS = "https://dummyjson.com/comments";

let usersData = {};

async function fetchUsers() {
    const res = await fetch(API_USERS)
    const data = await res.json();
    usersData = data.users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {})
}

async function fetchPosts(){
    const res = await fetch(API_POSTS)
    const data = await res.json();

    for (let post of data.posts){
        await displayPost(post);
    }
}
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
    const res = await(API_USERS)
}
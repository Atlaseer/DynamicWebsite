const postContainer = document.getElementById("post-container");
const userModal = document.getElementById("user-modal");
const userName = document.getElementById("user-name");
const userMail = document.getElementById("user-email");
const userAddress = document.getElementById("user-address");
const closeModal = document.querySelector(".close");

const API_POSTS = "https://dummyjson.com/posts";
const API_USERS = "https://dummyjson.com/users";
const API_COMMENTS = "https://dummyjson.com/comments";

let usersData = {};

//Fetches users from the API
async function fetchUsers() {
    const res = await fetch(API_USERS)
    const data = await res.json();
    usersData = data.users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {})
}

//Fetches the posts from the API
async function fetchPosts(){
    const res = await fetch(API_POSTS)
    const data = await res.json();

    for (let post of data.posts){
        await displayPosts(post);
    }
}

//Fetches and returns the comments based on post ID
async function fetchComments(postId){
    const res = await fetch(`${API_COMMENTS}/post/${postId}`)
    const data = await res.json();
    return data.comments
}

async function displayPosts(post) {
    const postElement = document.createElement("div");
    postElement.classList.add("post");   

    const comments = await fetchComments(post.id);
    const commentsHTML = comments.map(comment=> `<p> ${comment.body}</p>`).join("")

    const user = usersData[post.userId] || { username: "Unknown" };

    postElement.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.body}</p> 
    <p>Tags: ${post.tags.join(", ")}</p>    
    <p>Reactions:  ${post.reactions}</p>
    <p>By: <span class="user-link" data-userid="${post.userId}">${user.username}</span></p>
    <div class="comments">
    <h4>Comments:</h4>
    ${commentsHTML}
    </div>
    `;

    postContainer.appendChild(postElement);

    //User profile event listener
    postElement.querySelector(".user-link").addEventListener("click", (event)=>{
        const userId = event.target.dataset.userid;
        displayUserProfile(userId);
    });
}

function displayUserProfile(userId){
    const user = usersData[userId];
    if(!user) return;

    userName.innerText = user.firstName+" "+user.lastName;
    userEmail.innerText = user.email;
    userAddress.innerText = `${user.address.address}, ${user.address.city}`;

    userModal.style.display = "block"
}

closeModal.addEventListener("click", ()=>{
    userModal.style.display = "none"
});

async function init(){
    await fetchUsers();
    await fetchPosts();
}

init();
document.addEventListener("DOMContentLoaded", function () {
    // --- POSTS, USERS & COMMENTS LOGIC ---
    const postContainer = document.getElementById("post-container");
    const userModal     = document.getElementById("user-modal");
    const userName      = document.getElementById("user-name");
    const userMail      = document.getElementById("user-email");
    const userAddress   = document.getElementById("user-address");

    const API_POSTS    = "https://dummyjson.com/posts";
    const API_USERS    = "https://dummyjson.com/users";
    const API_COMMENTS = "https://dummyjson.com/comments";

    let usersData = {};

    async function fetchUsers() {
        try {
            const res  = await fetch(API_USERS);
            const data = await res.json();
            usersData = data.users.reduce((acc, u) => {
                acc[u.id] = u;
                return acc;
            }, {});
        } catch (e) { console.error(e); }
    }

    async function fetchComments(postId) {
        try {
            const res  = await fetch(`${API_COMMENTS}/post/${postId}`);
            const data = await res.json();
            return data.comments;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async function displayPost(post) {
        const postEl       = document.createElement("div");
        postEl.classList.add("post");

        const comments       = await fetchComments(post.id);
        const commentsNumber = comments.length;
        const commentsHTML   = commentsNumber === 0
            ? "<p>No comments available</p>"
            : comments.map(c => `<p>${c.body}</p>`).join("");

        const user      = usersData[post.userId] || { username: "Unknown" };
        const reactions = post.reactions?.likes ?? post.reactions ?? "No reactions";

        postEl.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <p>Tags: ${post.tags.join(", ")}</p>
            <p>Reactions: ${reactions}</p>
            <p>By: <span class="user-link" data-userid="${post.userId}">${user.username}</span></p>
            <div class="comments">
                <h4>Number of comments: ${commentsNumber}</h4>
                ${commentsHTML}
            </div>
        `;
        postContainer.appendChild(postEl);

        postEl.querySelector(".user-link").addEventListener("click", e => {
            const u = usersData[e.target.dataset.userid];
            if (!u) return console.error("No user:", e.target.dataset.userid);
            userName.innerText    = `${u.firstName} ${u.lastName}`;
            userMail.innerText    = u.email;
            userAddress.innerText = u.address
                ? `${u.address.address}, ${u.address.city}`
                : "Address not available";
            userModal.style.display = "block";
        });
    }

    async function fetchPosts() {
        try {
            const res  = await fetch(API_POSTS);
            const data = await res.json();
            for (let p of data.posts) {
                await displayPost(p);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function init() {
        await fetchUsers();
        await fetchPosts();
    }
    init();

    //This is the form validation
    const form = document.getElementById("contactForm");
    if (form) {
        const fullName = document.getElementById("fullName");
        const email = document.getElementById("email");
        const confirmCheckbox = document.getElementById("confirm");

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const confirmError = document.getElementById("confirmError");

        // Validation function (can reuse)
        function validateName() {
            if (!fullName.value.trim() || /\d/.test(fullName.value)) {
                nameError.innerText = "Please enter a valid name (no numbers).";
                return false;
            } else {
                nameError.innerText = "";
                return true;
            }
        }

        //Validates email input
        function validateEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                emailError.innerText = "Please enter a valid email address.";
                return false;
            } else {
                emailError.innerText = "";
                return true;
            }
        }

        function validateConfirm() {
            if (!confirmCheckbox.checked) {
                confirmError.innerText = "You must confirm to send.";
                return false;
            } else {
                confirmError.innerText = "";
                return true;
            }
        }

        //This makes the form validate events live
        fullName.addEventListener("input", validateName);
        email.addEventListener("input", validateEmail);
        confirmCheckbox.addEventListener("change", validateConfirm);

        //Submits form
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameValid = validateName();
            const emailValid = validateEmail();
            const confirmValid = validateConfirm();

            //Create response and reset form
            if (nameValid && emailValid && confirmValid) {
                alert("Form submitted successfully!");
                form.reset();
                nameError.innerText = "";
                emailError.innerText = "";
                confirmError.innerText = "";
            }
        });
    }
});

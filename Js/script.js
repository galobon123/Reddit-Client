document.addEventListener("DOMContentLoaded", () => {
    const $search = document.getElementById("search");
    const $plus = document.getElementById("plus");
    const $searchModal = document.getElementById("searchModal");
    const $posts = document.getElementById("posts");
    const $btnAdd = document.getElementById("btnAdd");
    const $subreddit = document.getElementById("subreddit");
    const $refresh = document.getElementById("refresh");
    const $delete = document.getElementById("delete");

    const modal = new bootstrap.Modal($searchModal);
    let refreshSub = "";

    $plus.addEventListener("click", () => {
        modal.show();
    })

    $btnAdd.addEventListener("click", async () => {
        $posts.innerHTML = "";
        try {
            modal.hide();
            if (!$search.value.trim()) return;
            const data = await fetchReddit($search.value);
            loadPosts(data);
            refreshSub = $search.value;
            $search.value = "";

        } catch (err) {
            console.error(err);
        }
    });

    $refresh.addEventListener("click", async () =>{
        if (refreshSub === null || refreshSub.trim() === "") return;
            $posts.innerHTML = "";

            const data = await fetchReddit(refreshSub);
            loadPosts(data);
    })

    $delete.addEventListener("click", () => {
        $posts.innerHTML = "";
        $subreddit.textContent = "SubReddit";
        refreshSub = "";
    })

    function loadPosts(object) {
    object.data.children.forEach(post => {
        const votes = post.data.ups - post.data.downs
        
        $posts.innerHTML += `
            <div class="threads">
                <div class="votes-box">
                    ${votes > 0 
                        ? `<h3 class="up light-up">^</h3>` 
                        : `<h3 class="up light-down">^</h3>`
                    }

                    <h3 class="votes">${votes}</h3>

                    ${votes < 0 
                        ? `<h3 class="down light-up">⌄</h3>` 
                        : `<h3 class="down light-down">⌄</h3>`
                    }
                </div>
                <h2 class="title">${post.data.title}</h2>
                <h5 class="author">${post.data.author}</h5>
            </div>
        `;
    });

    if (object.data.children.length > 0) {
        $subreddit.textContent = object.data.children[0].data.subreddit_name_prefixed;
    }
}
})




async function fetchReddit(subreddit) {
    const url = `https://localhost:7154/api/Reddit?subreddit=${subreddit}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Subreddit no encontrado o error de red");

    const data = await res.json();

    return data;
}
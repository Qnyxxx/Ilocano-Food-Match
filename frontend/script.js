document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preferenceForm");
    const resultCards = document.getElementById("result-cards");
    const dishList = document.getElementById("dish-list");

    // Fetch all dishes from backend
    async function loadAllDishes() {
        try {
            const response = await fetch("http://127.0.0.1:8000/dishes");
            const dishes = await response.json();
            dishList.innerHTML = dishes.map(d => `
                <div class="card">
                    <img src="${d.image_url}" alt="${d.name}">
                    <div class="card-content">
                        <h3>${d.name}</h3>
                        <p>${d.description}</p>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            dishList.innerHTML = "<p>Unable to load dishes.</p>";
        }
    }

    loadAllDishes();

    // Handle form submit
    if (form) {
        form.addEventListener("submit", async e => {
            e.preventDefault();
            const prefs = {
                taste: document.getElementById("taste").value,
                ingredient: document.getElementById("ingredient").value,
                method: document.getElementById("method").value,
                occasion: document.getElementById("occasion").value
            };

            try {
                const response = await fetch("http://127.0.0.1:8000/match", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(prefs)
                });

                const data = await response.json();

                if (data.length === 0) {
                    resultCards.innerHTML = "<p>No match found.</p>";
                    return;
                }

                resultCards.innerHTML = data.map(d => `
                    <div class="card">
                        <img src="${d.image}" alt="${d.name}">
                        <div class="card-content">
                            <h3>${d.name}</h3>
                            <p>${d.description}</p>
                            <p><strong>Score:</strong> ${d.score}</p>
                        </div>
                    </div>
                `).join('');

            } catch (err) {
                resultCards.innerHTML = "<p>Error connecting to backend.</p>";
                console.error(err);
            }
        });
    }
});

const input = document.getElementById("searchBox");
const results = document.getElementById("results");
const colorFilter = document.getElementById("colorFilter");

async function fetchData() {
    const currentText = input.value;
    try {
        console.log(currentText);
        console.log(colorFilter.value);

        const response = await fetch(
            `https://api.scryfall.com/cards/search?q=
            name:${currentText}
            c:${colorFilter.value}
        `);
        

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();

        results.innerHTML = data.data.map(item => `
            <div class="card">
                <h3>${item.name}</h3>
                <img src="${item.image_uris ? item.image_uris.small : item.card_faces[0].image_uris.small}" alt="${item.name}">
                <p>Cost: ${item.mana_cost || "None"}</p>
                <p>Type: ${item.type_line}</p>
            </div>
        `).join('');
    }
    catch (error) {
        console.error(error);
        results.innerHTML = "<p>No cards found.</p>"
    }
}
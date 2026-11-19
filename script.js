const input = document.getElementById("searchBox");
const results = document.getElementById("results");
const colorFilter = document.getElementById("colorFilter");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const resultsText = document.querySelector("#result-section h2");

async function clearResults() {
    input.value = "";
    colorFilter.value = "";
    fetchData();
}

async function fetchData() {
    const currentText = input.value;
    searchButton.disabled = true;
    try {
        let name = currentText ? `name:${currentText}` : "";
        let color = colorFilter.value ? `c:${colorFilter.value}` : "";

        const response = await fetch(
            `https://api.scryfall.com/cards/search?q=${encodeURIComponent(`${name} ${color} unique:prints`)}`
        );

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();

        data.data.sort((a,b) => {
            if (a.name.toLowerCase() === currentText.toLowerCase()) return -1;
            if (b.name.toLowerCase() === currentText.toLowerCase()) return 1;
            return 0;
        })

        resultsText.textContent = `Results (${data.data.length})`;

        results.innerHTML = data.data.map(item => `
            <div class="card ${getCardColorClass(item.mana_cost, item.colors)}">
                <img src="${item.image_uris ? item.image_uris.large : item.card_faces[0].image_uris.large}" alt="${item.name}">
                <h3>${item.name}</h3>
                <div class="card-info">
                    <p><strong>Cost:</strong> ${formatManaCost(item.mana_cost)}</p>
                    <p><strong>Type:</strong> ${item.type_line}</p>
                    <p><strong>Set:</strong> ${item.set_name}</p>
                </div>
            </div>
        `).join('');
    }
    catch (error) {
        console.error(error);
        results.innerHTML = "<p>No cards found.</p>"
        resultsText.textContent = `Results`;
    }
    finally {
        searchButton.disabled = false;
    }
}

/* Prompt: Make a function that converts the mana cost string into the mana symbols from the Scryfall API. */
function formatManaCost(manaCost) {
    if (!manaCost) return "None";

    return manaCost.replace(/\{([^}]+)\}/g, (match, symbol) => {
        return `<img class="mana-symbol" src="https://svgs.scryfall.io/card-symbols/${symbol.replace("/", "")}.svg" alt="${symbol}">`;
    });
}

/* Prompt: Implement a tint on the card background based on the primary color type of the card. Use only the first color for the tint for multicolored cards. */
function getCardColorClass(manaCost, colors) {
    const firstManaColor = manaCost
        ?.match(/\{([^}]+)\}/g)
        ?.map(symbol => symbol.match(/[WUBRG]/)?.[0])
        .find(Boolean);
    const primaryColor = firstManaColor || colors?.[0] || "C";
    return `card--${primaryColor.toLowerCase()}`;
}
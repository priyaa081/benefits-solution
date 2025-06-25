// Create card elements for each benefit in a category
function createCards(categoryName, dataArray, containerId) {
    const container = document.getElementById(containerId);
    dataArray.forEach((item) => {
        const label = document.createElement('label');
        label.className = 'card-option';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = categoryName.toLowerCase(); // e.g. "health"
        radio.dataset.points = item.points;
        radio.dataset.multiplier = item.multiplier;
        label.appendChild(radio);

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${item.name}</h3>
                          <p>${item.details}</p>
                          <p>Points: ${item.points}</p>
                          <p>Multiplier: ${item.multiplier}</p>`;
        label.appendChild(card);

        container.appendChild(label);
    });
}

// Update summary amounts when selection changes
function updateSummary() {
    const wallet = 1400;
    let used = 0;
    ['health', 'life', 'accident'].forEach(cat => {
        const sel = document.querySelector(`input[name=${cat}]:checked`);
        if (sel) {
            used += sel.dataset.points * sel.dataset.multiplier;
        }
    });
    document.getElementById('used-amount').textContent = used;
    const available = Math.max(0, wallet - used);
    document.getElementById('available-amount').textContent = available;
    document.getElementById('you-pay').textContent = used > wallet ? (used - wallet) : 0;
}

// Show final summary on Checkout
function showFinalSummary() {
    const summaryDiv = document.getElementById('final-summary');
    summaryDiv.innerHTML = '<h2>Final Summary</h2>';
    const list = document.createElement('ul');
    ['Health', 'Life', 'Accident'].forEach(category => {
        const sel = document.querySelector(`input[name=${category.toLowerCase()}]:checked`);
        if (sel) {
            const cost = sel.dataset.points * sel.dataset.multiplier;
            const benefitName = sel.nextSibling.querySelector('h3').innerText;
            const li = document.createElement('li');
            li.textContent = `${category}: ${benefitName} – Cost: ${cost}`;
            list.appendChild(li);
        }
    });
    summaryDiv.appendChild(list);
    summaryDiv.style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createCards('Health', healthData, 'health-cards');
    createCards('Life', lifeData, 'life-cards');
    createCards('Accident', accidentData, 'accident-cards');
    document.querySelectorAll('input[type=radio]').forEach(radio => {
        radio.addEventListener('change', updateSummary);
    });
    document.getElementById('checkout').addEventListener('click', showFinalSummary);
    document.getElementById('print-btn').addEventListener('click', () => {
        window.print(); // opens print dialog
    });
});

function createCards(categoryName, dataArray, containerId) {
    const container = document.getElementById(containerId);
    dataArray.forEach(item => {
      const label = document.createElement('label');
      label.className = 'card-option';
  
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = categoryName.toLowerCase();
      radio.dataset.points = item.points;
      radio.dataset.multiplier = item.multiplier;
      label.appendChild(radio);
  
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.details}</p>
        <p>Points: ${item.points}</p>
        <p>Multiplier: ${item.multiplier}</p>
      `;
      label.appendChild(card);
      container.appendChild(label);
    });
  }
  
  function updateSummary() {
    const wallet = 1400;
    let used = 0;
  
    ['health', 'life', 'accident'].forEach(cat => {
      const sel = document.querySelector(`input[name=${cat}]:checked`);
      if (sel) {
        const points = Number(sel.dataset.points);
        const multiplier = Number(sel.dataset.multiplier);
        used += points * multiplier;
      }
    });
  
    document.getElementById('used-amount').textContent = used.toFixed(2);
    const available = Math.max(0, wallet - used);
    const youPay = used > wallet ? (used - wallet) : 0;
  
    document.getElementById('available-amount').textContent = available.toFixed(2);
    document.getElementById('you-pay').textContent = youPay.toFixed(2);
  }
  
  function showFinalSummary() {
    const summaryDiv = document.getElementById('final-summary');
    summaryDiv.innerHTML = `
      <table class="summary-table">
        <thead>
          <tr>
            <th colspan="5" class="header">Flexible Benefits Solution - Invoice</th>
          </tr>
          <tr>
            <th>Benefit</th>
            <th>Description</th>
            <th>Points</th>
            <th>Multiplier</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody id="summary-rows"></tbody>
        <tfoot>
          <tr>
            <td colspan="2"></td>
            <td><strong class="green">Total</strong></td>
            <td></td>
            <td><strong id="total-amount" class="green">0</strong></td>
          </tr>
        </tfoot>
      </table>
    `;
  
    const tbody = document.getElementById('summary-rows');
    let totalAmount = 0;
  
    ['Health', 'Life', 'Accident'].forEach(category => {
      const sel = document.querySelector(`input[name=${category.toLowerCase()}]:checked`);
      if (sel) {
        const points = Number(sel.dataset.points);
        const multiplier = Number(sel.dataset.multiplier);
        const amount = points * multiplier;
        const name = sel.nextSibling.querySelector('h3').innerText;
        const description = sel.nextSibling.querySelector('p').innerText;
  
        totalAmount += amount;
  
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${name}</td>
          <td>${description}</td>
          <td>${points}</td>
          <td>${multiplier}</td>
          <td>${amount.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      }
    });
  
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    summaryDiv.style.display = 'block';
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    createCards('Health', healthData, 'health-cards');
    createCards('Life', lifeData, 'life-cards');
    createCards('Accident', accidentData, 'accident-cards');
  
    document.querySelectorAll('input[type=radio]').forEach(radio => {
      radio.addEventListener('change', updateSummary);
    });
  
    document.getElementById('checkout').addEventListener('click', showFinalSummary);
    document.getElementById('print-btn').addEventListener('click', () => {
      window.print();
    });
  });
  
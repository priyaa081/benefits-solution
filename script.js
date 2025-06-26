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
  let walletRows = '';
  const walletDetails = [];

  ['health', 'life', 'accident'].forEach(cat => {
    const sel = document.querySelector(`input[name=${cat}]:checked`);
    if (sel) {
      const points = Number(sel.dataset.points);
      const multiplier = Number(sel.dataset.multiplier);
      const amount = points * multiplier;
      used += amount;
      walletDetails.push({ points, multiplier, amount });
    }
  });

  walletDetails.forEach(item => {
    walletRows += `<tr>
      <td>${item.points}</td>
      <td>${item.multiplier}</td>
      <td>${item.amount.toFixed(0)}</td>
    </tr>`;
  });

  document.getElementById('wallet-rows').innerHTML = walletRows;
  document.getElementById('wallet-total').textContent = used.toFixed(0);
  document.getElementById('used-amount').textContent = used.toFixed(2);

  const available = Math.max(0, wallet - used);
  document.getElementById('available-amount').textContent = available.toFixed(2);

  const youPay = used > wallet ? used - wallet : 0;
  document.getElementById('you-pay').textContent = youPay.toFixed(2);
}

function showFinalSummary() {
  let summaryHTML = `
    <html>
    <head>
      <title>Flexible Benefits Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 30px;
        }
        .back-link {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 16px;
          font-weight: bold;
          color: #007bff;
          background: none;
          border: none;
          padding: 6px 12px;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .back-link:hover {
          color: #004bb1;
        }
        h2 {
          text-align: center;
          color: #006400;
          margin-top: 60px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
        }
        th.header {
          background-color: #006400;
          color: white;
          font-size: 18px;
        }
        .green {
          color: green;
        }
      </style>
    </head>
    <body>
      <button class="back-link" onclick="window.close()">← Back</button>

      <h2>Flexible Benefits Solution - Invoice</h2>
      <table>
        <thead>
          <tr><th colspan="5" class="header">Invoice</th></tr>
          <tr><th>Benefit</th><th>Description</th><th>Points</th><th>Multiplier</th><th>Amount</th></tr>
        </thead>
        <tbody>
  `;

  let totalAmount = 0;
  let totalPoints = 0;

  ['Health', 'Life', 'Accident'].forEach(category => {
    const sel = document.querySelector(`input[name=${category.toLowerCase()}]:checked`);
    if (sel) {
      const points = Number(sel.dataset.points);
      const multiplier = Number(sel.dataset.multiplier);
      const amount = points * multiplier;
      const name = sel.nextSibling.querySelector('h3').innerText;
      const description = sel.nextSibling.querySelectorAll('p')[0].innerText;

      totalAmount += amount;
      totalPoints += points;

      summaryHTML += `
        <tr>
          <td>${name}</td>
          <td>${description}</td>
          <td>${points}</td>
          <td>${multiplier}</td>
          <td>${amount.toFixed(2)}</td>
        </tr>
      `;
    }
  });

  summaryHTML += `
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td><strong>Total</strong></td>
            <td class="green"><strong>${totalPoints}</strong></td>
            <td></td>
            <td class="green"><strong>${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
    </body>
    </html>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.open();
  newWindow.document.write(summaryHTML);
  newWindow.document.close();
}

document.addEventListener('DOMContentLoaded', () => {
  createCards('Health', healthData, 'health-cards');
  createCards('Life', lifeData, 'life-cards');
  createCards('Accident', accidentData, 'accident-cards');

  document.querySelectorAll('input[type=radio]').forEach(radio => {
    radio.addEventListener('change', updateSummary);
  });

  document.getElementById('checkout').addEventListener('click', showFinalSummary);
});

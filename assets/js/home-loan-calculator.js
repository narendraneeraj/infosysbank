function updateLoanTerm() {
    document.getElementById('loanTermValue').innerText = document.getElementById('loanTerm').value;
}

function calculateLoan() {
    let loanAmount = parseFloat(document.getElementById('loanAmount').value);
    let interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
    let loanTerm = parseFloat(document.getElementById('loanTerm').value) * 12;
    
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm) || loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
        alert("Please enter valid values for loan amount, interest rate, and loan term.");
        return;
    }
    
    let emi = (loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm)) / 
              (Math.pow(1 + interestRate, loanTerm) - 1);
    
    let totalRepayment = emi * loanTerm;
    let totalInterest = totalRepayment - loanAmount;
    
    document.getElementById('monthlyEMI').innerText = emi.toFixed(2);
    document.getElementById('totalRepayment').innerText = totalRepayment.toFixed(2);
    document.getElementById('totalInterest').innerText = totalInterest.toFixed(2);
    
    renderChart(loanAmount, totalInterest);
    generateSchedule(loanAmount, interestRate, loanTerm, emi);
}

function renderChart(principal, interest) {
    let ctx = document.getElementById('loanChart').getContext('2d');
    if (window.loanChartInstance) {
        window.loanChartInstance.destroy();
    }
    window.loanChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Total Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#4CAF50', '#FF5733']
            }]
        }
    });
}

function generateSchedule(loanAmount, interestRate, loanTerm, emi) {
    let tbody = document.getElementById('paymentSchedule');
    tbody.innerHTML = '';
    let balance = loanAmount;
    
    for (let i = 1; i <= loanTerm; i++) {
        let interestForMonth = balance * interestRate;
        let principalForMonth = emi - interestForMonth;
        balance -= principalForMonth;
        let row = `<tr>
            <td>${i}</td>
            <td>${emi.toFixed(2)}</td>
            <td>${Math.max(balance, 0).toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    }
}
// 가문 자산 모의 데이터 (단위: 만원)
const familyData = [
    { name: '아버지', cash: 50000, realEstate: 150000, stocks: 30000 },
    { name: '어머니', cash: 30000, realEstate: 80000, stocks: 20000 },
    { name: '나 (사용자)', cash: 15000, realEstate: 0, stocks: 8000 },
    { name: '동생1', cash: 5000, realEstate: 0, stocks: 2000 },
    { name: '동생2', cash: 3000, realEstate: 0, stocks: 1500 }
];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderTable();
    updateSummary();
    renderCharts();
    setupThemeToggle();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount * 10000) + '원';
}

function updateSummary() {
    const totalAsset = familyData.reduce((acc, cur) => acc + cur.cash + cur.realEstate + cur.stocks, 0);
    const myData = familyData.find(m => m.name.includes('나'));
    const myTotal = myData.cash + myData.realEstate + myData.stocks;
    const myRatio = ((myTotal / totalAsset) * 100).toFixed(1);

    document.getElementById('total-family-asset').textContent = formatCurrency(totalAsset);
    document.getElementById('my-asset-value').textContent = formatCurrency(myTotal);
    document.getElementById('my-ratio').textContent = `${myRatio}%`;
}

function renderTable() {
    const tbody = document.getElementById('asset-table-body');
    tbody.innerHTML = familyData.map(m => {
        const total = m.cash + m.realEstate + m.stocks;
        return `
            <tr>
                <td><strong>${m.name}</strong></td>
                <td>${formatCurrency(m.cash)}</td>
                <td>${formatCurrency(m.realEstate)}</td>
                <td>${formatCurrency(m.stocks)}</td>
                <td><strong>${formatCurrency(total)}</strong></td>
            </tr>
        `;
    }).join('');
}

function renderCharts() {
    const ctxMember = document.getElementById('memberChart').getContext('2d');
    const ctxType = document.getElementById('assetTypeChart').getContext('2d');

    // 구성원별 자산 비중 (Doughnut)
    new Chart(ctxMember, {
        type: 'doughnut',
        data: {
            labels: familyData.map(m => m.name),
            datasets: [{
                data: familyData.map(m => m.cash + m.realEstate + m.stocks),
                backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 자산 유형별 분포 (Pie)
    const totals = familyData.reduce((acc, cur) => {
        acc.cash += cur.cash;
        acc.realEstate += cur.realEstate;
        acc.stocks += cur.stocks;
        return acc;
    }, { cash: 0, realEstate: 0, stocks: 0 });

    new Chart(ctxType, {
        type: 'pie',
        data: {
            labels: ['현금성 자산', '부동산', '주식/채권'],
            datasets: [{
                data: [totals.cash, totals.realEstate, totals.stocks],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    toggleBtn.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        toggleBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i> 테마 전환' : '<i class="fas fa-sun"></i> 테마 전환';
        // Chart.js 테마 대응은 간단히 색상 반전 등으로 추가 가능
    });
}

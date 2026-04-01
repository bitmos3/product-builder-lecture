let familyTree = [
    { id: 'father', name: '아버지', role: '부모', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'mother', name: '어머니', role: '부모', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'me', name: '나 (첫째)', role: '자녀', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'spouse1', name: '첫째 아내(며느리)', role: '배우자', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'child1_1', name: '첫째의 아이1', role: '손주', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'child1_2', name: '첫째의 아이2', role: '손주', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'jisook', name: '지숙 (둘째)', role: '자녀', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'spouse2', name: '지숙 남편(사위)', role: '배우자', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'child2_1', name: '지숙의 아이1', role: '손주', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'child2_2', name: '지숙의 아이2', role: '손주', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'jieun', name: '지은 (셋째)', role: '자녀', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'spouse3', name: '지은 남편(사위)', role: '배우자', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'child3_1', name: '지은의 아이1', role: '손주', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
    { id: 'child3_2', name: '지은의 아이2', role: '손주', assets: { realEstate: 0, cash: 0, stock: 0, debt: 0 } },
];

let selectedMemberId = null;

// DOM Elements
const familyListEl = document.getElementById('family-list');
const dashboardSection = document.getElementById('dashboard-section');
const assetInputSection = document.getElementById('asset-input-section');
const selectedMemberNameEl = document.getElementById('selected-member-name');
const realEstateInput = document.getElementById('realEstate');
const cashInput = document.getElementById('cash');
const stockInput = document.getElementById('stock');
const debtInput = document.getElementById('debt');
const memberNetAssetEl = document.getElementById('member-net-asset');

const totalGrossAssetsEl = document.getElementById('total-gross-assets');
const totalDebtEl = document.getElementById('total-debt');
const totalNetAssetsEl = document.getElementById('total-net-assets');
const assetBarsEl = document.getElementById('asset-bars');

const taxTypeSelect = document.getElementById('tax-type');
const giftTargetWrapper = document.getElementById('gift-target-wrapper');

// Initialize
function init() {
    renderFamilyList();
    updateDashboard();
    setupEventListeners();
}

function renderFamilyList() {
    familyListEl.innerHTML = '';
    familyTree.forEach(member => {
        const li = document.createElement('li');
        li.className = 'family-item';
        if (member.id === selectedMemberId) {
            li.classList.add('active');
        }
        
        const netAsset = calculateNetAsset(member.assets);
        const formattedNet = netAsset > 0 ? (netAsset / 100000000).toFixed(1) + '억' : '0원';
        
        li.innerHTML = `
            <span>${member.name} <small>(${member.role})</small></span>
            <span>${formattedNet}</span>
        `;
        li.onclick = () => selectMember(member.id);
        familyListEl.appendChild(li);
    });
}

function calculateNetAsset(assets) {
    return (assets.realEstate + assets.cash + assets.stock) - assets.debt;
}

function formatMoney(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

function selectMember(id) {
    selectedMemberId = id;
    renderFamilyList();
    
    const member = familyTree.find(m => m.id === id);
    selectedMemberNameEl.textContent = `${member.name} 자산 입력`;
    
    realEstateInput.value = member.assets.realEstate || '';
    cashInput.value = member.assets.cash || '';
    stockInput.value = member.assets.stock || '';
    debtInput.value = member.assets.debt || '';
    
    updateMemberSummary();
    
    dashboardSection.classList.add('hidden');
    assetInputSection.classList.remove('hidden');
}

function showDashboard() {
    selectedMemberId = null;
    renderFamilyList();
    updateDashboard();
    
    assetInputSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function updateMemberSummary() {
    const re = parseInt(realEstateInput.value) || 0;
    const c = parseInt(cashInput.value) || 0;
    const s = parseInt(stockInput.value) || 0;
    const d = parseInt(debtInput.value) || 0;
    
    const net = (re + c + s) - d;
    memberNetAssetEl.textContent = formatMoney(net);
}

function saveAssets() {
    if (!selectedMemberId) return;
    
    const member = familyTree.find(m => m.id === selectedMemberId);
    member.assets.realEstate = parseInt(realEstateInput.value) || 0;
    member.assets.cash = parseInt(cashInput.value) || 0;
    member.assets.stock = parseInt(stockInput.value) || 0;
    member.assets.debt = parseInt(debtInput.value) || 0;
    
    alert(`${member.name}님의 자산이 저장되었습니다.`);
    showDashboard();
}

function updateDashboard() {
    let totalGross = 0;
    let totalDebt = 0;
    
    let membersData = [];

    familyTree.forEach(member => {
        const gross = member.assets.realEstate + member.assets.cash + member.assets.stock;
        const debt = member.assets.debt;
        const net = gross - debt;
        
        totalGross += gross;
        totalDebt += debt;
        
        if (net > 0) {
            membersData.push({ name: member.name, net: net });
        }
    });
    
    const totalNet = totalGross - totalDebt;
    
    totalGrossAssetsEl.textContent = formatMoney(totalGross);
    totalDebtEl.textContent = formatMoney(totalDebt);
    totalNetAssetsEl.textContent = formatMoney(totalNet);
    
    // Render Bars
    assetBarsEl.innerHTML = '';
    if (membersData.length === 0 || totalNet <= 0) {
        assetBarsEl.innerHTML = '<p style="color: #888; text-align: center; padding: 20px 0;">입력된 자산이 없습니다.</p>';
        return;
    }
    
    membersData.sort((a, b) => b.net - a.net);
    const maxNet = membersData[0].net;
    
    membersData.forEach(data => {
        const percentage = (data.net / maxNet) * 100;
        
        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
            <div class="bar-label">${data.name}</div>
            <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="bar-value">${(data.net / 100000000).toFixed(1)}억</div>
        `;
        assetBarsEl.appendChild(row);
    });
}

function setupEventListeners() {
    [realEstateInput, cashInput, stockInput, debtInput].forEach(input => {
        input.addEventListener('input', updateMemberSummary);
    });

    taxTypeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'gift') {
            giftTargetWrapper.style.display = 'block';
        } else {
            giftTargetWrapper.style.display = 'none';
        }
    });
}

// Tax Calculator
function pullParentsAssets() {
    const father = familyTree.find(m => m.id === 'father');
    const mother = familyTree.find(m => m.id === 'mother');
    
    const fNet = calculateNetAsset(father.assets);
    const mNet = calculateNetAsset(mother.assets);
    
    const totalParentsNet = (fNet > 0 ? fNet : 0) + (mNet > 0 ? mNet : 0);
    
    document.getElementById('tax-amount').value = totalParentsNet;
}

function calculateTax() {
    const type = taxTypeSelect.value;
    const amount = parseInt(document.getElementById('tax-amount').value) || 0;
    const target = document.getElementById('gift-target').value;
    
    const resultBox = document.getElementById('tax-result-box');
    const estTaxEl = document.getElementById('estimated-tax');
    const detailEl = document.getElementById('tax-detail');
    
    if (amount <= 0) {
        alert('과세 대상 금액을 입력해주세요.');
        return;
    }
    
    let deduction = 0;
    let baseTaxable = 0;
    let isGenerationSkip = false;
    
    if (type === 'inheritance') {
        // 상속세 간편 계산 (일괄공제 5억 + 배우자공제 최소 5억 = 10억 가정)
        deduction = 1000000000; 
        detailEl.textContent = '적용 공제: 일괄공제 5억 + 배우자공제 5억 = 10억원 (간편 가정)';
    } else if (type === 'gift') {
        // 증여세 공제 한도
        if (target === 'adult_child') { deduction = 50000000; detailEl.textContent = '적용 공제: 성인 자녀 5,000만원'; }
        else if (target === 'minor_child') { deduction = 20000000; detailEl.textContent = '적용 공제: 미성년 자녀 2,000만원'; }
        else if (target === 'spouse') { deduction = 600000000; detailEl.textContent = '적용 공제: 배우자 6억원'; }
        else if (target === 'grandchild') { 
            deduction = 50000000; 
            isGenerationSkip = true;
            detailEl.textContent = '적용 공제: 손주 5,000만원 (세대생략 할증 30% 적용)'; 
        }
    }
    
    baseTaxable = amount - deduction;
    
    if (baseTaxable <= 0) {
        estTaxEl.textContent = '0원 (과세표준 이하)';
        resultBox.style.display = 'block';
        return;
    }
    
    // 세율 구간 적용 (한국 상속/증여세율)
    // 1억 이하: 10%
    // 5억 이하: 20% - 누진공제 1,000만
    // 10억 이하: 30% - 누진공제 6,000만
    // 30억 이하: 40% - 누진공제 1억6,000만
    // 30억 초과: 50% - 누진공제 4억6,000만
    
    let tax = 0;
    if (baseTaxable <= 100000000) {
        tax = baseTaxable * 0.1;
    } else if (baseTaxable <= 500000000) {
        tax = baseTaxable * 0.2 - 10000000;
    } else if (baseTaxable <= 1000000000) {
        tax = baseTaxable * 0.3 - 60000000;
    } else if (baseTaxable <= 3000000000) {
        tax = baseTaxable * 0.4 - 160000000;
    } else {
        tax = baseTaxable * 0.5 - 460000000;
    }
    
    // 세대생략 할증 (손주에게 증여시 30% 할증)
    if (isGenerationSkip) {
        tax = tax * 1.3;
    }
    
    estTaxEl.textContent = formatMoney(tax);
    resultBox.style.display = 'block';
}

init();
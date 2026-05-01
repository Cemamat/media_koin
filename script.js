let totalRolls = 0;
let angkaCount = 0; 
let gambarCount = 0; 
let historyProportion = [];
let historyLabels = [];
let currentChartType = 'bar';

const ctx = document.getElementById('myChart').getContext('2d');
let simulationChart;

function initChart() {
    if(simulationChart) simulationChart.destroy();

    let chartConfig = {
        type: currentChartType,
        data: {
            labels: currentChartType === 'bar' ? ['Angka', 'Gambar'] : historyLabels,
            datasets: [{
                label: currentChartType === 'bar' ? 'Frekuensi' : 'Proporsi Angka',
                data: currentChartType === 'bar' ? [angkaCount, gambarCount] : historyProportion,
                backgroundColor: currentChartType === 'bar' ? ['#9ca3af', '#ef4444'] : 'rgba(59, 130, 246, 0.2)',
                borderColor: currentChartType === 'bar' ? ['#6b7280', '#dc2626'] : '#2563eb',
                borderWidth: 2,
                fill: currentChartType === 'line',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: currentChartType === 'line' 
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: currentChartType === 'bar' ? 'Frekuensi (Jumlah)' : 'Proporsi (Mendekati 0.5)'
                    },
                    max: currentChartType === 'line' ? 1 : undefined
                },
                x: {
                    title: {
                        display: true,
                        text: currentChartType === 'bar' ? 'Sisi Koin' : 'Lemparan ke-n'
                    }
                }
            }
        }
    };

    if(currentChartType === 'line') {
        chartConfig.data.datasets.push({
            label: 'Peluang Teoritik (0.5)',
            data: Array(historyLabels.length).fill(0.5),
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
        });
    }

    simulationChart = new Chart(ctx, chartConfig);
}

function rollCoin() {
    const rollInput = parseInt(document.getElementById('rollInput').value);
    if(isNaN(rollInput) || rollInput < 1) return;

    let newCoinsHTML = '';

    for(let i = 0; i < rollInput; i++) {
        totalRolls++;
        
        const isAngka = Math.random() < 0.5; 
        
        if(isAngka) angkaCount++;
        else gambarCount++;
        
        const animClass = isAngka ? 'spin-angka' : 'spin-gambar';
        const coinBlock = `
            <div class="coin-wrapper">
                <div class="coin-inner ${animClass}">
                    <div class="coin-face coin-angka">1</div>
                    <div class="coin-face coin-gambar">🦁</div>
                </div>
                <div class="roll-label">#${totalRolls}</div>
            </div>
        `;
        
        newCoinsHTML = coinBlock + newCoinsHTML;

        if (totalRolls <= 100 || totalRolls % 10 === 0) {
             historyLabels.push(totalRolls);
             historyProportion.push(angkaCount / totalRolls);
        }
    }
    
    const historyContainer = document.getElementById('coinHistory');
    historyContainer.insertAdjacentHTML('afterbegin', newCoinsHTML);
    
    // Menghapus elemen lama jika melebihi 1000 agar performa HP/PC tetap lancar
    while(historyContainer.children.length > 1000) {
        historyContainer.lastElementChild.remove();
    }

    updateUI();
}

function updateUI() {
    document.getElementById('headsCount').innerText = angkaCount;
    document.getElementById('tailsCount').innerText = gambarCount;
    document.getElementById('totalCountTable').innerText = totalRolls;
    
    let propAngka = totalRolls === 0 ? 0 : (angkaCount / totalRolls);
    let propGambar = totalRolls === 0 ? 0 : (gambarCount / totalRolls);
    
    document.getElementById('headsProp').innerText = propAngka.toFixed(4);
    document.getElementById('tailsProp').innerText = propGambar.toFixed(4);

    initChart();
}

function resetSim() {
    totalRolls = 0; angkaCount = 0; gambarCount = 0;
    historyProportion = []; historyLabels = [];
    document.getElementById('coinHistory').innerHTML = '';
    updateUI();
}

function switchTab(type) {
    currentChartType = type;
    document.getElementById('btnBar').classList.toggle('active', type === 'bar');
    document.getElementById('btnLine').classList.toggle('active', type === 'line');
    initChart();
}

// Inisialisasi awal saat halaman dimuat
initChart();
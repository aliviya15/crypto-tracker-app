
const input     = document.getElementById('coinInput');
const searchBtn = document.getElementById('searchBtn');
const loader    = document.getElementById('loader');
const errorBox  = document.getElementById('errorBox');
const card      = document.getElementById('card');

searchBtn.addEventListener('click', searchCoin);

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    searchCoin();
  }
});

async function searchCoin() {
  
  const coinName = input.value.trim().toLowerCase();

  if (!coinName) return;

  loader.classList.add('visible');
  card.classList.remove('visible');
  errorBox.classList.remove('visible');

  const url = 'https://api.coingecko.com/api/v3/coins/' + coinName;
  const response = await fetch(url);

  if (!response.ok) {
    loader.classList.remove('visible');
    errorBox.textContent = '⚠ Coin not found. Try: bitcoin, ethereum, solana';
    errorBox.classList.add('visible');
    return;
  }

  const data = await response.json();

  const price  = data.market_data.current_price.usd;
  const change = data.market_data.price_change_percentage_24h;
  const high   = data.market_data.high_24h.usd;
  const low    = data.market_data.low_24h.usd;
  const cap    = data.market_data.market_cap.usd;
  const volume = data.market_data.total_volume.usd;

  document.getElementById('coinIcon').src             = data.image.large;
  document.getElementById('coinName').textContent     = data.name;
  document.getElementById('coinSymbol').textContent   = data.symbol.toUpperCase();
  document.getElementById('rankBadge').textContent    = '#' + data.market_cap_rank;
  document.getElementById('coinPrice').textContent    = '$' + price.toLocaleString();

  const changeEl = document.getElementById('priceChange');
  changeEl.textContent = (change >= 0 ? '▲ ' : '▼ ') + Math.abs(change).toFixed(2) + '%';
  changeEl.className   = 'change ' + (change >= 0 ? 'up' : 'down');

  document.getElementById('high24').textContent    = '$' + high.toLocaleString();
  document.getElementById('low24').textContent     = '$' + low.toLocaleString();
  document.getElementById('marketCap').textContent = '$' + (cap / 1e9).toFixed(2) + 'B';
  document.getElementById('volume').textContent    = '$' + (volume / 1e6).toFixed(2) + 'M';

  loader.classList.remove('visible');
  card.classList.add('visible');
}
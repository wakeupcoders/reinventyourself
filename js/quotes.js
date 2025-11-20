// Fetch quotes from Supabase and render them dynamically into the quotes section
(function(){
  const SUPABASE_URL = 'https://wesoxcshofuhvxwqagah.supabase.co/rest/v1/quotes?select=*';
  const SUPABASE_APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';
  const SUPABASE_AUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlc294Y3Nob2Z1aHZ4d3FhZ2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzMwMTgsImV4cCI6MjA3ODI0OTAxOH0.n7lzxLluefKP4lEnCN70Hj9HpjKqCrBkyBWJHjSEb4I';

  // Minimal HTML escape to avoid injecting raw HTML from API
  function escapeHtml(str){
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function createQuoteCard(quoteObj){
    const quote = escapeHtml(quoteObj.quote || '');
    const author = escapeHtml(quoteObj.author || '');
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="ts-blog-thumb shadow p-3 mb-5 bg-white rounded">
        <blockquote style="font-size:1.1rem; font-style:italic;">&ldquo;${quote}&rdquo;</blockquote>
        <footer style="text-align:right; font-weight:bold;">${author ? '&mdash; ' + author : ''}</footer>
      </div>
    `;
    return card;
  }

  document.addEventListener('DOMContentLoaded', function(){
    // 1. For Quote of the Day in About section
    var quoteTextEl = document.getElementById('quote-text');
    var quoteAuthorEl = document.getElementById('quote-author');
    var handledQuoteOfDay = false;
    if (quoteTextEl && quoteAuthorEl) {
      handledQuoteOfDay = true;
      fetch(SUPABASE_URL, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_APIKEY,
          'Authorization': SUPABASE_AUTH,
          'Accept': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        try { console.log('quotes response', data); } catch (e) { /* ignore */ }
        if (!Array.isArray(data) || data.length === 0){
          quoteTextEl.textContent = 'No quotes found.';
          quoteAuthorEl.textContent = '';
          return;
        }
        // Pick a random quote for variety
        var quoteObj = data[Math.floor(Math.random() * data.length)];
        quoteTextEl.textContent = '“' + (quoteObj.quote || '') + '”';
        quoteAuthorEl.textContent = quoteObj.author ? ('- ' + quoteObj.author) : '';
      })
      .catch(err => {
        console.error('Error fetching quotes from Supabase:', err);
        quoteTextEl.textContent = 'Error loading quote.';
        quoteAuthorEl.textContent = '';
      });
    }

    // 2. For legacy/other quotes rows (if present elsewhere)
    var targetRow = document.querySelector('main#ts-content section.ts-block .quotes-row');
    if (!targetRow) {
      targetRow = document.querySelector('main#ts-content #quotes-section .row');
    }
    if (targetRow) {
      targetRow.innerHTML = '';
      fetch(SUPABASE_URL, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_APIKEY,
          'Authorization': SUPABASE_AUTH,
          'Accept': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        try { console.log('quotes response', data); } catch (e) { /* ignore */ }
        if (!Array.isArray(data) || data.length === 0){
          const msg = document.createElement('div');
          msg.className = 'col-12';
          msg.innerHTML = '<p>No quotes found.</p>';
          targetRow.appendChild(msg);
          return;
        }
        data.forEach(quoteObj => {
          const card = createQuoteCard(quoteObj);
          targetRow.appendChild(card);
        });
      })
      .catch(err => {
        console.error('Error fetching quotes from Supabase:', err);
        const msg = document.createElement('div');
        msg.className = 'col-12';
        msg.innerHTML = '<p>Error loading quotes.</p>';
        targetRow.appendChild(msg);
      });
    }
  });
})();

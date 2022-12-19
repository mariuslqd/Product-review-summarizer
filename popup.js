const apiKey = "PUT YOUR API KEY HERE";

const summarizeButton = document.getElementById('summarize-button');
const summaryDiv = document.getElementById('summary');



summarizeButton.addEventListener('click', async () => {
  // Fetch the URL of the current tab
  const currentTab = await getCurrentTab();
  const url = currentTab.url;

  // Call the GPT-3 API to summarize the reviews
  const summary = await summarizeReviews(url);

  // Delete all previous Text
  summaryDiv.innerHTML = '';

  // Display the summary in the UI
  const summaryContent = summary.split('\n');
  
  summaryContent.forEach(content => {
    if (content.includes(':')) {
      const h2 = document.createElement('h2');
      h2.textContent = content;
      summaryDiv.appendChild(h2);
    } else {
      const p = document.createElement('p');
      p.textContent = content;
      summaryDiv.appendChild(p);
    }
  });
});

async function getCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      resolve(tabs[0]);
    });
  });
}

async function summarizeReviews(reviews) {
  // Use the GPT-3 Completion API to summarize the reviews
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: `Please summarize all the positive and negative reviews of this amazon product, without naming it as bullet points: ${reviews}`,
      model: 'text-davinci-003',
      max_tokens: 256,
      temperature: 0.7,
      top_p: 1
    })
  });
  const data = await response.json();
  return data.choices[0].text;
}
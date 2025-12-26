// check-models.js
const https = require('https');

// 🔴 PASTE YOUR NEW API KEY HERE DIRECTLY
const apiKey = 'AIzaSyA7ciqqumtFFaN5zgRQq-g5mrBiImLP72k'; 

if (!apiKey || apiKey === 'PASTE_YOUR_NEW_API_KEY_HERE') {
    console.error("❌ Please paste your API key inside the script first!");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`🔍 Checking available models for key: ${apiKey.substring(0, 10)}...`);

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const response = JSON.parse(data);
    if (response.error) {
        console.error("❌ API Error:", response.error.message);
    } else {
        console.log("\n✅ SUCCESS! YOUR AVAILABLE MODELS:");
        console.log("---------------------------------");
        response.models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                console.log(`🌟 ${m.name.replace('models/', '')}`);
            }
        });
        console.log("---------------------------------");
        console.log("👉 Pick one of these names for your chat code!");
    }
  });
}).on('error', (e) => {
  console.error("Connection error:", e);
});
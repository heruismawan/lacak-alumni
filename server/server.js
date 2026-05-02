const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Root route for server status check
app.get('/', (req, res) => {
    res.send('<h1>🚀 Backend Alumni Tracker is Running</h1><p>Use <code>/api/fetch-alumni?query=...</code> to fetch data.</p>');
});

const CSV_FILE = path.join(__dirname, 'Alumni 2000-2025.csv');

/**
 * STEP 1: Search in CSV Database
 */
async function searchAlumniCSV(query) {
    return new Promise((resolve, reject) => {
        const results = [];
        if (!fs.existsSync(CSV_FILE)) {
            return reject(new Error('CSV file not found'));
        }

        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', (data) => {
                const nameMatch = data['Nama Lulusan'] && data['Nama Lulusan'].toLowerCase().includes(query.toLowerCase());
                const nimMatch = data['NIM'] && data['NIM'].includes(query);
                if (nameMatch || nimMatch) {
                    results.push(data);
                }
            })
            .on('end', () => {
                resolve(results[0] || null); // Return first exact or partial match
            })
            .on('error', (err) => reject(err));
    });
}

/**
 * STEP 2: OSINT Enrichment via SerpApi (Google Search)
 */
async function enrichData(name, prodi, fakultas) {
    const context = "Universitas Muhammadiyah Malang";
    // Construct multiple queries for better coverage
    const queries = [
        `${name} ${prodi} ${context} LinkedIn`,
        `${name} ${prodi} ${context} Instagram`,
        `${name} ${prodi} ${context} Facebook`
    ];

    const data = {
        linkedin: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        email: '',
        phone: '',
        workPlace: '',
        workAddress: '',
        position: '',
        jobStatus: 'Swasta',
        workSocial: ''
    };

    if (!process.env.SERPAPI_KEY || process.env.SERPAPI_KEY === 'your_serpapi_key_here') {
        console.warn('SerpApi Key is missing. Skipping real OSINT fetch.');
        return data;
    }

    try {
        // We just do one comprehensive search to save credits
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                q: `${name} ${prodi} ${context}`,
                api_key: process.env.SERPAPI_KEY,
                engine: 'google',
                num: 10
            }
        });

        const results = response.data.organic_results || [];
        
        results.forEach(res => {
            const link = res.link.toLowerCase();
            if (link.includes('linkedin.com/in/')) data.linkedin = res.link;
            if (link.includes('instagram.com/')) data.instagram = res.link;
            if (link.includes('facebook.com/')) data.facebook = res.link;
            if (link.includes('tiktok.com/')) data.tiktok = res.link;

            // Try to extract workplace/position from snippet
            // Common pattern: "Position at Workplace" or "Workplace · Position"
            const snippet = res.snippet || "";
            if (snippet) {
                // Heuristic for position and workplace
                const atMatch = snippet.match(/(.+)\s+(?:at|di|@)\s+([^.-]+)/i);
                if (atMatch && !data.workPlace) {
                    data.position = atMatch[1].trim();
                    data.workPlace = atMatch[2].trim();
                }
                
                // If we found a workplace, try to classify job status
                if (data.workPlace) {
                    const wp = data.workPlace.toLowerCase();
                    if (wp.includes('dinas') || wp.includes('kementerian') || wp.includes('pns') || wp.includes('bumn') || wp.includes('negeri')) {
                        data.jobStatus = 'PNS';
                    } else if (wp.includes('owner') || wp.includes('founder') || wp.includes('ceo') || wp.includes('toko') || wp.includes('usaha')) {
                        data.jobStatus = 'Wirausaha';
                    }
                }
            }
        });

        // Search for workplace social/website if workplace was found
        if (data.workPlace) {
            data.workSocial = `https://www.google.com/search?q=${encodeURIComponent(data.workPlace)}`;
        }

    } catch (e) {
        console.error('Error during enrichment:', e.message);
    }

    return data;
}

/**
 * Main API Endpoint
 */
app.get('/api/fetch-alumni', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, error: 'Query parameter is required' });

    console.log(`Searching for: ${query}`);

    try {
        // Step 1: Internal DB Check
        const alumni = await searchAlumniCSV(query);
        if (!alumni) {
            return res.status(404).json({ success: false, error: 'Alumni not found in CSV database' });
        }

        // Step 2: Real Data Enrichment
        console.log(`Alumni found: ${alumni['Nama Lulusan']}. Fetching OSINT data...`);
        const enriched = await enrichData(
            alumni['Nama Lulusan'],
            alumni['Program Studi'],
            alumni['Fakultas']
        );

        // Merge results
        const finalData = {
            success: true,
            data: {
                name: alumni['Nama Lulusan'],
                nim: alumni['NIM'],
                tahunMasuk: alumni['Tahun Masuk'],
                tanggalLulus: alumni['Tanggal Lulus'],
                fakultas: alumni['Fakultas'],
                prodi: alumni['Program Studi'],
                ...enriched
            }
        };

        res.json(finalData);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Backend Alumni Tracker running at http://localhost:${PORT}`);
});

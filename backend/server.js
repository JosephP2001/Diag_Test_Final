// server.js - Backend API Server + Servir Frontend
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

//  As  frontend

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/main.html'));
});


// --- API route ---

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';

// Route 1: Get a random Pokémon
app.get('/api/pokemon/random', async (req, res) => {
    try {
        const randomId = Math.floor(Math.random() * 150) + 1;
        const response = await fetch(`${POKEAPI_URL}/${randomId}`);
        if (!response.ok) throw new Error('Pokémon not found');

        const pokemon = await response.json();
        res.json({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork'].front_default,
            types: pokemon.types.map(t => t.type.name),
            height: pokemon.height / 10,
            weight: pokemon.weight / 10,
            baseExperience: pokemon.base_experience
        });
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        res.status(500).json({ error: 'Failed to fetch Pokémon' });
    }
});

// Route 2: Get a specific Pokémon by ID
app.get('/api/pokemon/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`${POKEAPI_URL}/${id}`);
        if (!response.ok) throw new Error('Pokémon not found');

        const pokemon = await response.json();
        res.json({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork'].front_default,
            types: pokemon.types.map(t => t.type.name),
            height: pokemon.height / 10,
            weight: pokemon.weight / 10,
            baseExperience: pokemon.base_experience
        });
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
        res.status(500).json({ error: 'Failed to fetch Pokémon' });
    }
});

// Route 3: Get multiple random Pokémon for table
app.get('/api/pokemon/list/:count', async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 5;
        const promises = [];

        for (let i = 0; i < count; i++) {
            const randomId = Math.floor(Math.random() * 150) + 1;
            promises.push(fetch(`${POKEAPI_URL}/${randomId}`).then(r => r.json()));
        }

        const pokemons = await Promise.all(promises);
        const cleanedData = pokemons.map(pokemon => ({
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types.map(t => t.type.name),
            height: pokemon.height / 10
        }));

        res.json(cleanedData);
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
        res.status(500).json({ error: 'Failed to fetch Pokémon list' });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});


// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Backend server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 API endpoints available at http://0.0.0.0:${PORT}/api/`);
});


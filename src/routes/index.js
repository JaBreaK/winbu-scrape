const express = require('express');
const router = express.Router();
const { cacheMiddleware } = require('../utils/cache');

// Import scrapers
const { scrapeHome } = require('../scrapers/home.scraper');
const { scrapeAnimeDetail, scrapeSeriesDetail, scrapeFilmDetail } = require('../scrapers/detail.scraper');
const { scrapeEpisode, getServerEmbed } = require('../scrapers/episode.scraper');
const { scrapeAnimeDonghua, scrapeFilm, scrapeSeries, scrapeTVShow, scrapeOthers } = require('../scrapers/pagination.scraper');
const { searchContent } = require('../scrapers/search.scraper');
const { scrapeGenres, scrapeGenreContent } = require('../scrapers/genre.scraper');
const { scrapeCatalog } = require('../scrapers/catalog.scraper');


/**
 * GET /api/home
 * Get home page data with all sections
 * Cache: 30 minutes
 */
router.get('/home', cacheMiddleware(1800), async (req, res) => {
    try {
        const data = await scrapeHome();
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        console.error("Error scraping home:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

/**
 * GET /api/search?q=keyword&page=X
 * Search for content by keyword
 * Cache: 5 minutes
 */
router.get('/search', cacheMiddleware(300), async (req, res) => {
    try {
        const query = req.query.q || req.query.s || '';
        const page = parseInt(req.query.page) || 1;

        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Query parameter required',
                example: '/api/search?q=naruto&page=1'
            });
        }

        const result = await searchContent(query, page);
        res.status(200).json({
            status: 'success',
            ...result
        });
    } catch (error) {
        console.error("Error search:", error.message);
        res.status(500).json({ message: 'Gagal melakukan pencarian.' });
    }
});

/**
 * GET /api/anime/:id
 * Get anime detail by ID
 * Cache: 1 hour
 */
router.get('/anime/:id', cacheMiddleware(3600), async (req, res) => {
    try {
        const data = await scrapeAnimeDetail(req.params.id);
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        console.error("Error anime detail:", error.message);
        res.status(500).json({ message: 'Gagal mengambil detail anime.' });
    }
});

/**
 * GET /api/series/:id
 * Get series detail by ID
 * Cache: 1 hour
 */
router.get('/series/:id', cacheMiddleware(3600), async (req, res) => {
    try {
        const data = await scrapeSeriesDetail(req.params.id);
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        console.error("Error series detail:", error.message);
        res.status(500).json({ message: 'Gagal mengambil detail series.' });
    }
});

/**
 * GET /api/film/:id
 * Get film detail by ID
 * Cache: 1 hour
 */
router.get('/film/:id', cacheMiddleware(3600), async (req, res) => {
    try {
        const data = await scrapeFilmDetail(req.params.id);
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        console.error("Error film detail:", error.message);
        res.status(500).json({ message: 'Gagal mengambil detail film.' });
    }
});

/**
 * GET /api/episode/:id
 * Get episode detail and stream options
 * Cache: 1 hour
 */
router.get('/episode/:id', cacheMiddleware(3600), async (req, res) => {
    try {
        const data = await scrapeEpisode(req.params.id);
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (error) {
        console.error("Error episode:", error.message);
        res.status(500).json({ message: 'Gagal mengambil detail episode.' });
    }
});

/**
 * GET /api/server/:id
 * Get video embed source from server
 * Cache: 1 hour (links might expire, but 1 hour is usually safe)
 */
router.get('/server/:id', cacheMiddleware(3600), async (req, res) => {
    const { nume, type } = req.query;

    if (!nume || !type) {
        return res.status(400).json({
            message: 'Parameter nume dan type wajib ada di query string.',
            example: `/api/server/${req.params.id}?nume=1&type=schtml`
        });
    }

    try {
        const data = await getServerEmbed(req.params.id, nume, type);
        res.set('Content-Type', 'text/html');
        res.send(data);
    } catch (error) {
        console.error("Error server:", error.message);
        res.status(500).json({ message: 'Gagal mengambil source video.' });
    }
});

/**
 * GET /api/animedonghua?page=X
 * Get anime donghua list with pagination
 * Cache: 30 minutes
 */
router.get('/animedonghua', cacheMiddleware(1800), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await scrapeAnimeDonghua(page);
        res.status(200).json({
            status: 'success',
            ...result
        });
    } catch (error) {
        console.error("Error animedonghua:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

/**
 * GET /api/film?page=X
 * Get film list with pagination
 * Cache: 30 minutes
 */
router.get('/film', cacheMiddleware(1800), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await scrapeFilm(page);
        res.status(200).json({
            status: 'success',
            ...result
        });
    } catch (error) {
        console.error("Error film list:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

/**
 * GET /api/series?page=X
 * Get series list with pagination
 * Cache: 30 minutes
 */
router.get('/series', cacheMiddleware(1800), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await scrapeSeries(page);
        res.status(200).json({
            status: 'success',
            ...result
        });
    } catch (error) {
        console.error("Error series list:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

/**
 * GET /api/others?page=X
 * Get Jepang Korea China Barat list with pagination
 * Cache: 30 minutes
 */
router.get('/others', cacheMiddleware(1800), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await scrapeOthers(page);
        res.status(200).json({
            status: 'success',
            ...result
        });
    } catch (error) {
        console.error("Error others list:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

/**
 * GET /api/tvshow?page=X
 * Get TV show list with pagination
 * Cache: 30 minutes
 */
router.get('/tvshow', cacheMiddleware(1800), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await scrapeTVShow(page);
        res.status(200).json({
            status: 'success',
            ...result
        });
    } catch (error) {
        console.error("Error tvshow list:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

/**
 * GET /api/genres
 * Get list of all available genres
 * Cache: 24 hours (rarely changes)
 */
router.get('/genres', cacheMiddleware(86400), async (req, res) => {
    try {
        const genres = await scrapeGenres();
        res.status(200).json({
            status: 'success',
            data: genres
        });
    } catch (error) {
        console.error("Error scraping genres:", error.message);
        res.status(500).json({ message: 'Gagal scraping genres.' });
    }
});

/**
 * GET /api/genre/:slug?page=X
 * Get content filtered by genre
 * Cache: 1 hour
 */
router.get('/genre/:slug', cacheMiddleware(3600), async (req, res) => {
    try {
        const { slug } = req.params;
        const page = parseInt(req.query.page) || 1;

        const data = await scrapeGenreContent(slug, page);
        res.status(200).json({
            status: 'success',
            ...data
        });
    } catch (error) {
        console.error(`Error scraping genre content:`, error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

/**
 * GET /api/catalog
 * Get catalog content with filters
 * Cache: 15 minutes (dynamic filters)
 */
router.get('/catalog', cacheMiddleware(900), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const filters = {
            title: req.query.title,
            status: req.query.status,
            type: req.query.type,
            order: req.query.order,
            genre: req.query.genre
        };

        const result = await scrapeCatalog(page, filters);
        res.status(200).json({
            status: 'success',
            ...result
        });
    } catch (error) {
        console.error("Error scraping catalog:", error.message);
        res.status(500).json({ message: 'Gagal scraping catalog.' });
    }
});

module.exports = router;


const express = require('express');
const cors = require('cors');

const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = 3000;

app.use(cors());
function parseLink(url) {
    if (!url) return { type: null, id: null, original: null };
    const parts = url.split('/').filter(Boolean);
    const id = parts.pop();
    const type = parts.pop();
    return { slug: type, id: id, original: url };
}

app.get('/api/home', async (req, res) => {
    try {
        const url = 'https://winbu.tv/';

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const top10AnimeList = [];
        const top10FilmList = [];
        const animeTerbaruList = [];
        const latestFilmList = [];
        const jepangKoreaChinaBaratList = [];
        const tvShowList = [];

        $('.movies-list-wrap').each((index, section) => {
            const sectionTitle = $(section).find('.list-title h2').text().trim();


            if (sectionTitle.includes('Top 10')) {
                let targetArray = null;
                if (sectionTitle.includes('Series')) targetArray = top10AnimeList;
                else if (sectionTitle.includes('Movies') || sectionTitle.includes('Film')) targetArray = top10FilmList;

                if (targetArray) {
                    $(section).find('.ml-item-potrait').slice(0, 10).each((i, element) => {
                        const title = $(element).find('.judul').text().trim();
                        const rawLink = $(element).find('a.ml-mask').attr('href');
                        const linkData = parseLink(rawLink);
                        const image = $(element).find('img.mli-thumb').attr('src');
                        const rating = $(element).find('.mli-mvi').text().trim();
                        const rank = $(element).find('.mli-topten b').text().trim();

                        if (title) {
                            targetArray.push({
                                rank, title, rating, image,
                                type: linkData.slug,
                                id: linkData.id,
                                link: linkData.original
                            });
                        }
                    });
                }
            }
            else if (sectionTitle.includes('Anime Donghua') || sectionTitle.includes('Latest')) {


                $(section).find('.ml-item')
                    .each((i, element) => {
                        const title = $(element).find('.judul').text().trim();
                        const rawLink = $(element).find('a.ml-mask').attr('href');
                        const linkData = parseLink(rawLink);
                        const image = $(element).find('img.mli-thumb').attr('src');
                        const episode = $(element).find('.mli-episode').text().trim();
                        const time = $(element).find('.mli-waktu').text().trim();
                        const views = $(element).find('.mli-mvi').text().trim();

                        if (title) {
                            animeTerbaruList.push({
                                title,
                                episode,
                                time,
                                views,
                                image,
                                type: linkData.slug,
                                id: linkData.id,
                                link: linkData.original
                            });
                        }
                    });
            }
            else if (sectionTitle.includes('Film Terbaru') || sectionTitle.includes('Latest')) {


                $(section).find('.ml-item')
                    .each((i, element) => {
                        const title = $(element).find('.judul').text().trim();
                        const rawLink = $(element).find('a.ml-mask').attr('href');
                        const linkData = parseLink(rawLink);
                        const image = $(element).find('img.mli-thumb').attr('src');
                        const time = $(element).find('.mli-waktu').text().trim();
                        const views = $(element).find('.mli-info .mli-mvi').text().trim();

                        if (title) {
                            latestFilmList.push({
                                title,
                                time,
                                views,
                                image,
                                type: linkData.slug,
                                id: linkData.id,
                                link: linkData.original
                            });
                        }
                    });
            }
            else if (sectionTitle.includes('Jepang Korea China Barat') || sectionTitle.includes('Latest')) {


                $(section).find('.ml-item')
                    .each((i, element) => {
                        const title = $(element).find('.judul').text().trim();
                        const rawLink = $(element).find('a.ml-mask').attr('href');
                        const linkData = parseLink(rawLink);
                        const image = $(element).find('img.mli-thumb').attr('src');
                        const episode = $(element).find('.mli-episode').text().trim();
                        const time = $(element).find('.mli-waktu').text().trim();
                        const views = $(element).find('.mli-info .mli-mvi').text().trim();

                        if (title) {
                            jepangKoreaChinaBaratList.push({
                                title,
                                episode,
                                time,
                                views,
                                image,
                                type: linkData.slug,
                                id: linkData.id,
                                link: linkData.original
                            });
                        }
                    });
            }
            else if (sectionTitle.includes('TV Show') || sectionTitle.includes('Latest')) {


                $(section).find('.ml-item')
                    .each((i, element) => {
                        const title = $(element).find('.judul').text().trim();
                        const rawLink = $(element).find('a.ml-mask').attr('href');
                        const linkData = parseLink(rawLink);
                        const image = $(element).find('img.mli-thumb').attr('src');
                        const episode = $(element).find('.mli-episode').text().trim();
                        const time = $(element).find('.mli-waktu').text().trim();
                        const views = $(element).find('.mli-info .mli-mvi').text().trim();

                        if (title) {
                            tvShowList.push({
                                title,
                                episode,
                                time,
                                views,
                                image,
                                type: linkData.slug,
                                id: linkData.id,
                                link: linkData.original
                            });
                        }
                    });
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                top10_anime: top10AnimeList,
                latest_anime: animeTerbaruList,
                top10_film: top10FilmList,
                latest_film: latestFilmList,
                jepang_korea_china_barat: jepangKoreaChinaBaratList,
                tv_show: tvShowList,
            }
        });

    } catch (error) {
        console.error("Error scraping:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});


app.get('/api/anime/:id', async (req, res) => {
    const animeId = req.params.id; 
    const url = `https://winbu.tv/anime/${animeId}/`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const title = $('div.mli-info .judul').text().trim();
        const image = $('.mli-thumb-box img').attr('src');

        const synopsis = $('.mli-desc').text().trim();

        let rating = '-';
        let season = '-';
        let genres = [];
        $('.mli-mvi').each((i, el) => {
            const text = $(el).text();

            if (text.includes('Rating')) {
                rating = $(el).find('span[itemprop="ratingValue"]').text().trim();
            } else if (text.includes('Genre')) {
                $(el).find('a').each((j, a) => {
                    genres.push({
                        name: $(a).text().trim(),
                        url: $(a).attr('href')
                    });
                });
            } else if ($(el).find('a[rel="tag"]').length > 0 && !text.includes('Genre')) {
                season = $(el).find('a').text().trim();
            }
        });
        const episodeList = [];
        $('.tvseason .les-content a').each((i, el) => {
            const epTitle = $(el).text().trim();
            const epUrl = $(el).attr('href');

            const epData = parseLink(epUrl);

            episodeList.push({
                title: epTitle,
                id: epData.id,
                link: epUrl
            });
        });

        const recommendations = [];
        $('.rekom .ml-item-rekom').each((i, element) => {
            const recTitle = $(element).find('.judul').text().trim();
            const recLink = $(element).find('a.ml-mask').attr('href');
            const recImage = $(element).find('img.mli-thumb').attr('src');
            const recRating = $(element).find('.mli-mvi').text().trim();

            const recData = parseLink(recLink);

            if (recTitle) {
                recommendations.push({
                    title: recTitle,
                    rating: recRating,
                    image: recImage,
                    type: recData.slug,
                    id: recData.id,
                    link: recLink
                });
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                title,
                image,
                synopsis,
                info: {
                    rating,
                    season,
                    genres
                },
                episodes: episodeList,
                recommendations: recommendations
            }
        });

    } catch (error) {
        console.error("Error Detail:", error.message);
        res.status(500).json({ message: 'Gagal mengambil detail anime.' });
    }
});

app.get('/api/series/:id', async (req, res) => {
    const seriesId = req.params.id;
    const url = `https://winbu.tv/series/${seriesId}/`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const title = $('div.mli-info .judul').text().trim();
        const image = $('.mli-thumb-box img').attr('src');

        const synopsis = $('.mli-desc').text().trim();

        let rating = '-';
        let season = '-';
        let genres = [];

        $('.mli-mvi').each((i, el) => {
            const text = $(el).text();

            if (text.includes('Rating')) {
                rating = $(el).find('span[itemprop="ratingValue"]').text().trim();
            } else if (text.includes('Genre')) {
                $(el).find('a').each((j, a) => {
                    genres.push({
                        name: $(a).text().trim(),
                        url: $(a).attr('href')
                    });
                });
            } else if ($(el).find('a[rel="tag"]').length > 0 && !text.includes('Genre')) {
                season = $(el).find('a').text().trim();
            }
        });

        const episodeList = [];
        $('.tvseason .les-content a').each((i, el) => {
            const epTitle = $(el).text().trim();
            const epUrl = $(el).attr('href');


            const epData = parseLink(epUrl);

            episodeList.push({
                title: epTitle,
                id: epData.id,
                link: epUrl
            });
        });

        const recommendations = [];
        $('.rekom .ml-item-rekom').each((i, element) => {
            const recTitle = $(element).find('.judul').text().trim();
            const recLink = $(element).find('a.ml-mask').attr('href');
            const recImage = $(element).find('img.mli-thumb').attr('src');
            const recRating = $(element).find('.mli-mvi').text().trim();

            const recData = parseLink(recLink);

            if (recTitle) {
                recommendations.push({
                    title: recTitle,
                    rating: recRating,
                    image: recImage,
                    type: recData.slug, 
                    id: recData.id,
                    link: recLink
                });
            }
        });

        
        res.status(200).json({
            status: 'success',
            data: {
                title,
                image,
                synopsis,
                info: {
                    rating,
                    season,
                    genres
                },
                episodes: episodeList,
                recommendations: recommendations
            }
        });

    } catch (error) {
        console.error("Error Detail:", error.message);
        res.status(500).json({ message: 'Gagal mengambil detail anime.' });
    }
});

app.get('/api/film/:id', async (req, res) => {
    const filmId = req.params.id; 
    const url = `https://winbu.tv/film/${filmId}/`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        
        const title = $('div.mli-info .judul').text().trim();
        const image = $('.mli-thumb-box img').attr('src');

        
        const synopsis = $('.mli-desc').text().trim();

        
        let rating = '-';
        let season = '-';
        let genres = [];

        
        $('.mli-mvi').each((i, el) => {
            const text = $(el).text();

            if (text.includes('Rating')) {
                rating = $(el).find('span[itemprop="ratingValue"]').text().trim();
            } else if (text.includes('Genre')) {
                $(el).find('a').each((j, a) => {
                    genres.push({
                        name: $(a).text().trim(),
                        url: $(a).attr('href')
                    });
                });
            }
        });



        
        const recommendations = [];
        $('.rekom .ml-item-rekom').each((i, element) => {
            const recTitle = $(element).find('.judul').text().trim();
            const recLink = $(element).find('a.ml-mask').attr('href');
            const recImage = $(element).find('img.mli-thumb').attr('src');
            const recRating = $(element).find('.mli-mvi').text().trim();

            const recData = parseLink(recLink);

            if (recTitle) {
                recommendations.push({
                    title: recTitle,
                    rating: recRating,
                    image: recImage,
                    type: recData.slug, 
                    id: recData.id,
                    link: recLink
                });
            }
        });

        const downloadLinks = [];
        $('.download-eps ul li').each((i, li) => {
            const resolution = $(li).find('strong').text().trim(); 
            const links = [];

            $(li).find('span a').each((j, a) => {
                links.push({
                    server: $(a).text().trim(),
                    url: $(a).attr('href')
                });
            });

            if (resolution) {
                downloadLinks.push({
                    resolution,
                    links
                });
            }
        });

        
        const streamOptions = {};

$('.player-modes .dropdown').each((i, dropdown) => {
    const resolution = $(dropdown).find('button').text().trim(); // misal "360p"

    // jika belum ada, buat array baru untuk resolution itu
    if (!streamOptions[resolution]) {
        streamOptions[resolution] = [];
    }

    // ambil semua server untuk resolution ini
    $(dropdown).find('.east_player_option').each((j, el) => {
        const serverName = $(el).find('span').text().trim();
        const post = $(el).attr('data-post');
        const nume = $(el).attr('data-nume');
        const type = $(el).attr('data-type');

        streamOptions[resolution].push({
            server: serverName,
            data_post: post,
            data_nume: nume,
            data_type: type
        });
    });
});

       
        res.status(200).json({
            status: 'success',
            data: {
                title,
                image,
                synopsis,
                downloads: downloadLinks,
                stream_options: streamOptions,
                info: {
                    rating,
                    genres
                },
                recommendations: recommendations
            }
        });

    } catch (error) {
        console.error("Error Detail:", error.message);
        res.status(500).json({ message: 'Gagal mengambil detail anime.' });
    }
});


app.get('/api/episode/:id', async (req, res) => {
    const episodeId = req.params.id;
    const url = `https://winbu.tv/${episodeId}/`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const title = $('.list-title h2').first().text().trim();

       
        const downloadLinks = [];
        $('.download-eps ul li').each((i, li) => {
            const resolution = $(li).find('strong').text().trim(); 
            const links = [];

            $(li).find('span a').each((j, a) => {
                links.push({
                    server: $(a).text().trim(),
                    url: $(a).attr('href')
                });
            });

            if (resolution) {
                downloadLinks.push({
                    resolution,
                    links
                });
            }
        });

        
        const streamOptions = {};

$('.player-modes .dropdown').each((i, dropdown) => {
    const resolution = $(dropdown).find('button').text().trim(); // misal "360p"

    // jika belum ada, buat array baru untuk resolution itu
    if (!streamOptions[resolution]) {
        streamOptions[resolution] = [];
    }

    // ambil semua server untuk resolution ini
    $(dropdown).find('.east_player_option').each((j, el) => {
        const serverName = $(el).find('span').text().trim();
        const post = $(el).attr('data-post');
        const nume = $(el).attr('data-nume');
        const type = $(el).attr('data-type');

        streamOptions[resolution].push({
            server: serverName,
            data_post: post,
            data_nume: nume,
            data_type: type
        });
    });
});




        res.status(200).json({
            status: 'success',
            data: {
                title,
                downloads: downloadLinks,
                stream_options: streamOptions,
                note: "Untuk mendapatkan link embed asli, lakukan GET request ke /api/server/:id dengan query params nume dan type"
            }
        });

    } catch (error) {
        console.error("Error Episode:", error.message);
        res.status(500).json({ message: 'Gagal mengambil detail episode.' });
    }
});


app.get('/api/server/:id', async (req, res) => {
    
    const postId = req.params.id;
    const { nume, type } = req.query;

    if (!nume || !type) {
        return res.status(400).json({
            message: 'Parameter nume dan type wajib ada di query string.',
            example: `/api/server/${postId}?nume=1&type=schtml`
        });
    }

    try {
        const params = new URLSearchParams();
        params.append('action', 'player_ajax');
        params.append('post', postId);
        params.append('nume', nume);
        params.append('type', type);

        const response = await axios.post('https://winbu.tv/wp-admin/admin-ajax.php', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': 'https://winbu.tv',
                'Referer': 'https://winbu.tv/'
            }
        });
        res.set('Content-Type', 'text/html');
        res.send(response.data);

    } catch (error) {
        console.error("Error Server:", error.message);
        res.status(500).json({ message: 'Gagal mengambil source video.' });
    }
});

app.get('/api/animedonghua', async (req, res) => {
    try {
        // Ambil nomor halaman dari query, default = 1
        const page = parseInt(req.query.page) || 1;

        // URL dengan pagination
        const url = page === 1
            ? 'https://winbu.tv/animedonghua/'
            : `https://winbu.tv/animedonghua/page/${page}/`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const animeTerbaruList = [];

        $('.movies-list-wrap').each((index, section) => {
            const sectionTitle = $(section).find('.list-title h2').text().trim();

            if (sectionTitle.includes('Anime Donghua') || sectionTitle.includes('Latest')) {

                $(section).find('.ml-item').each((i, element) => {
                    const title = $(element).find('.judul').text().trim();
                    const rawLink = $(element).find('a.ml-mask').attr('href');
                    const linkData = parseLink(rawLink);
                    const image = $(element).find('img.mli-thumb').attr('src');
                    const episode = $(element).find('.mli-episode').text().trim();
                    const time = $(element).find('.mli-waktu').text().trim();
                    const views = $(element).find('.mli-mvi').text().trim();

                    if (title) {
                        animeTerbaruList.push({
                            title,
                            episode,
                            time,
                            views,
                            image,
                            type: linkData.slug,
                            id: linkData.id,
                            link: linkData.original
                        });
                    }
                });
            }
        });

        // ========================================
        // PAGINATION PARSING
        // ========================================
        let totalPages = 1;

        $('.pagination li a').each((i, el) => {
            const num = $(el).text().trim();
            if (/^\d+$/.test(num)) {
                const n = parseInt(num);
                if (n > totalPages) totalPages = n;
            }
        });

        // prev / next
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        // ========================================

        res.status(200).json({
            status: 'success',
            pagination: {
                current_page: page,
                total_pages: totalPages,
                prev_page: prevPage,
                next_page: nextPage
            },
            data: {
                latest_anime: animeTerbaruList
            }
        });

    } catch (error) {
        console.error("Error scraping:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

app.get('/api/film', async (req, res) => {
    try {
        // Ambil nomor halaman
        const page = parseInt(req.query.page) || 1;

        // Tentukan URL berdasarkan page
        const url = page === 1
            ? 'https://winbu.tv/film/'
            : `https://winbu.tv/film/page/${page}/`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const latestFilmList = [];

        $('.movies-list-wrap').each((index, section) => {
            const sectionTitle = $(section).find('.list-title h2').text().trim();

            if (sectionTitle.includes('Film') || sectionTitle.includes('Latest')) {

                $(section).find('.ml-item').each((i, element) => {

                    const title = $(element).find('.judul').text().trim();
                    const rawLink = $(element).find('a.ml-mask').attr('href');
                    const linkData = parseLink(rawLink);
                    const image = $(element).find('img.mli-thumb').attr('src');
                    const time = $(element).find('.mli-waktu').text().trim();
                    const views = $(element).find('.mli-info .mli-mvi').text().trim();

                    if (title) {
                        latestFilmList.push({
                            title,
                            time,
                            views,
                            image,
                            type: linkData.slug,
                            id: linkData.id,
                            link: linkData.original
                        });
                    }
                });
            }
        });

        // ========================================
        // PAGINATION
        // ========================================
        let totalPages = 1;

        $('.pagination li a').each((i, el) => {
            const num = $(el).text().trim();
            if (/^\d+$/.test(num)) {
                const n = parseInt(num);
                if (n > totalPages) totalPages = n;
            }
        });

        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        // ========================================

        res.status(200).json({
            status: 'success',
            pagination: {
                current_page: page,
                total_pages: totalPages,
                prev_page: prevPage,
                next_page: nextPage
            },
            data: {
                latest_film: latestFilmList
            }
        });

    } catch (error) {
        console.error("Error scraping:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

app.get('/api/others', async (req, res) => {
    try {
        // Ambil page dari query
        const page = parseInt(req.query.page) || 1;

        // Tentukan URL berdasarkan halaman
        const url = page === 1
            ? 'https://winbu.tv/others/'
            : `https://winbu.tv/others/page/${page}/`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const jepangKoreaChinaBaratList = [];

        $('.movies-list-wrap').each((index, section) => {
            const sectionTitle = $(section).find('.list-title h2').text().trim();

            if (
                sectionTitle.includes('Jepang Korea China Barat') ||
                sectionTitle.includes('Latest')
            ) {

                $(section).find('.ml-item').each((i, element) => {
                    const title = $(element).find('.judul').text().trim();
                    const rawLink = $(element).find('a.ml-mask').attr('href');
                    const linkData = parseLink(rawLink);
                    const image = $(element).find('img.mli-thumb').attr('src');
                    const episode = $(element).find('.mli-episode').text().trim();
                    const time = $(element).find('.mli-waktu').text().trim();
                    const views = $(element).find('.mli-info .mli-mvi').text().trim();

                    if (title) {
                        jepangKoreaChinaBaratList.push({
                            title,
                            episode,
                            time,
                            views,
                            image,
                            type: linkData.slug,
                            id: linkData.id,
                            link: linkData.original
                        });
                    }
                });
            }
        });

        // ========================================
        // PAGINATION PARSE
        // ========================================
        let totalPages = 1;

        $('.pagination li a').each((i, el) => {
            const num = $(el).text().trim();
            if (/^\d+$/.test(num)) {
                const n = parseInt(num);
                if (n > totalPages) totalPages = n;
            }
        });

        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        // ========================================

        res.status(200).json({
            status: 'success',
            pagination: {
                current_page: page,
                total_pages: totalPages,
                prev_page: prevPage,
                next_page: nextPage
            },
            data: {
                jepang_korea_china_barat: jepangKoreaChinaBaratList
            }
        });

    } catch (error) {
        console.error("Error scraping:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});

app.get('/api/tvshow', async (req, res) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;

        // URL otomatis berubah berdasarkan page
        const url = page === 1 
            ? 'https://winbu.tv/tvshow/'
            : `https://winbu.tv/tvshow/page/${page}/`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const tvShowList = [];

        $('.movies-list-wrap').each((index, section) => {
            const sectionTitle = $(section).find('.list-title h2').text().trim();

            if (sectionTitle.includes('TV Show') || sectionTitle.includes('Latest')) {
                $(section).find('.ml-item').each((i, element) => {
                    const title = $(element).find('.judul').text().trim();
                    const rawLink = $(element).find('a.ml-mask').attr('href');
                    const linkData = parseLink(rawLink);
                    const image = $(element).find('img.mli-thumb').attr('src');
                    const episode = $(element).find('.mli-episode').text().trim();
                    const time = $(element).find('.mli-waktu').text().trim();
                    const views = $(element).find('.mli-info .mli-mvi').text().trim();

                    if (title) {
                        tvShowList.push({
                            title,
                            episode,
                            time,
                            views,
                            image,
                            type: linkData.slug,
                            id: linkData.id,
                            link: linkData.original
                        });
                    }
                });
            }
        });

        res.status(200).json({
            status: 'success',
            page,
            next_page: page + 1,
            prev_page: page > 1 ? page - 1 : null,
            total_items: tvShowList.length,
            data: tvShowList
        });

    } catch (error) {
        console.error("Error scraping:", error.message);
        res.status(500).json({ message: 'Gagal scraping data.' });
    }
});



app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});
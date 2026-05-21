// ==UserScript==
// @name         Mangak Bookmarks + History TXT Exporter
// @namespace    Wardf
// @version      1.1
// @description  Export Mangak bookmarks to TXT with reading progress from history
// @author       Wardf
// @match        https://mangak.io/me/bookmarks*
// @match        https://mangak.io/me/history*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const STORAGE_KEY = 'wardf_mangak_export_bookmarks';
    const CONTINUE_KEY = 'wardf_mangak_export_continue';

    function normalizeMangaKey(url) {
        try {
            return new URL(url, location.origin).pathname.replace(/\/$/, '');
        } catch {
            return '';
        }
    }

    function findLoadMoreButton() {
        return [...document.querySelectorAll('button')]
            .find(btn => btn.textContent.includes('Load More'));
    }

    async function loadAllByCounter(getCount, label) {
        let lastCount = 0;
        let sameCountTries = 0;

        while (true) {
            const button = findLoadMoreButton();

            if (!button || button.disabled) break;

            const currentCount = getCount();

            exportButton.textContent = `${label}: ${currentCount} loaded...`;

            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(500);

            button.click();
            await sleep(1800);

            const newCount = getCount();

            if (newCount === lastCount || newCount === currentCount) {
                sameCountTries++;
            } else {
                sameCountTries = 0;
            }

            lastCount = newCount;

            if (sameCountTries >= 3) break;
        }
    }

    function getBookmarks() {
        const articles = document.querySelectorAll('article');

        return [...articles].map(article => {
            const titleLink = article.querySelector('a.font-semibold[href]');
            const chapterLink = article.querySelector('a[href*="/chapter-"]');
            const img = article.querySelector('img');

            const title = titleLink?.textContent?.trim() || img?.alt?.trim() || 'Unknown title';
            const mangaUrl = titleLink ? new URL(titleLink.href, location.origin).href : '';
            const chapter = chapterLink?.textContent?.trim() || 'No chapter';
            const chapterUrl = chapterLink ? new URL(chapterLink.href, location.origin).href : '';

            const status = [...article.querySelectorAll('span')]
                .map(s => s.textContent.trim())
                .find(t => ['ONGOING', 'COMPLETED', 'HIATUS', 'DROPPED'].includes(t.toUpperCase())) || '';

            return {
                key: normalizeMangaKey(mangaUrl),
                title,
                mangaUrl,
                chapter,
                chapterUrl,
                status
            };
        }).filter(b => b.mangaUrl);
    }

    function getHistoryProgress() {
        const result = {};

        const progressBars = [...document.querySelectorAll('[aria-label^="Reading progress"]')];

        for (const bar of progressBars) {
            const card =
                bar.closest('div.group.relative.flex.items-stretch') ||
                bar.closest('div.group') ||
                bar.parentElement;

            if (!card) continue;

            const titleLink = card.querySelector('a.font-semibold[href]');
            if (!titleLink) continue;

            const mangaUrl = new URL(titleLink.href, location.origin).href;
            const key = normalizeMangaKey(mangaUrl);

            const aria = bar.getAttribute('aria-label') || '';
            const percentMatch = aria.match(/(\d+(?:\.\d+)?)%/);
            const percent = percentMatch ? `${percentMatch[1]}%` : '0%';

            const chapterBadge = [...card.querySelectorAll('span')]
                .map(s => s.textContent.trim().replace(/\s+/g, ' '))
                .find(t => /^\d+\s*\/\s*\d+\s*ch$/i.test(t));

            result[key] = `${percent} | ${chapterBadge || '0/0 ch'}`;
        }

        return result;
    }

    async function scanBookmarksAndGoHistory() {
        exportButton.disabled = true;
        exportButton.textContent = 'Loading all bookmarks...';

        await loadAllByCounter(
            () => document.querySelectorAll('article').length,
            'Bookmarks'
        );

        const bookmarks = getBookmarks();

        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
        localStorage.setItem(CONTINUE_KEY, '1');

        exportButton.textContent = `Saved ${bookmarks.length} bookmarks. Opening history...`;

        await sleep(800);

        location.href = 'https://mangak.io/me/history';
    }

    async function scanHistoryAndExport() {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            exportButton.textContent = 'No bookmarks saved. Start from bookmarks.';
            return;
        }

        exportButton.disabled = true;
        exportButton.textContent = 'Loading all history...';

        await loadAllByCounter(
            () => document.querySelectorAll('[aria-label^="Reading progress"]').length,
            'History'
        );

        const bookmarks = JSON.parse(raw);
        const history = getHistoryProgress();

        const txt = makeTxt(bookmarks, history);

        downloadTxt(txt);

        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CONTINUE_KEY);

        exportButton.disabled = false;
        exportButton.textContent = `Export complete (${bookmarks.length})`;
    }

    function makeTxt(bookmarks, history = {}) {
        return bookmarks.map((b, index) => {
            return [
                `${index + 1}. ${b.title}`,
                `Manga URL: ${b.mangaUrl}`,
                `Latest chapter: ${b.chapter}`,
                `Progres: ${history[b.key] || '0% | 0/0 ch'}`,
                `Chapter URL: ${b.chapterUrl}`,
                b.status ? `Status: ${formatStatus(b.status)}` : null
            ].filter(Boolean).join('\n');
        }).join('\n\n------------------------------\n\n');
    }

    function formatStatus(status) {
        const lower = status.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    function downloadTxt(content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `mangak-bookmarks-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();

        a.remove();
        URL.revokeObjectURL(url);
    }

    const exportButton = document.createElement('button');

    exportButton.style.position = 'fixed';
    exportButton.style.right = '20px';
    exportButton.style.bottom = '20px';
    exportButton.style.zIndex = '999999';
    exportButton.style.padding = '12px 16px';
    exportButton.style.borderRadius = '8px';
    exportButton.style.border = 'none';
    exportButton.style.background = '#22c55e';
    exportButton.style.color = '#fff';
    exportButton.style.fontWeight = '700';
    exportButton.style.cursor = 'pointer';
    exportButton.style.boxShadow = '0 4px 14px rgba(0,0,0,.25)';

    if (location.pathname.startsWith('/me/bookmarks')) {
        exportButton.textContent = 'Export bookmarks + history to TXT';
        exportButton.addEventListener('click', scanBookmarksAndGoHistory);
    }

    if (location.pathname.startsWith('/me/history')) {
        if (localStorage.getItem(CONTINUE_KEY) === '1') {
            exportButton.textContent = 'Click after history loads: export TXT';
        } else {
            exportButton.textContent = 'Export TXT from saved bookmarks';
        }

        exportButton.addEventListener('click', scanHistoryAndExport);
    }

    document.body.appendChild(exportButton);
})();

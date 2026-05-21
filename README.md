# Mangak Bookmarks TXT Exporter

Tampermonkey script for exporting your Mangak bookmarks to a `.txt` file, including reading progress from the History page.

---

# Requirements

You need:

- A browser supporting extensions
- The Tampermonkey extension installed

Supported browsers include:

- Google Chrome
- Microsoft Edge
- Firefox
- Opera
- Brave

---

# Installing Tampermonkey

## Chrome / Brave / Opera / Edge

Install Tampermonkey from:

```txt
https://www.tampermonkey.net/
```

or directly from your browser extension store.

After installation, you should see the Tampermonkey icon in your browser toolbar.

---

# Installing the script

1. Open Tampermonkey
2. Click:

```txt
Create a new script
```

3. Remove the default template code
4. Paste the exporter script into the editor
5. Press:

```txt
Ctrl + S
```

or click:

```txt
File → Save
```

6. Make sure the script is enabled inside Tampermonkey

---

# Important note about Mangak History loading

The Mangak History page may sometimes fail to load correctly due to a site-side API/network issue.

If the History list does not appear, refresh it manually using the sidebar:

1. Open:

```txt
https://mangak.io/me/history
```

2. Click **Bookmarks** in the sidebar
3. Click **History** in the sidebar again
4. Wait until the History list appears
5. Click the exporter button to continue

Do not rely on browser refresh alone. Switching pages through the Mangak sidebar is usually required.

---

# How to use

1. Open:

```txt
https://mangak.io/me/bookmarks
```

2. Click:

```txt
Export bookmarks + history to TXT
```

3. The script will scan all bookmarks and open the History page

4. If History does not load, manually switch:

```txt
History → Bookmarks → History
```

using the sidebar

5. Once the History list is visible, click:

```txt
Export TXT from history
```

6. A `.txt` file will be downloaded automatically

---

# Example export output

```txt
1. I'm the Older Brother of a Famous VTuber, But for Some Reason I Became Famous
Manga URL: https://mangak.io/im-the-older-brother-of-a-famous-vtuber-but-for-some-reason-i-became-famous
Latest chapter: Chapter 18
Progres: 10% | 2/20 ch
Chapter URL: https://mangak.io/im-the-older-brother-of-a-famous-vtuber-but-for-some-reason-i-became-famous/chapter-18
Status: Ongoing

------------------------------

2. Roku-Hime Wa Kami Goei Ni Koi Wo Suru: Saikyou No Shugo Kishi, Tenseishite Mahou Gakuen Ni Iku
Manga URL: https://mangak.io/roku-hime-wa-kami-goei-ni-koi-wo-suru-saikyou-no-shugo-kishi-tenseishite-mahou-gakuen-ni-iku
Latest chapter: Chapter 102
Progres: 2% | 1/102 ch
Chapter URL: https://mangak.io/roku-hime-wa-kami-goei-ni-koi-wo-suru-saikyou-no-shugo-kishi-tenseishite-mahou-gakuen-ni-iku/chapter-102
Status: Ongoing

------------------------------

3. Garuru Girl
Manga URL: https://mangak.io/garuru-girl
Latest chapter: Chapter 17
Progres: 6% | 1/17 ch
Chapter URL: https://mangak.io/garuru-girl/chapter-17
Status: Completed

------------------------------

4. Amagami-san Chi no Enmusubi
Manga URL: https://mangak.io/amagami-san-chi-no-enmusubi
Latest chapter: Chapter 194
Progres: 2% | 1/197 ch
Chapter URL: https://mangak.io/amagami-san-chi-no-enmusubi/chapter-194
Status: Ongoing
```

---

# Notes

The script temporarily stores bookmark data inside browser `localStorage` while switching between Bookmarks and History pages.
These keys are automatically removed after a successful export.

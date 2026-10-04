# Ravi Seth Boutique

Independent boutique website and backend, with cars as a secondary section. The homepage defaults to the boutique view, and the server defaults to boutique and car content.

Includes top sellers, a searchable clothing catalogue, sizes, fabric and care details, photos and videos, moderated purchase reviews, call requests and a mobile Content Studio. Clothing is in English; the separate car view supports English and Telugu.

## Run locally

Use Node.js 24 or newer. No dependency installation is required.

```sh
git clone https://github.com/Mukesh-004/ravi-seth-boutique.git
cd ravi-seth-boutique
npm run dev
```

Open `http://127.0.0.1:4173/`. Clothing is at `/collection.html`, cars at `/cars.html`, and Content Studio at `/admin.html`. Listings are saved in `data/site.sqlite`, and media in `uploads/`. To run alongside the estate project, use a different port such as `PORT=4174` in `.env`.

## Configure and publish

Copy `.env.example` to `.env`, set a private `ADMIN_TOKEN`, and run `npm run dev:env`. Keep `SITE_VARIANT=boutique`. Follow [SETUP.md](SETUP.md) for persistent hosting, Docker and Google Sheets delivery. That guide documents the shared backend; this deployment enables boutique and car sections.

The [real estate project](https://github.com/Mukesh-004/ravi-seth-real-estate) has a separate repository and database.

```sh
npm run check
npm test
```

Generate the boutique ZIP with `powershell -File scripts/build-packages.ps1`. Source code is directly browsable here. Private settings, local databases, uploaded media and generated ZIPs are ignored by Git.

Replace sample clothing, cars, prices, photos and contact details before launch. Live Google Sheets delivery requires the Apps Script configuration in SETUP.md.

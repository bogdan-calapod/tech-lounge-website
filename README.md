Tech Lounge Website
============================

Website and static generator for Innovation Labs 2017 Website

To install:
* clone the repository
* run `npm install` in the repo folder

To dev:
* run `npm run watch` in the repo folder, and open the `index.html` file in the
`build` folder
* alternatively, you can run `npm install http-server -g` and run `http-server`
in the build folder to set up a local static file server

To deploy:
* run `npm run build` in the repo folder and upload the files from `build/`

Content is pulled from `../files/sheets.json`. Media files are pulled from the same folder, for team and mentor images.

Configuration options are in the `config` key from the `sheets.json` file. Current configuration options include:

| Key | Description | Example value |
|-----|-------------|---------------|
| cities | CSV values for cities to look for. For each value in here, the generator script will append 'Teams' and 'Mentors' in order to get team and mentor data from `sheets.json` | `bucharest,cluj,timisoara`


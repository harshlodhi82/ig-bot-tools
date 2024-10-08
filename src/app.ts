import dotenv from 'dotenv';
dotenv.config();

import { envConfigs } from './configs/env';
import express from 'express';
import path from 'path';
import { ScriptsController } from './controllers/scripts/scripts.controller';
import { PuppeteerTest } from './puppeteer-test';


const app = express();
const port = envConfigs.PORT || 8080;
const env = envConfigs.NODE_ENV || 'development';


//** set the middleware */
app.set('views', path.join(__dirname, '../assets/html'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../assets/html')));
app.use(express.urlencoded({ extended: true }));


//** listen to app */
app.listen(port, async () => {
    console.log(`✔\t ENV: ${env} || App is listening on port ${port}`);


    await PuppeteerTest.test();

    // await ScriptsController.init();
});

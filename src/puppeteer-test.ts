import puppeteer from 'puppeteer-core';
import { Utils } from './shared/libs';


export class PuppeteerTest {


    private static username: string = 'era_of_coders';
    private static password: string = 'H@r$H9131l0dHi';



    static async test() {
        const browser = await puppeteer.launch({
            // executablePath: '/usr/bin/firefox',
            executablePath: '/usr/bin/google-chrome',
            headless: true, // Set to true for headless mode

            args: [
                '--no-sandbox',
                // '--disable-setuid-sandbox',
                // '--disable-dev-shm-usage',
                // '--remote-debugging-port=9222', // For debugging
            ]
        });

        const page = await browser.newPage();
        await page.goto('https://www.instagram.com/accounts/login/?source=auth_switcher');

        // Wait for the username field to be present using the aria-label attribute
        await page.waitForSelector('input[name="username"]');

        // Type the username into the input field using the aria-label attribute
        await page.type('input[name="username"]', this.username);
        await page.type('input[name="password"]', this.password);


        await Utils.randomWait(5000);

        await page.click('button[type="submit"]');

        await Utils.randomWait(5000);

        let c = await page.cookies();
        console.log(`=> info:`, c);
    }
}
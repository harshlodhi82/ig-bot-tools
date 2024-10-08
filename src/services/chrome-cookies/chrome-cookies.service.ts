import puppeteer, { Browser, Cookie, Page } from 'puppeteer-core';
import fs from 'fs';
import { Utils } from '../../shared/libs';


export class ChromeCookiesService {


    private static IG_LOGIN_PAGE_URL: string = 'https://www.instagram.com/accounts/login/?source=auth_switcher';
    private static IG_COOKIES_PATH: string = 'data/ig-cookies.json';
    private static IG_PAGE_INTERVAL: number = 5000;


    static async getInstagramCookies(): Promise<Cookie[]> {

        //0 - verify and return the local cookies
        if (fs.existsSync(this.IG_COOKIES_PATH)) {

            //a. fetch local cookies
            const localCookiesJson: string = fs.readFileSync(this.IG_COOKIES_PATH, 'utf-8');
            const localCookies: Cookie[] = JSON.parse(localCookiesJson);

            //TODO => //b. verify local cookies

            //c. if cookies are fine then return it
            return localCookies;
        }

        //1 - if cookies are not good, fetch another account cookies and return it
        return this.fetchInstagramCookies();
    }


    /**------------------------------------------------------
     * Helper Function
     */

    //** Get Instagram Cookies */
    private static async fetchInstagramCookies(): Promise<Cookie[]> {
        try {

            //0 - init browser
            const browser: Browser = await puppeteer.launch({
                executablePath: '/usr/bin/google-chrome',
                headless: true, // Set to true for headless mode
                args: [
                    '--no-sandbox',
                ]
            });

            //1 - load page
            const page: Page = await browser.newPage();
            await page.goto(this.IG_LOGIN_PAGE_URL);

            //2 - wait for the required fields to be present
            await Promise.all([
                page.waitForSelector('input[name="username"]'),
                page.waitForSelector('input[name="password"]'),
                page.waitForSelector('button[type="submit"]'),
            ]);
            await Utils.randomWait(this.IG_PAGE_INTERVAL);

            //3 - type the username and password into the input field
            const userCredential: IIgUserCredential = await this.selectIgUserCredential();
            await page.type('input[name="username"]', userCredential.username);
            await page.type('input[name="password"]', userCredential.password);
            await Utils.randomWait(this.IG_PAGE_INTERVAL);

            //4 - click the submit button
            await page.click('button[type="submit"]');
            await Utils.randomWait(this.IG_PAGE_INTERVAL);

            //5 - fetch and save instagram cookies locally
            const igCookies: Cookie[] = await page.cookies();
            fs.writeFileSync(this.IG_COOKIES_PATH, JSON.stringify(igCookies));

            //6 - return the cookies
            return igCookies;
        } catch (error) {
            throw new Error(`Unable to fetch Instagram cookies, Reason => ${error}`);
        }
    }

    private static async selectIgUserCredential(): Promise<IIgUserCredential> {
        //TODO => work on this method
        return {
            username: 'xxxxx',
            password: 'xxxxx',
        }
    }
}


interface IIgUserCredential {
    username: string,
    password: string,
}

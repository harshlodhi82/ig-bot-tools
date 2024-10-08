import fs from 'fs';
import path from 'path';
import puppeteer, { Browser, Cookie, Page } from 'puppeteer-core';
import { Utils } from '../../shared/libs';


export class ChromeService {


    private static readonly IG_LOGIN_PAGE_URL: string = 'https://www.instagram.com/accounts/login/?source=auth_switcher';
    private static readonly IG_COOKIES_PATH: string = 'data/[USERNAME]_ig_cookies.txt';
    private static readonly IG_PAGE_INTERVAL: number = 5000;

    private static instagramUserCredential: IIgUserCredential;
    private static browserUserAgent: string;


    static async getCurrentLoggedInUsername(): Promise<string> {
        if (this.instagramUserCredential == null) {
            await this.fetchIgUserCredential();
        }
        return this.instagramUserCredential.username;
    }

    static async getBrowserUserAgent(): Promise<string> {
        if (this.browserUserAgent == null) {
            const browser: Browser = await this.getChromeBrowser();
            const headlessUserAgent: string = await browser.userAgent();
            this.browserUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
            await browser.close();
        }
        return this.browserUserAgent;
    }

    static async getInstagramCookies(): Promise<Cookie[]> {

        //0 - fetch user credentials
        await this.fetchIgUserCredential();

        //1 - verify and return the local cookies
        const localCookiesPah: string = this.IG_COOKIES_PATH.replace(`[USERNAME]`, this.instagramUserCredential.username);
        if (fs.existsSync(localCookiesPah)) {

            //a. fetch local cookies
            const localCookiesJson: string = fs.readFileSync(localCookiesPah, 'utf-8');
            const localCookies: Cookie[] = JSON.parse(localCookiesJson);

            //TODO => //b. verify local cookies if they are still valid for instagram or not

            //c. if cookies are fine then return it
            return localCookies;
        }

        //2 - if cookies are not good, fetch another account cookies and return it
        return this.fetchInstagramCookies(localCookiesPah);
    }


    /**------------------------------------------------------
     * Helper Function
     */

    //** Get Instagram Cookies */
    private static async fetchInstagramCookies(pathToSaveCookies: string): Promise<Cookie[]> {
        try {

            //0 - clean and create data folder
            const dataFolderPath: string = path.dirname(this.IG_COOKIES_PATH); 
            Utils.createFolder(dataFolderPath);
            Utils.cleanFolder(dataFolderPath);

            //1 - get browser
            const browser: Browser = await this.getChromeBrowser();

            //2 - load page
            const page: Page = await browser.newPage();
            await page.goto(this.IG_LOGIN_PAGE_URL);

            //3 - wait for the required fields to be present
            await Promise.all([
                page.waitForSelector('input[name="username"]'),
                page.waitForSelector('input[name="password"]'),
                page.waitForSelector('button[type="submit"]'),
            ]);
            await Utils.randomWait(this.IG_PAGE_INTERVAL);

            //4 - type the username and password into the input field
            await page.type('input[name="username"]', this.instagramUserCredential.username);
            await page.type('input[name="password"]', this.instagramUserCredential.password);
            await Utils.randomWait(this.IG_PAGE_INTERVAL);

            //5 - click the submit button
            await page.click('button[type="submit"]');
            await Utils.randomWait(this.IG_PAGE_INTERVAL);

            //6 - fetch and save instagram cookies locally
            const igCookies: Cookie[] = await page.cookies();
            fs.writeFileSync(pathToSaveCookies, JSON.stringify(igCookies));

            //7 - close the browser
            await browser.close();

            //8 - return the cookies
            return igCookies;
        } catch (error) {
            throw new Error(`Unable to fetch Instagram cookies, Reason => ${error}`);
        }
    }

    private static async getChromeBrowser(): Promise<Browser> {
        const browser: Browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            headless: true, // Set to true for headless mode
            args: [
                '--no-sandbox',
            ]
        });
        return browser;
    }

    private static async fetchIgUserCredential(): Promise<void> {
        //TODO => work on this method
        if (this.instagramUserCredential != null) return;

        this.instagramUserCredential = {
            username: 'era_of_coders',
            password: 'H@r$H9131l0dHi',
        };
    }
}


interface IIgUserCredential {
    username: string,
    password: string,
}

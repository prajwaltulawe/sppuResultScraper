/* var seatnos = document.querySelectorAll( "[style='padding-top: 1pt;padding-left: 5pt;padding-right: 5pt;text-indent: 0pt;text-align: center;']");
var studDetails = []; 
for (var i = 1; i < seatnos.length; i++) {
    var studDetail = {};
    studDetail.seatNo = seatnos[i].innerText;
    studDetails.push(studDetail);
    i++;
}

var studname = document.querySelectorAll( "[style='padding-left: 7pt;text-indent: 0pt;text-align: left;']", "span[class='s4']" );
for (var i = 0; i < studname.length; i++) {
    studDetails[i].name = studname[i*3].childNodes[1].innerText;
    studDetails[i].motherName = studname[i*3+1].childNodes[1].innerText;
} */

const puppeteer = require('puppeteer');
const data = require('./data.json');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: {
            width:1280,
            height:720
          }
    });

    const page = await browser.newPage();
    await page.goto('https://results.unipune.ac.in/MCOM2013_Credit.aspx?Course_Code=NzAyMTk=&Course_Name=Uy5FLigyMDE5IENSRURJVCBQQVQuKSBBUFItTUFZIDIwMjI=');
    await new Promise(r => setTimeout(r, 1000));
    
    var studentsDetail = data['studentsDetails'];
    var records = '';
    for (const element of studentsDetail) {
        var seatNoInput = await page.waitForXPath("//input[@name='ctl00$ContentPlaceHolder1$txtSeatno']");
        var motherNameInput = await page.waitForXPath("//input[@name='ctl00$ContentPlaceHolder1$txtMother']");
        var back = 0;
        
        await seatNoInput.click({clickCount: 3});
        await seatNoInput.press('Backspace'); 
        await motherNameInput.click({clickCount: 3});
        await motherNameInput.press('Backspace'); 


        await seatNoInput.type(element.seatNo);
        await motherNameInput.type(element.motherName);
        await page.click('#ctl00_ContentPlaceHolder1_btnSubmit');
        
        await new Promise(r => setTimeout(r, 3000));

        var m3 =  await page.evaluate(() => {
            return  document.getElementsByTagName("table")[1].childNodes[0].childNodes[16].childNodes[4].innerText;
        });
        var m32 =  await page.evaluate(() => {
            return  document.getElementsByTagName("table")[1].childNodes[0].childNodes[17].childNodes[4].innerText;
        });
        var pa =  await page.evaluate(() => {
            return  document.getElementsByTagName("table")[1].childNodes[0].childNodes[18].childNodes[4].innerText;
        });
        var dbms =  await page.evaluate(() => {
            return  document.getElementsByTagName("table")[1].childNodes[0].childNodes[19].childNodes[4].innerText;
        });
        var cg =  await page.evaluate(() => {
            return  document.getElementsByTagName("table")[1].childNodes[0].childNodes[20].childNodes[4].innerText;
        });
        var se =  await page.evaluate(() => {
            return  document.getElementsByTagName("table")[1].childNodes[0].childNodes[21].childNodes[4].innerText;
        });
        var percent =  await page.evaluate(() => {
            return document.getElementsByTagName("table")[1].childNodes[0].childNodes[27].innerText.substr(length - 4); 
        });

        (m3=="F") ? back++ : back;
        (m32=="F") ? back++ : back;
        (pa=="F") ? back++ : back;
        (dbms=="F") ? back++ : back;
        (cg=="F") ? back++ : back;
        (se=="F") ? back++ : back;

        await new Promise(r => setTimeout(r, 1000));
        records = records + `<tr> 
                                <td>    ${element.name} </td>   
                                <td>    ${m3}           </td>    
                                <td>    ${m32}          </td>   
                                <td>    ${pa}           </td>   
                                <td>    ${dbms}         </td>   
                                <td>    ${cg}           </td>   
                                <td>    ${se}           </td>   
                                <td>    ${percent}      </td>   
                                <td>    ${back}      </td>   
                            </tr>`; 
    } 
    
    fs.writeFile('data.txt', records, err =>{
        if (err) {
            console.err;
        }
    });

})();


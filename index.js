
// puppeter
const puppeteer = require('puppeteer');


async function getTokoPedia(myname){
    
    const browser = await puppeteer.launch({ headless: false }); 
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1000, height: 926 });
    await page.goto("https://stats.nba.com/",{waitUntil: 'networkidle2',timeout: 0});
    
    // iz glavne strani NBA-ja pojdi na Spletno stran igralca
    let href = await page.evaluate(function(myname) {
        // poisci input element ter vanj zapisi ime iskanega igralca
        let click = document.querySelector('body > main > div.nav-container.nav-container--fixed > div > div.nav-inner__search.nav-inner__search--right.stats-search > div.stats-search__top > a')
        click.click()
        let input = document.querySelector('body > main > div.nav-container.nav-container--fixed > div > div.nav-inner__search.nav-inner__search--right.stats-search > div.stats-search__top > input')
        

        input.value = myname;
        // sprozi event change, da se prikaze skriti div.stats-search__results
        let event = new Event('change');
        setTimeout(input.dispatchEvent(event),300);
        // pridobi href zeljenega igralca
        let players_box = document.querySelector('body > main > div.nav-container.nav-container--fixed > div > div.nav-inner__search.nav-inner__search--right.stats-search.active > div.stats-search__results')
        a = players_box.querySelector('a')
        // vrne href
        return {href:a.href}
    },myname)

    // spletna stran iskanega igralca
    await page.goto(href.href,{waitUntil: 'networkidle2',timeout: 0});

    // na spletni strana igralca izbrskaj podatke 
    let data_for_player = await page.evaluate(()=>{
        
        
        let thead = document.querySelector('body > main > div.stats-container__inner > div > div > div.row > div > div > div > nba-stat-table:nth-child(8) > div.nba-stat-table > div.nba-stat-table__overflow > table > thead');
        let tbody = document.querySelector('body > main > div.stats-container__inner > div > div > div.row > div > div > div > nba-stat-table:nth-child(8) > div.nba-stat-table > div.nba-stat-table__overflow > table > tbody');
        var stat_name = [];
        var stats = [];
        var tds = thead.querySelectorAll('th')
        var tbd = tbody.querySelectorAll('tr')

        for(var i = 0; i < tds.length; ++i) {
            // zapisi imena statisticih podatkov
            stat_name.push(tds[i].innerText)
        }

        for(var i = 0; i < tbd.length; ++i) {
            // zapisi statisticne podatke
            cells = tbd[i].querySelectorAll('td')
            stats.push(new Array())
            for(var j = 0; j < cells.length; j++ ){
                stats[i].push(cells[j].innerText);
            }
            
        }

        for (var i =0; i < stat_name.length; i++)
        return {
            stat_names:stat_name,
            statistics: stats,    
        };
            
    })
    years_played = data_for_player["statistics"].length
    // na konzoli sprintaj leto, ime statističnega podatka, statističen podatek
    for ( var i =0;i<years_played; i++){
        console.log(data_for_player.statistics[i][0],data_for_player.stat_names[9],data_for_player.statistics[i][9], '\n')
    }
    
}

const prompt = require('prompt-sync')();

let myname = prompt('Name of the NBA player?');



//async funkcija
getTokoPedia(String(myname));

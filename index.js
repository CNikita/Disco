let allMusic;
let allDance;
let personsList;
const persons = [];
const musicList = [];
let playMusicNow
async function getData() {
    await fetch('https://cnikita.github.io/data/music.json')
        .then(response => response.json())
        .then(data => allMusic = data[0])
        .then(() => Object.keys(allMusic).map(music => musicList.push(music)))
    await fetch('https://cnikita.github.io/data/dance.json')
        .then(response => response.json())
        .then(data => allDance = data)
    createPersons()
    createPlayList()
    createDanceList()
    playNextMusic()
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

function createPersons() {  //создаем произвольное кол-во персонажей
    const max = 15;
    const min = 8;
    const amountPersons = Math.floor(Math.random() * (max - min) + min);
    for (let i=1; i <= amountPersons; i++) {
        let obj = {"id" : i}
        let sex = ["boy", "girl"]
        shuffle(sex)
        obj.sex = sex[0]   //рандомно определяем пол
        Object.keys(allMusic).map(music => {
            allMusic[music].dances_id.map((id) => {
                let dance = allDance.find(dance => dance.id == id);
                let randomDanceSkill = [true, false, false]
                shuffle(randomDanceSkill)
                obj[dance.type] = {
                    "can": randomDanceSkill[0],
                    "do": randomDanceSkill[1],
                    "like": randomDanceSkill[2],
                }
            })
        })
        persons.push(obj)
    }
    personsList = Array.from(persons);
}

function playNextMusic() {
    let nextIndex = musicList[musicList.indexOf(playMusicNow)+1] === undefined ? 0 : musicList.indexOf(playMusicNow)+1;
    playMusicNow = musicList[nextIndex]
    player.innerHTML = playMusicNow ? `Сейчас играет: ${playMusicNow}` : 'Нет музыки для проигрывания';
    danceOrDrink()
}

function createPlayList() {
    for (let element of Object.keys(allMusic)) {
        let p = document.createElement('p');
        p.innerHTML = `<input type="checkbox" checked value="${element}">${element}`;
        musicListId.append(p)
        p.addEventListener('change', e => editMusicList(e))
    }
}

function createDanceList() {
    for (let element of allDance) {
        let pCan = document.createElement('p');
        let pDo = document.createElement('p');
        let pLike = document.createElement('p');
        pCan.innerHTML = `<input type="radio" name="dancefilter" value="${element.type},can">${element.type}`;
        pDo.innerHTML = `<input type="radio" name="dancefilter" value="${element.type},do">${element.type}`;
        pLike.innerHTML = `<input type="radio" name="dancefilter" value="${element.type},like">${element.type}`;
        canDance.append(pCan)
        doDance.append(pDo)
        likeDance.append(pLike)
        pCan.addEventListener('change', e => editPersonsList(e))
        pDo.addEventListener('change', e => editPersonsList(e))
        pLike.addEventListener('change', e => editPersonsList(e))
    }
    alldancer.addEventListener('change', e => editPersonsList(e))
}

function editMusicList(e) {
    if (e.target.checked) {
        musicList.push(e.target.value)
    } else {
        musicList.splice(musicList.indexOf(e.target.value),1)
    }
    playNextMusic()
}

function editPersonsList(e) {
    if (e.target.id == 'alldancer') {
        personsList = Array.from(persons)
    } else {
        let arr = e.target.value.split(',')
        personsList = persons.filter(person => person[arr[0]][arr[1]] != true)
    }
    danceOrDrink()
}

function danceOrDrink() {
    let arrPersonList = Array.from(personsList)
    dancefloor.innerHTML = '';
    bar.innerHTML = ''
    let danceArr = [];
    allMusic[playMusicNow].dances_id.map(id => danceArr.push(allDance.find(dance => dance.id == id)))
    arrPersonList.forEach(person => {
        danceArr.forEach(dance => {
            if (person[dance.type]['can'] || person[dance.type]['do']) {
                let div = document.createElement('div');
                // div.innerHTML = `танцует ${dance.type}`
                div.className = `${dance.type}`
                dancefloor.append(div)
                arrPersonList.splice(arrPersonList.indexOf(person),1)
            }
        })
    })
    arrPersonList.forEach(() => {
        let div = document.createElement('div');
        div.innerHTML = 'пьет'
        div.className = 'drink'
        bar.append(div)
    })
}

getData();

nextMusic.onclick = function() {
    playNextMusic()
}
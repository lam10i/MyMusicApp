const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playist = $('.playist');
//data object
const element = document.querySelector('.player');
const play_btn = document.querySelector('.btn-toggle-play');
const player = document.querySelector('.player');
const audio = document.querySelector('#audio');
const inputRange = document.querySelector('#progress');
const inputRangeVolume=document.querySelector('#volume')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const btn_repeat = $('.btn-repeat');
const btn_prev = $('.btn-prev');
const btn_next = $('.btn-next');
const btn_random = $('.btn-random');
const toggle_play_running=$('.toggle-play-running');
const volumeNormal=document.querySelector('.volume-normal');
const volumeMuted=document.querySelector('.volume-muted');
var arrayContainIndex = [];
const app = {
    currentIndex: 0,
    songs: [
        {
            name: "Why not me",
            singer: "Enrique Iglesias",
            path: "assets/mp3/WhyNotMe-EnriqueIglesias-3479372.mp3",
            image: "assets/image/whyNotMe.jpg"
        },
        {
            name: "Chia tay",
            singer: "Bùi Anh Tuấn",
            path: "assets/mp3/ChiaTay-BuiAnhTuan-5183978.mp3",
            image: "assets/image/chia-tay.jpg"
        },
        {
            name: "Cry on my shoulder",
            singer: "SuperStar",
            path: "assets/mp3/CryOnMyShoulder-SuperStars-152828.mp3",
            image: "assets/image/cry-on-my-shoulder.jpg"
        },
        {
            name: "Đế vương",
            singer: "Đình Dũng",
            path: "assets/mp3/DeVuong-DinhDungACV-7121634.mp3",
            image: "assets/image/de-vuong.jpg"
        },
        {
            name: "Despacito",
            singer: "Luis Fonsi",
            path: "assets/mp3/DespacitoRemix-LuisFonsiDaddyYankeeJustinBieber-5443166.mp3",
            image: "assets/image/despacito.jpg"
        },
        {
            name: "Until you",
            singer: "Shayne Ward",
            path: "assets/mp3/UntilYou-ShayneWard-1979790.mp3",
            image: "assets/mp3/Until-you.jpg"
        },
        {
            name: "I am not her",
            singer: "Clara Mae",
            path: "assets/mp3/IMNotHer-ClaraMae-6441120.mp3",
            image: "assets/image/I-am-not-her.jpg"
        },
        {
            name: "Khó vẽ nụ cười",
            singer: "Đạt G",
            path: "assets/mp3/KhoVeNuCuoi-DatGDuUyen-6114344.mp3",
            image: "assets/image/Kho-ve-nu-cuoi.jpg"
        },
        {
            name: "Tình sầu thiên thu muôn lối",
            singer: "Doãn Hiếu",
            path: "assets/mp3/TinhSauThienThuMuonLoiWRCRemix-DoanHieu-6266302.mp3",
            image: "assets/image/tinh-sau-thien-thu-muon-loi.jpg"
        },
        {
            name: "You don't know me",
            singer: "Ofenbach",
            path: "assets/mp3/YouDontKnowMe-OfenbachBrodieBarclay-4396475.mp3",
            image: "assets/image/you-do-not-know-me.jpg"
        }
    ],
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function () {
        let htmls = this.songs.map((song, index) => {
            return `
            <div data-index=${index} class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb" style="background-image: url(${song.image});">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <span class="option-item"></span>
                    <span class="option-item"></span>
                    <span class="option-item"></span>
                </div>
            </div>
            `;
        })
        htmls = htmls.join("");
        playist.innerHTML = htmls;
    },
    handleEvents: function () {
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        //Xử lí phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollY;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : "0px"
            cd.style.opacity = newCdWidth > 0 ? newCdWidth / cdWidth : "0"
        }
        //Xử lí khi click nút play hoặc pause
        play_btn.onclick = function () {
            let runningPercentProcess;
            
            //Xử lí khi trạng thái là playing
            player.classList.toggle('playing');
            player.classList.contains('playing') ? audio.play() : audio.pause();
            player.classList.contains('playing') ? cdThumb.style.animationPlayState = 'running' : cdThumb.style.animationPlayState = 'paused';
            player.classList.contains('playing') ? toggle_play_running.classList.add('active') : toggle_play_running.classList.remove('active');
            app.addAndRemoveActiveOptionItem();
            //Xử lí audio và input
            var checkInputMouseUp = true;
            audio.ontimeupdate = function () {
                runningPercentProcess = (audio.currentTime / audio.duration) * 100;
                if (Number.isNaN(runningPercentProcess)) {
                    runningPercentProcess = 0;
                }
                if (checkInputMouseUp) {
                    inputRange.value = runningPercentProcess;
                    document.documentElement.style.setProperty('--width-progress-running', inputRange.value +"%");
                }
            }
            inputRange.onmousedown = function () {
                checkInputMouseUp = false;
            }
            inputRange.ontouchstart=function(){
                checkInputMouseUp = false;
            }
            inputRangeVolume.oninput=function(){
                if(inputRangeVolume.value==0){
                    volumeMuted.style.display='inline-block';
                    volumeNormal.style.display='none'
                }
                else{
                    volumeMuted.style.display='none';
                    volumeNormal.style.display='inline-block'
                }
                audio.volume=inputRangeVolume.value/100;
            }
            inputRange.oninput = function () {
                document.documentElement.style.setProperty('--width-progress-running', inputRange.value +"%");
                inputRange.ontouchend=function(){
                    checkInputMouseUp = true;
                    const seekTime = inputRange.value * audio.duration / 100;
                    audio.currentTime = seekTime;
                }
                inputRange.onmouseup = function () {
                    checkInputMouseUp = true;
                    const seekTime = inputRange.value * audio.duration / 100;
                    audio.currentTime = seekTime;
                }
            }
        }
        //Xử lí khi click nút next
        btn_next.onclick = function () {
            app.nextSong();
            //add and remove song active
            const songActive = document.querySelector('.song.active');
            songActive.classList.remove('active');
            const songsDOM = $$('.song');
            songsDOM[app.currentIndex].classList.add('active');
            app.addAndRemoveActiveOptionItem();
            
            app.scrollToActiveSong();
            if (!player.classList.contains('playing')) {
                play_btn.click();
            }
            audio.play();
        }
        //Xử lí khi click nút prev
        btn_prev.onclick = function () {
            app.prevSong();
            //add and remove song active
            const songActive = document.querySelector('.song.active');
            songActive.classList.remove('active');
            const songsDOM = $$('.song');
            songsDOM[app.currentIndex].classList.add('active');
            app.scrollToActiveSong();
            if (!player.classList.contains('playing')) {
                play_btn.click();
            }
            app.addAndRemoveActiveOptionItem();
            audio.play();
        }
        //Xử lí khi click nút random
        btn_random.onclick = function (e) {
            e.currentTarget.classList.toggle('active');
        }
        btn_repeat.onclick = function (e) {
            e.currentTarget.classList.toggle('active');
        }
        //Xử lí khi audio kết thúc
        audio.onended = function () {
            if (btn_repeat.classList.contains('active')) {
                audio.play();
            }
            else {
                btn_next.click();
            }
        }

        //Xử lí khi nhấn vào playist
        playist.onclick = function (e) {
            if (e.target.closest('.song:not(.active)')) {
                if (!e.target.closest('.option')) {
                    app.currentIndex = e.target.closest('.song:not(.active)').dataset.index;
                    app.loadCurrentSong();
                    //add and remove song active
                    const songActive = document.querySelector('.song.active');
                    songActive.classList.remove('active');
                    const songsDOM = $$('.song');
                    songsDOM[app.currentIndex].classList.add('active');
                    app.scrollToActiveSong();
                    app.addAndRemoveActiveOptionItem();
                    if (!player.classList.contains('playing')) {
                        play_btn.click();
                    }
                    audio.play();
                }
            }
        }
    },
    addAndRemoveActiveOptionItem:function(){
            const options = $$('.option');
            const currentOption = options[app.currentIndex];
            const optionItems = currentOption.querySelectorAll('.option-item')
            const optionItemsActive=document.querySelectorAll('.option-item.active');
            optionItemsActive.forEach(item=>{
                item.classList.remove('active');
            })
        if (player.classList.contains('playing')==false) {
            optionItems.forEach(item => {
                item.classList.remove('active');
            })
            }
        if (player.classList.contains('playing')===true) {
            optionItems.forEach(item => {
                item.classList.add('active');
            })
        }
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            document.querySelector('.song.active').scrollIntoView({ block: "end", behavior: "smooth", });
        }, 300)
    },
    playRandomSong: function () {
        if (arrayContainIndex.length == this.songs.length) {
            arrayContainIndex = [];
        }
        if (arrayContainIndex.length == 0) {
            arrayContainIndex.push(this.currentIndex);
        }
        let randomIndex = Math.floor(Math.random() * app.songs.length);
        while (arrayContainIndex.includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * app.songs.length);
        }
        this.currentIndex = randomIndex;
        arrayContainIndex.push(this.currentIndex);
        this.loadCurrentSong();
    },
    nextSong: function () {
        if (btn_random.classList.contains("active")) {
            this.playRandomSong();
        }
        else {
            arrayContainIndex = [];
            this.currentIndex++;
            if (this.currentIndex == app.songs.length) {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        }
    },
    prevSong: function () {
        if (btn_random.classList.contains("active")) {
            this.playRandomSong();
        }
        else {
            arrayContainIndex = [];
            this.currentIndex--;
            if (this.currentIndex == -1) {
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong();
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = `${this.currentSong.path}`;
    },
    start() {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        //Lắng nghe và xử lí các sự kiện DOM event
        this.handleEvents();
        //Tải thông tin bài hát khi chạy ứng dụng
        this.loadCurrentSong();
        //Render playist
        this.render();
    }
}
app.start();

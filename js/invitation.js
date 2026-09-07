
const openBtn = document.getElementById('openInvite');
const musicToggle = document.getElementById('musicToggle');
const heroContent = document.getElementById('heroContent');
const invite = document.getElementById('invite');
const heartWrap = document.querySelector('.heart-wrap');
const bottomNav = document.getElementById('bottomNav');

openBtn.addEventListener('click', () => {
  if(openBtn.classList.contains('open')) return;
  openBtn.classList.add('open');
  createFlowerBurst();
  startMusic();

  setTimeout(() => {
    heartWrap.classList.add('fade');
    heroContent.classList.add('show');
    heroContent.setAttribute('aria-hidden','false');
    invite.classList.remove('hidden');
    bottomNav.classList.add('show');
    musicToggle.classList.add('show');
    startAmbientFlowers();
  }, 1350);
});

const target = new Date('2026-11-25T19:00:00+05:30');

function updateCountdown(){
  const now = new Date();
  let diff = target - now;
  if (diff <= 0){
    ['days','hours','minutes','seconds'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const d = Math.floor(diff / 86400000); diff %= 86400000;
  const h = Math.floor(diff / 3600000); diff %= 3600000;
  const m = Math.floor(diff / 60000); diff %= 60000;
  const s = Math.floor(diff / 1000);
  document.getElementById('days').textContent = String(d).padStart(2,'0');
  document.getElementById('hours').textContent = String(h).padStart(2,'0');
  document.getElementById('minutes').textContent = String(m).padStart(2,'0');
  document.getElementById('seconds').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown,1000);

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));




/* Local MP3 background music using the user's uploaded track.
   Starts at 00:17 after the guest taps the heart. */
const weddingMusic = new Audio('audio/Saibo.mp3');
weddingMusic.preload = 'auto';
weddingMusic.volume = 0.34;

let musicStarted = false;
let musicPaused = false;

async function beginLocalMusic(){
  try{
    weddingMusic.currentTime = 17;
    await weddingMusic.play();
    musicStarted = true;
    musicPaused = false;
    musicToggle.classList.remove('paused');
    musicToggle.textContent = '♪';
    musicToggle.setAttribute('aria-label','Pause background music');
  }catch(error){
    console.warn('Audio playback needs guest interaction.', error);
  }
}

function startMusic(){
  beginLocalMusic();
}

musicToggle.addEventListener('click', async ()=>{
  if(!musicStarted){
    await beginLocalMusic();
    return;
  }
  if(musicPaused){
    await weddingMusic.play();
    musicPaused = false;
    musicToggle.classList.remove('paused');
    musicToggle.textContent = '♪';
    musicToggle.setAttribute('aria-label','Pause background music');
  }else{
    weddingMusic.pause();
    musicPaused = true;
    musicToggle.classList.add('paused');
    musicToggle.textContent = '×';
    musicToggle.setAttribute('aria-label','Play background music');
  }
});

weddingMusic.addEventListener('ended', async ()=>{
  weddingMusic.currentTime = 17;
  try{
    await weddingMusic.play();
  }catch(error){}
});


/* Floral heart-opening effect */
const burstPalette = ['#f7b7c8','#f3d67a','#c9a7e8','#f6c58f','#e99ab7','#f2d9ad','#b9d7b1'];

function createFlowerBurst(){
  const burst = document.getElementById('flowerBurst');
  burst.innerHTML = '';
  const count = 34;

  for(let i=0;i<count;i++){
    const flower = document.createElement('span');
    flower.className = 'burst-flower';

    const angle = (Math.PI * 2 * i / count) + (Math.random()-.5)*.25;
    const distance = 105 + Math.random()*125;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    flower.style.setProperty('--x', `${x.toFixed(1)}px`);
    flower.style.setProperty('--y', `${y.toFixed(1)}px`);
    flower.style.setProperty('--rot', `${Math.round(Math.random()*520-260)}deg`);
    flower.style.setProperty('--scale', `${(0.55+Math.random()*.9).toFixed(2)}`);
    flower.style.setProperty('--dur', `${(0.9+Math.random()*.45).toFixed(2)}s`);
    flower.style.setProperty('--delay', `${(Math.random()*.11).toFixed(2)}s`);
    flower.style.setProperty('--flower', burstPalette[Math.floor(Math.random()*burstPalette.length)]);

    burst.appendChild(flower);
  }

  setTimeout(()=>{ burst.innerHTML=''; }, 1800);
}

/* Light floral drift in the background after the invitation opens */
let ambientTimer = null;
const ambientPalette = [
  'rgba(244,164,190,.82)',
  'rgba(231,196,106,.78)',
  'rgba(195,164,221,.72)',
  'rgba(242,190,145,.76)',
  'rgba(170,207,166,.72)',
  'rgba(246,215,183,.80)'
];

function addAmbientFlower(){
  if(document.hidden) return;
  const holder = document.getElementById('ambientFlowers');
  const f = document.createElement('span');
  f.className = 'ambient-flower';

  f.style.left = `${Math.random()*100}vw`;
  f.style.setProperty('--drift', `${Math.round(Math.random()*110-55)}px`);
  f.style.setProperty('--spin', `${Math.round(Math.random()*260-130)}deg`);
  f.style.setProperty('--flowerScale', `${(0.55+Math.random()*.45).toFixed(2)}`);
  f.style.setProperty('--flowerOpacity', `${(0.12+Math.random()*.10).toFixed(2)}`);
  f.style.setProperty('--fallDur', `${(11+Math.random()*8).toFixed(1)}s`);
  f.style.setProperty('--flower', ambientPalette[Math.floor(Math.random()*ambientPalette.length)]);

  holder.appendChild(f);
  setTimeout(()=>f.remove(), 21000);
}

function startAmbientFlowers(){
  if(ambientTimer) return;
  addAmbientFlower();
  ambientTimer = setInterval(addAmbientFlower, 1450);
}

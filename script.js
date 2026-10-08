const $=s=>document.querySelector(s);

// ==========================================
// PENGATURAN CODER (Edit di sini)
// ==========================================
const CFG = {
  nama: 'Jiwa Tercantik.',
  ucap: 'Happy level up, cantik! aku harap banyak kebahagiaan yang akan terjadi di umur ini, semoga seluruh rasa sayang dan doa baik manusia semua tertuju sama kamu, tanpa ada yang membuat kamu sedih berlebihan. Keberuntungan, Kesehatan, dan hal baik lainnya akan selalu menghampiri kamu tanpa syarat. Sekali lagi aku ucapkan, selamat tambah umur sayang, jika tahun depan semesta mengizinkan maka aku akan rayain sebaik mungkin ulang tahun kamu. tidak hanya tahun depan, tapi sampai kapanpun.',
  hdh: 'Hayooo mana hadiahnya? hadiahnya lagi muter-muter dulu yaa sayang di DC cakung, nanti kalau udah dateng pasti kamu tau. Aku ngeliat salah satu repost-an kamu di tiktok, jadi aku rasa hadiah itu cocok untuk kamu. Aku harap tahun depan aku bisa langsung ngasih hadiah ke kamu, serta kita rayain bareng-bareng yaa :D'
};

// Masukkan file gambar di folder "assets/"
const ASSET = {
  photo: 'assets/jece.jpeg',       // Foto di dalam Medali Music Box & Notes
  gift:  'assets/hadiah.jpeg',      // Foto Hadiah
  notes: 'assets/notes.jpeg',      // Ikon tombol Notes
  cake:  'assets/kue.jpeg'         // Ikon tombol Kue
};

// ==========================================
// KODE UTAMA
// ==========================================
let ctx, master, muted = false, dur = 0, t0 = 0, raf = 0, photo = '';
const fmt = (m) => 440 * Math.pow(2, (m - 69) / 12);
const SONG = [[67,.75],[67,.25],[69,1],[67,1],[72,1],[71,2],[67,.75],[67,.25],[69,1],[67,1],[74,1],[72,2],[67,.75],[67,.25],[79,1],[76,1],[72,1],[71,1],[69,2],[77,.75],[77,.25],[76,1],[72,1],[74,1],[72,3]];

function tone(f, t, d, v) {
  const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
  o.type = 'sine'; o2.type = 'triangle';
  o.frequency.value = f; o2.frequency.value = f * 4;
  g2.gain.value = .12;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + .01);
  g.gain.exponentialRampToValueAtTime(.001, t + d + .9);
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
  o.start(t); o2.start(t); o.stop(t + d + 1); o2.stop(t + d + 1);
}

function play() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  ctx.resume();
  const B = .55; let t = ctx.currentTime + .2; t0 = t;
  for (let r = 0; r < 2; r++) {
    SONG.forEach(([m, b]) => { tone(fmt(m + (r ? 12 : 0)), t, b * B, .28); t += b * B; });
  }
  [72, 76, 79, 84].forEach(m => tone(fmt(m), t, 2.4, .22)); t += 3.2; dur = t - t0;
  $('#stage').classList.add('playing'); $('#again').hidden = true; cancelAnimationFrame(raf); tick();
}

function tick() {
  const p = Math.min(1, (ctx.currentTime - t0) / dur);
  $('#prog').style.width = p * 100 + '%';
  if (p < 1) raf = requestAnimationFrame(tick);
  else { $('#stage').classList.remove('playing'); $('#again').hidden = false; }
}

$('#again').onclick = play;
$('#mute').onclick = e => {
  muted = !muted;
  if (master) master.gain.value = muted ? 0 : 1;
  e.target.textContent = muted ? 'Nyalakan Suara' : 'Bisukan';
};

const SIL = '<div class="ph"><svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#f7d5d2"/><circle cx="50" cy="38" r="17" fill="#e79aa8"/><path d="M14 100c2-26 18-40 36-40s34 14 36 40z" fill="#e48b9d"/></svg></div>';

function load(src, ok) {
  const i = new Image();
  i.onload = () => ok(src);
  i.src = src;
}

function setPhoto(src) {
  photo = src;
  $('#mimg').setAttribute('href', src);
  $('#mimg').removeAttribute('display');
  $('#sil').setAttribute('display', 'none');
  $('#polN').innerHTML = '<img src="' + src + '" alt="Foto utama">';
}

function setGiftPhoto(src) {
  $('#polGift').innerHTML = '<img src="' + src + '" alt="Foto Hadiah">';
}

function setIcon(k, src) {
  const el = document.querySelector('.ico[data-k="' + k + '"]');
  if (el) el.innerHTML = '<img src="' + src + '" alt="">';
}

function render() {
  $('#polN').innerHTML = SIL;
  $('#polGift').innerHTML = SIL;
  load(ASSET.photo, setPhoto);
  load(ASSET.gift, setGiftPhoto);
  ['notes', 'cake', 'gift'].forEach(k => load(ASSET[k], s => setIcon(k, s)));
}

$('#tNama').textContent = CFG.nama;
$('#pNama').textContent = 'Untuk ' + CFG.nama + ',';
$('#pUcap').textContent = CFG.ucap;
$('#gNote').textContent = CFG.hdh;
render();

$('#start').onclick = () => {
  play();
  $('#start').hidden = true;
  $('#mute').hidden = false;
  setTimeout(() => $('#items').classList.add('on'), 400);
};

function show(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('show'));
  if (id) $('#' + id).classList.add('show');
  scrollTo(0, 0);
}

document.querySelectorAll('.item').forEach(b => b.onclick = () => show(b.dataset.v));
document.querySelectorAll('[data-back]').forEach(b => b.onclick = () => show());

const cs = [...document.querySelectorAll('.candle')];
function check() {
  const left = cs.filter(c => !c.classList.contains('out')).length;
  $('#cmsg').textContent = left ? (left + ' lilin masih menyala') : 'Make a wish! Semua lilin sudah padam ✨';
}

cs.forEach(c => c.onclick = () => { c.classList.add('out'); check(); });
$('#relight').onclick = () => {
  cs.forEach(c => {
    c.classList.remove('out');
    c.querySelector('.smoke').style.animation = 'none';
  });
  setTimeout(() => cs.forEach(c => c.querySelector('.smoke').style.animation = ''), 50);
  $('#cmsg').textContent = 'Ketuk lilin untuk meniup';
};
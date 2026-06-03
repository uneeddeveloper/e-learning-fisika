import {
  Atom,
  Cog,
  Lightbulb,
  Magnet,
  Orbit,
  Rocket,
  Thermometer,
  Waves,
  Zap,
} from 'lucide-vue-next'

export type LabTone = 'blue' | 'indigo'
export type LabCategory = 'Mekanika' | 'Gelombang' | 'Listrik & Magnet' | 'Optik' | 'Energi & Termo' | 'Fisika Modern'

export type LabKind = 'phet' | 'custom'

export type WorksheetQuestion = {
  id: string
  prompt: string
  hint?: string
}

export type Lab = {
  id: string
  title: string
  description: string
  category: LabCategory
  level: string
  duration: string
  tone: LabTone
  icon: any
  kind: LabKind
  embedUrl?: string
  customComponent?: 'projectile'
  objectives: string[]
  worksheet: WorksheetQuestion[]
}

const categories: LabCategory[] = [
  'Mekanika',
  'Gelombang',
  'Listrik & Magnet',
  'Optik',
  'Energi & Termo',
  'Fisika Modern',
]

function categoryIcon(cat: LabCategory) {
  if (cat === 'Mekanika') return Cog
  if (cat === 'Gelombang') return Waves
  if (cat === 'Listrik & Magnet') return Zap
  if (cat === 'Optik') return Lightbulb
  if (cat === 'Energi & Termo') return Thermometer
  return Atom
}

function phetUrl(slug: string) {
  return `https://phet.colorado.edu/sims/html/${slug}/latest/${slug}_en.html`
}

// Tujuan & worksheet generik untuk lab PhET massal. Guru bisa menyesuaikan nanti.
const DEFAULT_OBJECTIVES = [
  'Mengidentifikasi variabel yang dapat diubah dan pengaruhnya terhadap hasil',
  'Menemukan pola atau hubungan antar besaran melalui eksperimen',
  'Mengaitkan hasil pengamatan dengan konsep fisika yang relevan',
]

const DEFAULT_WORKSHEET: WorksheetQuestion[] = [
  { id: 'w1', prompt: 'Variabel apa saja yang kamu ubah dalam simulasi, dan bagaimana pengaruhnya terhadap hasil yang diamati?' },
  { id: 'w2', prompt: 'Pola atau hubungan apa yang kamu temukan? Tuliskan dengan kalimatmu sendiri.', hint: 'Bandingkan kondisi ekstrem: nilai terkecil vs terbesar.' },
  { id: 'w3', prompt: 'Kaitkan hasil pengamatanmu dengan konsep/rumus fisika yang relevan, lalu berikan satu contoh penerapannya di kehidupan nyata.' },
]

// Lab yang dikurasi: punya simulasi custom dan/atau worksheet spesifik.
const curatedLabs: Lab[] = [
  {
    id: 'projectile-motion',
    title: 'Gerak Parabola Interaktif',
    description: 'Simulasi custom: ubah sudut & kecepatan awal, lihat lintasan peluru secara real-time.',
    category: 'Mekanika',
    level: 'Kelas X',
    duration: '20 menit',
    tone: 'blue',
    icon: Rocket,
    kind: 'custom',
    customComponent: 'projectile',
    objectives: [
      'Memahami komponen kecepatan horizontal dan vertikal',
      'Menyelidiki pengaruh sudut terhadap jangkauan',
      'Menemukan sudut optimum untuk jangkauan maksimum',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Pada kecepatan awal yang sama, sudut berapa yang menghasilkan jangkauan terjauh? Jelaskan mengapa.' },
      { id: 'q2', prompt: 'Bandingkan lintasan untuk sudut 30° dan 60° pada kecepatan yang sama. Apa yang kamu amati?', hint: 'Perhatikan jangkauan dan tinggi maksimum.' },
      { id: 'q3', prompt: 'Jika kecepatan awal digandakan, berapa kali lipat jangkauan maksimumnya? Buktikan dengan simulasi.' },
    ],
  },
  {
    id: 'forces-motion',
    title: 'Gaya & Gerak (Forces and Motion)',
    description: 'Tarik balok dengan gaya berbeda, lihat percepatan, gesekan, dan diagram gaya.',
    category: 'Mekanika',
    level: 'Kelas X',
    duration: '25 menit',
    tone: 'blue',
    icon: Cog,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html',
    objectives: [
      'Menerapkan Hukum Newton II (F = m·a)',
      'Mengidentifikasi peran gaya gesek',
      'Menggambarkan diagram gaya bebas (FBD)',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Pada kondisi tanpa gesekan, apa yang terjadi pada balok ketika gaya dorong dihilangkan?', hint: 'Hukum I Newton.' },
      { id: 'q2', prompt: 'Naikkan massa balok 2x lipat dengan gaya tetap. Bagaimana perubahan percepatannya?' },
      { id: 'q3', prompt: 'Mengapa gaya gesek statis bisa lebih besar dari gaya gesek kinetis? Berikan contoh dari simulasi.' },
    ],
  },
  {
    id: 'pendulum-lab',
    title: 'Bandul Sederhana (Pendulum Lab)',
    description: 'Investigasi periode bandul terhadap panjang tali, massa, dan gravitasi planet lain.',
    category: 'Mekanika',
    level: 'Kelas XI',
    duration: '20 menit',
    tone: 'indigo',
    icon: Orbit,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html',
    objectives: [
      'Menemukan hubungan periode dengan panjang tali',
      'Menguji apakah massa mempengaruhi periode',
      'Menghitung percepatan gravitasi dari data eksperimen',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Variasikan panjang tali (0.5 m, 1 m, 2 m). Bagaimana perubahan periode? Tuliskan hubungannya.' },
      { id: 'q2', prompt: 'Apakah massa beban mempengaruhi periode? Jelaskan dengan data simulasi.' },
      { id: 'q3', prompt: 'Pindah ke planet "Jupiter". Hitung g dari periode yang terukur (gunakan T = 2π√(L/g)).' },
    ],
  },
  {
    id: 'wave-on-a-string',
    title: 'Gelombang pada Tali',
    description: 'Bangkitkan pulsa & gelombang sinus, amati refleksi, frekuensi, amplitudo.',
    category: 'Gelombang',
    level: 'Kelas XI',
    duration: '20 menit',
    tone: 'indigo',
    icon: Waves,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html',
    objectives: [
      'Membedakan gelombang transversal & pulsa',
      'Memahami pengaruh tegangan tali terhadap kecepatan',
      'Mengamati refleksi pada ujung tetap & ujung bebas',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Apa perbedaan refleksi pada ujung tetap dan ujung bebas? Sketsa hasil pengamatanmu.' },
      { id: 'q2', prompt: 'Naikkan tegangan tali. Bagaimana perubahan kecepatan dan panjang gelombang (frekuensi tetap)?' },
      { id: 'q3', prompt: 'Atur "Damping" minimum, lalu hidupkan. Mengapa amplitudo berkurang seiring waktu?' },
    ],
  },
  {
    id: 'wave-interference',
    title: 'Interferensi Gelombang',
    description: 'Dua sumber air, suara, atau cahaya — observasi pola interferensi konstruktif & destruktif.',
    category: 'Gelombang',
    level: 'Kelas XI',
    duration: '25 menit',
    tone: 'blue',
    icon: Waves,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html',
    objectives: [
      'Menjelaskan superposisi gelombang',
      'Mengidentifikasi pola interferensi maksimum/minimum',
      'Memahami eksperimen celah ganda Young',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Pada mode "Two Sources", ke mana arah garis simpul (interferensi destruktif)? Jelaskan.' },
      { id: 'q2', prompt: 'Buka mode "Slits". Apa yang terjadi pada pola jika jarak celah dirapatkan?' },
      { id: 'q3', prompt: 'Bagaimana pola interferensi berubah ketika frekuensi sumber dinaikkan?' },
    ],
  },
  {
    id: 'circuit-construction',
    title: 'Membangun Rangkaian Listrik',
    description: 'Susun rangkaian DC: baterai, resistor, lampu, ammeter, voltmeter — uji Hukum Ohm.',
    category: 'Listrik & Magnet',
    level: 'Kelas XII',
    duration: '30 menit',
    tone: 'blue',
    icon: Zap,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html',
    objectives: [
      'Membedakan rangkaian seri & paralel',
      'Menerapkan Hukum Ohm (V = I·R)',
      'Menggunakan ammeter & voltmeter dengan benar',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Susun 3 resistor seri (10Ω, 20Ω, 30Ω) dengan baterai 12V. Hitung & ukur arusnya. Cocok?' },
      { id: 'q2', prompt: 'Bandingkan terang lampu pada rangkaian seri vs paralel dengan dua lampu identik.' },
      { id: 'q3', prompt: 'Apa yang terjadi jika salah satu lampu pada rangkaian paralel dilepas? Bagaimana di seri?' },
    ],
  },
  {
    id: 'magnet-and-compass',
    title: 'Magnet & Kompas',
    description: 'Visualisasi medan magnet batang, interaksi dengan kompas dan kawat berarus.',
    category: 'Listrik & Magnet',
    level: 'Kelas XII',
    duration: '15 menit',
    tone: 'indigo',
    icon: Magnet,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/magnets-and-electromagnets/latest/magnets-and-electromagnets_en.html',
    objectives: [
      'Menggambarkan garis-garis medan magnet',
      'Memahami prinsip elektromagnet',
      'Menyelidiki pengaruh jumlah lilitan & arus',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Bagaimana pola garis medan di sekitar batang magnet? Sketsa.' },
      { id: 'q2', prompt: 'Pada elektromagnet, apa yang terjadi jika jumlah lilitan dinaikkan dengan arus tetap?' },
      { id: 'q3', prompt: 'Balik arah arus pada elektromagnet. Apa yang terjadi pada kutub-kutubnya?' },
    ],
  },
  {
    id: 'bending-light',
    title: 'Pembiasan Cahaya',
    description: 'Sinar laser melalui medium berbeda — ukur sudut datang, sudut bias, indeks bias.',
    category: 'Optik',
    level: 'Kelas XI',
    duration: '20 menit',
    tone: 'blue',
    icon: Lightbulb,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_en.html',
    objectives: [
      'Menerapkan Hukum Snellius',
      'Menentukan indeks bias suatu medium',
      'Menjelaskan pemantulan internal total',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Tembakkan laser dari udara ke air pada sudut 30°. Catat sudut bias. Hitung indeks bias air.' },
      { id: 'q2', prompt: 'Naikkan sudut datang sampai cahaya tidak lagi keluar dari medium. Berapa sudut kritisnya?' },
      { id: 'q3', prompt: 'Cahaya warna apa yang paling kuat dibiaskan? Jelaskan kaitannya dengan dispersi prisma.' },
    ],
  },
  {
    id: 'energy-skate-park',
    title: 'Skate Park: Energi Mekanik',
    description: 'Skater di lintasan — amati transformasi energi kinetik ↔ potensial, peran gesekan.',
    category: 'Energi & Termo',
    level: 'Kelas X',
    duration: '20 menit',
    tone: 'indigo',
    icon: Thermometer,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_en.html',
    objectives: [
      'Memahami hukum kekekalan energi mekanik',
      'Menjelaskan peran gaya gesek terhadap energi',
      'Menghitung energi potensial & kinetik di titik tertentu',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Pada lintasan tanpa gesekan, di mana energi kinetik maksimum? Energi potensial maksimum?' },
      { id: 'q2', prompt: 'Hidupkan gesekan. Ke mana "hilangnya" energi mekanik? (Lihat termometer skater).' },
      { id: 'q3', prompt: 'Pindahkan skater ke Bulan. Bagaimana grafik energi berubah? Mengapa?' },
    ],
  },
  {
    id: 'build-an-atom',
    title: 'Bangun Atom',
    description: 'Susun proton, neutron, elektron — pelajari nomor atom, isotop, dan ion.',
    category: 'Fisika Modern',
    level: 'Kelas XII',
    duration: '15 menit',
    tone: 'blue',
    icon: Atom,
    kind: 'phet',
    embedUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html',
    objectives: [
      'Membedakan nomor atom & nomor massa',
      'Mengidentifikasi isotop & ion',
      'Memahami struktur atom dasar',
    ],
    worksheet: [
      { id: 'q1', prompt: 'Bangun atom Karbon-12 dan Karbon-14. Apa yang membedakan keduanya?' },
      { id: 'q2', prompt: 'Buat ion Litium dengan muatan +1. Berapa proton dan elektron yang kamu gunakan?' },
      { id: 'q3', prompt: 'Apa yang terjadi pada simbol unsur ketika kamu menambah/mengurangi proton? Mengapa?' },
    ],
  },
]

// Katalog PhET HTML5 (slug tervalidasi 200 OK). Worksheet & tujuan memakai default.
type PhetSeed = {
  id: string
  title: string
  description: string
  category: LabCategory
  level: string
  duration: string
  tone: LabTone
}

const phetSeeds: PhetSeed[] = [
  // —— Mekanika ——
  { id: 'balancing-act', title: 'Aksi Keseimbangan (Torsi)', description: 'Seimbangkan papan jungkat-jungkit dengan berbagai massa dan jarak — pelajari momen gaya.', category: 'Mekanika', level: 'Kelas X', duration: '20 menit', tone: 'blue' },
  { id: 'collision-lab', title: 'Lab Tumbukan', description: 'Atur massa & kecepatan dua benda, amati tumbukan lenting dan tak lenting serta kekekalan momentum.', category: 'Mekanika', level: 'Kelas XI', duration: '25 menit', tone: 'indigo' },
  { id: 'projectile-data-lab', title: 'Lab Data Gerak Parabola', description: 'Tembakkan proyektil, kumpulkan data jangkauan & waktu untuk dianalisis secara statistik.', category: 'Mekanika', level: 'Kelas XI', duration: '25 menit', tone: 'blue' },
  { id: 'masses-and-springs', title: 'Massa & Pegas', description: 'Gantungkan beban pada pegas, ukur perpanjangan, periode osilasi, dan energi pegas.', category: 'Mekanika', level: 'Kelas XI', duration: '20 menit', tone: 'indigo' },
  { id: 'masses-and-springs-basics', title: 'Massa & Pegas: Dasar', description: 'Versi sederhana: hubungan massa, perpanjangan pegas, dan getaran.', category: 'Mekanika', level: 'Kelas X', duration: '15 menit', tone: 'blue' },
  { id: 'hookes-law', title: 'Hukum Hooke', description: 'Tarik/tekan pegas dan amati hubungan gaya dengan perpanjangan serta energi potensial pegas.', category: 'Mekanika', level: 'Kelas XI', duration: '15 menit', tone: 'indigo' },
  { id: 'gravity-force-lab', title: 'Lab Gaya Gravitasi', description: 'Ukur gaya tarik gravitasi antara dua massa — uji hukum gravitasi Newton.', category: 'Mekanika', level: 'Kelas XI', duration: '20 menit', tone: 'blue' },
  { id: 'gravity-force-lab-basics', title: 'Lab Gaya Gravitasi: Dasar', description: 'Versi sederhana eksperimen gaya gravitasi antar dua benda.', category: 'Mekanika', level: 'Kelas X', duration: '15 menit', tone: 'indigo' },
  { id: 'gravity-and-orbits', title: 'Gravitasi & Orbit', description: 'Simulasikan orbit planet & bulan, amati peran gravitasi dalam gerak benda langit.', category: 'Mekanika', level: 'Kelas XI', duration: '25 menit', tone: 'blue' },
  { id: 'keplers-laws', title: 'Hukum Kepler', description: 'Selidiki orbit elips, hukum luas, dan hubungan periode-jarak planet (Hukum Kepler).', category: 'Mekanika', level: 'Kelas XI', duration: '25 menit', tone: 'indigo' },
  { id: 'friction', title: 'Gesekan', description: 'Gosokkan dua benda, amati bagaimana gesekan mengubah energi gerak menjadi panas.', category: 'Mekanika', level: 'Kelas X', duration: '15 menit', tone: 'blue' },
  { id: 'buoyancy', title: 'Gaya Apung', description: 'Celupkan benda ke fluida, selidiki gaya apung dan Hukum Archimedes.', category: 'Mekanika', level: 'Kelas XI', duration: '20 menit', tone: 'indigo' },
  { id: 'buoyancy-basics', title: 'Gaya Apung: Dasar', description: 'Versi sederhana: mengapa benda mengapung atau tenggelam.', category: 'Mekanika', level: 'Kelas X', duration: '15 menit', tone: 'blue' },
  { id: 'density', title: 'Massa Jenis', description: 'Bandingkan massa, volume, dan massa jenis berbagai benda; prediksi mengapung/tenggelam.', category: 'Mekanika', level: 'Kelas X', duration: '15 menit', tone: 'indigo' },
  { id: 'under-pressure', title: 'Tekanan Zat Cair', description: 'Ukur tekanan pada kedalaman berbeda dan berbagai fluida — tekanan hidrostatis.', category: 'Mekanika', level: 'Kelas XI', duration: '20 menit', tone: 'blue' },
  { id: 'vector-addition', title: 'Penjumlahan Vektor', description: 'Jumlahkan vektor secara grafis, uraikan komponen x dan y, lihat resultan.', category: 'Mekanika', level: 'Kelas X', duration: '20 menit', tone: 'indigo' },
  { id: 'vector-addition-equations', title: 'Penjumlahan Vektor: Persamaan', description: 'Eksplor penjumlahan vektor lewat persamaan dan representasi komponen.', category: 'Mekanika', level: 'Kelas XI', duration: '20 menit', tone: 'blue' },

  // —— Gelombang ——
  { id: 'waves-intro', title: 'Pengantar Gelombang', description: 'Bangkitkan gelombang air, suara, dan cahaya — kenali frekuensi, amplitudo, panjang gelombang.', category: 'Gelombang', level: 'Kelas XI', duration: '20 menit', tone: 'blue' },
  { id: 'sound-waves', title: 'Gelombang Bunyi', description: 'Visualisasikan rapatan-renggangan bunyi, frekuensi, dan interferensi suara.', category: 'Gelombang', level: 'Kelas XI', duration: '20 menit', tone: 'indigo' },
  { id: 'normal-modes', title: 'Modus Normal (Resonansi)', description: 'Amati pola getaran normal pada sistem massa-pegas 1D & 2D.', category: 'Gelombang', level: 'Kelas XII', duration: '20 menit', tone: 'blue' },
  { id: 'fourier-making-waves', title: 'Fourier: Membuat Gelombang', description: 'Susun gelombang kompleks dari harmonik sinus — pengantar analisis Fourier.', category: 'Gelombang', level: 'Kelas XII', duration: '25 menit', tone: 'indigo' },

  // —— Optik ——
  { id: 'geometric-optics', title: 'Optika Geometri', description: 'Bentuk bayangan oleh lensa & cermin, ukur jarak fokus dan perbesaran.', category: 'Optik', level: 'Kelas XI', duration: '25 menit', tone: 'blue' },
  { id: 'geometric-optics-basics', title: 'Optika Geometri: Dasar', description: 'Versi sederhana pembentukan bayangan oleh lensa.', category: 'Optik', level: 'Kelas XI', duration: '15 menit', tone: 'indigo' },
  { id: 'color-vision', title: 'Penglihatan Warna', description: 'Campur cahaya RGB dan filter warna untuk memahami persepsi warna.', category: 'Optik', level: 'Kelas X', duration: '15 menit', tone: 'blue' },
  { id: 'molecules-and-light', title: 'Molekul & Cahaya', description: 'Amati bagaimana molekul menyerap cahaya pada panjang gelombang berbeda.', category: 'Optik', level: 'Kelas XII', duration: '20 menit', tone: 'indigo' },

  // —— Listrik & Magnet ——
  { id: 'circuit-construction-kit-dc-virtual-lab', title: 'Rangkaian DC: Lab Virtual', description: 'Lab virtual rangkaian arus searah dengan alat ukur lengkap.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '30 menit', tone: 'indigo' },
  { id: 'circuit-construction-kit-ac', title: 'Rangkaian AC', description: 'Bangun rangkaian arus bolak-balik dengan kapasitor & induktor, amati perilakunya.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '30 menit', tone: 'blue' },
  { id: 'circuit-construction-kit-ac-virtual-lab', title: 'Rangkaian AC: Lab Virtual', description: 'Lab virtual rangkaian AC dengan komponen reaktif dan alat ukur.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '30 menit', tone: 'indigo' },
  { id: 'charges-and-fields', title: 'Muatan & Medan Listrik', description: 'Tempatkan muatan, petakan medan listrik dan garis ekipotensial.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '25 menit', tone: 'blue' },
  { id: 'coulombs-law', title: 'Hukum Coulomb', description: 'Ukur gaya elektrostatis antara dua muatan terhadap besar muatan & jarak.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '20 menit', tone: 'indigo' },
  { id: 'capacitor-lab-basics', title: 'Lab Kapasitor: Dasar', description: 'Selidiki kapasitansi terhadap luas pelat, jarak, dan dielektrik.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '25 menit', tone: 'blue' },
  { id: 'ohms-law', title: 'Hukum Ohm', description: 'Ubah tegangan & hambatan, amati perubahan arus (V = I·R).', category: 'Listrik & Magnet', level: 'Kelas X', duration: '15 menit', tone: 'indigo' },
  { id: 'resistance-in-a-wire', title: 'Hambatan pada Kawat', description: 'Selidiki pengaruh panjang, luas penampang, dan hambat jenis terhadap hambatan.', category: 'Listrik & Magnet', level: 'Kelas X', duration: '15 menit', tone: 'blue' },
  { id: 'balloons-and-static-electricity', title: 'Balon & Listrik Statis', description: 'Gosok balon ke sweater, amati perpindahan muatan dan gaya tarik-menolak.', category: 'Listrik & Magnet', level: 'Kelas X', duration: '15 menit', tone: 'indigo' },
  { id: 'john-travoltage', title: 'John Travoltage (Listrik Statis)', description: 'Kumpulkan muatan statis lalu lepaskan — pahami pelepasan muatan (percikan).', category: 'Listrik & Magnet', level: 'Kelas X', duration: '15 menit', tone: 'blue' },
  { id: 'faradays-law', title: 'Hukum Faraday', description: 'Gerakkan magnet melalui kumparan, amati timbulnya GGL induksi.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '20 menit', tone: 'indigo' },
  { id: 'faradays-electromagnetic-lab', title: 'Lab Elektromagnetik Faraday', description: 'Eksplor magnet batang, elektromagnet, generator, dan transformator.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '30 menit', tone: 'blue' },
  { id: 'generator', title: 'Generator', description: 'Putar kumparan dalam medan magnet untuk membangkitkan listrik — prinsip generator.', category: 'Listrik & Magnet', level: 'Kelas XII', duration: '20 menit', tone: 'indigo' },

  // —— Energi & Termo ——
  { id: 'energy-forms-and-changes', title: 'Bentuk & Perubahan Energi', description: 'Telusuri perubahan energi: panas, gerak, listrik, dan cahaya.', category: 'Energi & Termo', level: 'Kelas XI', duration: '25 menit', tone: 'blue' },
  { id: 'states-of-matter', title: 'Wujud Zat', description: 'Ubah suhu/tekanan, amati transisi padat-cair-gas pada level molekul.', category: 'Energi & Termo', level: 'Kelas XI', duration: '20 menit', tone: 'indigo' },
  { id: 'states-of-matter-basics', title: 'Wujud Zat: Dasar', description: 'Versi sederhana perubahan wujud zat akibat pemanasan & pendinginan.', category: 'Energi & Termo', level: 'Kelas X', duration: '15 menit', tone: 'blue' },
  { id: 'gas-properties', title: 'Sifat Gas', description: 'Selidiki hubungan tekanan, volume, suhu, dan jumlah partikel gas.', category: 'Energi & Termo', level: 'Kelas XI', duration: '25 menit', tone: 'indigo' },
  { id: 'gases-intro', title: 'Pengantar Gas', description: 'Pengenalan perilaku gas ideal dan hukum-hukum gas dasar.', category: 'Energi & Termo', level: 'Kelas XI', duration: '20 menit', tone: 'blue' },
  { id: 'diffusion', title: 'Difusi', description: 'Amati percampuran dua jenis partikel akibat gerak acak (difusi).', category: 'Energi & Termo', level: 'Kelas XI', duration: '15 menit', tone: 'indigo' },
  { id: 'greenhouse-effect', title: 'Efek Rumah Kaca', description: 'Pelajari bagaimana gas rumah kaca memerangkap radiasi inframerah.', category: 'Energi & Termo', level: 'Kelas XI', duration: '20 menit', tone: 'blue' },

  // —— Fisika Modern ——
  { id: 'blackbody-spectrum', title: 'Spektrum Benda Hitam', description: 'Ubah suhu benda hitam, amati pergeseran spektrum (Hukum Wien & Planck).', category: 'Fisika Modern', level: 'Kelas XII', duration: '20 menit', tone: 'indigo' },
  { id: 'build-a-nucleus', title: 'Bangun Inti Atom', description: 'Susun proton & neutron, jelajahi kestabilan inti dan peluruhan radioaktif.', category: 'Fisika Modern', level: 'Kelas XII', duration: '20 menit', tone: 'blue' },
  { id: 'models-of-the-hydrogen-atom', title: 'Model Atom Hidrogen', description: 'Bandingkan model atom (Bohr, de Broglie, kuantum) lewat eksperimen cahaya.', category: 'Fisika Modern', level: 'Kelas XII', duration: '25 menit', tone: 'indigo' },
  { id: 'rutherford-scattering', title: 'Hamburan Rutherford', description: 'Tembakkan partikel alfa ke inti atom — temukan struktur inti.', category: 'Fisika Modern', level: 'Kelas XII', duration: '20 menit', tone: 'blue' },
  { id: 'isotopes-and-atomic-mass', title: 'Isotop & Massa Atom', description: 'Susun isotop suatu unsur dan hitung massa atom rata-rata.', category: 'Fisika Modern', level: 'Kelas XII', duration: '15 menit', tone: 'indigo' },
  { id: 'atomic-interactions', title: 'Interaksi Atom', description: 'Selidiki gaya tarik-menolak antar atom dan energi potensial interaksinya.', category: 'Fisika Modern', level: 'Kelas XII', duration: '20 menit', tone: 'blue' },
  { id: 'quantum-measurement', title: 'Pengukuran Kuantum', description: 'Eksperimen "koin kuantum" & Stern-Gerlach — pahami superposisi dan pengukuran.', category: 'Fisika Modern', level: 'Kelas XII', duration: '25 menit', tone: 'indigo' },
]

const phetLabs: Lab[] = phetSeeds.map((s) => ({
  ...s,
  icon: categoryIcon(s.category),
  kind: 'phet',
  embedUrl: phetUrl(s.id),
  objectives: DEFAULT_OBJECTIVES,
  worksheet: DEFAULT_WORKSHEET,
}))

export function useLabs() {
  const labs: Lab[] = [...curatedLabs, ...phetLabs]

  return { labs, categories, categoryIcon }
}

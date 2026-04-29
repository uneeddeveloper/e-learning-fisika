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

export function useLabs() {
  const labs: Lab[] = [
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

  return { labs, categories, categoryIcon }
}

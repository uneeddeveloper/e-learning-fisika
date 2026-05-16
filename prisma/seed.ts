import 'dotenv/config'
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter'
import { PrismaClient } from '../app/generated/prisma/client.js'

type SeedLab = {
  slug: string
  title: string
  description: string
  category: string
  level: string
  duration: string
  tone: 'blue' | 'indigo'
  iconName: string
  kind: 'PHET' | 'CUSTOM'
  embedUrl?: string
  customComponent?: string
  objectives: string[]
  questions: { prompt: string; hint?: string }[]
}

const labs: SeedLab[] = [
  {
    slug: 'projectile-motion',
    title: 'Gerak Parabola Interaktif',
    description: 'Simulasi custom: ubah sudut & kecepatan awal, lihat lintasan peluru secara real-time.',
    category: 'Mekanika',
    level: 'Kelas X',
    duration: '20 menit',
    tone: 'blue',
    iconName: 'Rocket',
    kind: 'CUSTOM',
    customComponent: 'projectile',
    objectives: [
      'Memahami komponen kecepatan horizontal dan vertikal',
      'Menyelidiki pengaruh sudut terhadap jangkauan',
      'Menemukan sudut optimum untuk jangkauan maksimum',
    ],
    questions: [
      { prompt: 'Pada kecepatan awal yang sama, sudut berapa yang menghasilkan jangkauan terjauh? Jelaskan mengapa.' },
      { prompt: 'Bandingkan lintasan untuk sudut 30° dan 60° pada kecepatan yang sama. Apa yang kamu amati?', hint: 'Perhatikan jangkauan dan tinggi maksimum.' },
      { prompt: 'Jika kecepatan awal digandakan, berapa kali lipat jangkauan maksimumnya? Buktikan dengan simulasi.' },
    ],
  },
  {
    slug: 'forces-motion',
    title: 'Gaya & Gerak (Forces and Motion)',
    description: 'Tarik balok dengan gaya berbeda, lihat percepatan, gesekan, dan diagram gaya.',
    category: 'Mekanika',
    level: 'Kelas X',
    duration: '25 menit',
    tone: 'blue',
    iconName: 'Cog',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html',
    objectives: [
      'Menerapkan Hukum Newton II (F = m·a)',
      'Mengidentifikasi peran gaya gesek',
      'Menggambarkan diagram gaya bebas (FBD)',
    ],
    questions: [
      { prompt: 'Pada kondisi tanpa gesekan, apa yang terjadi pada balok ketika gaya dorong dihilangkan?', hint: 'Hukum I Newton.' },
      { prompt: 'Naikkan massa balok 2x lipat dengan gaya tetap. Bagaimana perubahan percepatannya?' },
      { prompt: 'Mengapa gaya gesek statis bisa lebih besar dari gaya gesek kinetis? Berikan contoh dari simulasi.' },
    ],
  },
  {
    slug: 'pendulum-lab',
    title: 'Bandul Sederhana (Pendulum Lab)',
    description: 'Investigasi periode bandul terhadap panjang tali, massa, dan gravitasi planet lain.',
    category: 'Mekanika',
    level: 'Kelas XI',
    duration: '20 menit',
    tone: 'indigo',
    iconName: 'Orbit',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html',
    objectives: [
      'Menemukan hubungan periode dengan panjang tali',
      'Menguji apakah massa mempengaruhi periode',
      'Menghitung percepatan gravitasi dari data eksperimen',
    ],
    questions: [
      { prompt: 'Variasikan panjang tali (0.5 m, 1 m, 2 m). Bagaimana perubahan periode? Tuliskan hubungannya.' },
      { prompt: 'Apakah massa beban mempengaruhi periode? Jelaskan dengan data simulasi.' },
      { prompt: 'Pindah ke planet "Jupiter". Hitung g dari periode yang terukur (gunakan T = 2π√(L/g)).' },
    ],
  },
  {
    slug: 'wave-on-a-string',
    title: 'Gelombang pada Tali',
    description: 'Bangkitkan pulsa & gelombang sinus, amati refleksi, frekuensi, amplitudo.',
    category: 'Gelombang',
    level: 'Kelas XI',
    duration: '20 menit',
    tone: 'indigo',
    iconName: 'Waves',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html',
    objectives: [
      'Membedakan gelombang transversal & pulsa',
      'Memahami pengaruh tegangan tali terhadap kecepatan',
      'Mengamati refleksi pada ujung tetap & ujung bebas',
    ],
    questions: [
      { prompt: 'Apa perbedaan refleksi pada ujung tetap dan ujung bebas? Sketsa hasil pengamatanmu.' },
      { prompt: 'Naikkan tegangan tali. Bagaimana perubahan kecepatan dan panjang gelombang (frekuensi tetap)?' },
      { prompt: 'Atur "Damping" minimum, lalu hidupkan. Mengapa amplitudo berkurang seiring waktu?' },
    ],
  },
  {
    slug: 'wave-interference',
    title: 'Interferensi Gelombang',
    description: 'Dua sumber air, suara, atau cahaya — observasi pola interferensi konstruktif & destruktif.',
    category: 'Gelombang',
    level: 'Kelas XI',
    duration: '25 menit',
    tone: 'blue',
    iconName: 'Waves',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html',
    objectives: [
      'Menjelaskan superposisi gelombang',
      'Mengidentifikasi pola interferensi maksimum/minimum',
      'Memahami eksperimen celah ganda Young',
    ],
    questions: [
      { prompt: 'Pada mode "Two Sources", ke mana arah garis simpul (interferensi destruktif)? Jelaskan.' },
      { prompt: 'Buka mode "Slits". Apa yang terjadi pada pola jika jarak celah dirapatkan?' },
      { prompt: 'Bagaimana pola interferensi berubah ketika frekuensi sumber dinaikkan?' },
    ],
  },
  {
    slug: 'circuit-construction',
    title: 'Membangun Rangkaian Listrik',
    description: 'Susun rangkaian DC: baterai, resistor, lampu, ammeter, voltmeter — uji Hukum Ohm.',
    category: 'Listrik & Magnet',
    level: 'Kelas XII',
    duration: '30 menit',
    tone: 'blue',
    iconName: 'Zap',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html',
    objectives: [
      'Membedakan rangkaian seri & paralel',
      'Menerapkan Hukum Ohm (V = I·R)',
      'Menggunakan ammeter & voltmeter dengan benar',
    ],
    questions: [
      { prompt: 'Susun 3 resistor seri (10Ω, 20Ω, 30Ω) dengan baterai 12V. Hitung & ukur arusnya. Cocok?' },
      { prompt: 'Bandingkan terang lampu pada rangkaian seri vs paralel dengan dua lampu identik.' },
      { prompt: 'Apa yang terjadi jika salah satu lampu pada rangkaian paralel dilepas? Bagaimana di seri?' },
    ],
  },
  {
    slug: 'magnet-and-compass',
    title: 'Magnet & Kompas',
    description: 'Visualisasi medan magnet batang, interaksi dengan kompas dan kawat berarus.',
    category: 'Listrik & Magnet',
    level: 'Kelas XII',
    duration: '15 menit',
    tone: 'indigo',
    iconName: 'Magnet',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/magnets-and-electromagnets/latest/magnets-and-electromagnets_en.html',
    objectives: [
      'Menggambarkan garis-garis medan magnet',
      'Memahami prinsip elektromagnet',
      'Menyelidiki pengaruh jumlah lilitan & arus',
    ],
    questions: [
      { prompt: 'Bagaimana pola garis medan di sekitar batang magnet? Sketsa.' },
      { prompt: 'Pada elektromagnet, apa yang terjadi jika jumlah lilitan dinaikkan dengan arus tetap?' },
      { prompt: 'Balik arah arus pada elektromagnet. Apa yang terjadi pada kutub-kutubnya?' },
    ],
  },
  {
    slug: 'bending-light',
    title: 'Pembiasan Cahaya',
    description: 'Sinar laser melalui medium berbeda — ukur sudut datang, sudut bias, indeks bias.',
    category: 'Optik',
    level: 'Kelas XI',
    duration: '20 menit',
    tone: 'blue',
    iconName: 'Lightbulb',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_en.html',
    objectives: [
      'Menerapkan Hukum Snellius',
      'Menentukan indeks bias suatu medium',
      'Menjelaskan pemantulan internal total',
    ],
    questions: [
      { prompt: 'Tembakkan laser dari udara ke air pada sudut 30°. Catat sudut bias. Hitung indeks bias air.' },
      { prompt: 'Naikkan sudut datang sampai cahaya tidak lagi keluar dari medium. Berapa sudut kritisnya?' },
      { prompt: 'Cahaya warna apa yang paling kuat dibiaskan? Jelaskan kaitannya dengan dispersi prisma.' },
    ],
  },
  {
    slug: 'energy-skate-park',
    title: 'Skate Park: Energi Mekanik',
    description: 'Skater di lintasan — amati transformasi energi kinetik ↔ potensial, peran gesekan.',
    category: 'Energi & Termo',
    level: 'Kelas X',
    duration: '20 menit',
    tone: 'indigo',
    iconName: 'Thermometer',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/energy-skate-park-basics/latest/energy-skate-park-basics_en.html',
    objectives: [
      'Memahami hukum kekekalan energi mekanik',
      'Menjelaskan peran gaya gesek terhadap energi',
      'Menghitung energi potensial & kinetik di titik tertentu',
    ],
    questions: [
      { prompt: 'Pada lintasan tanpa gesekan, di mana energi kinetik maksimum? Energi potensial maksimum?' },
      { prompt: 'Hidupkan gesekan. Ke mana "hilangnya" energi mekanik? (Lihat termometer skater).' },
      { prompt: 'Pindahkan skater ke Bulan. Bagaimana grafik energi berubah? Mengapa?' },
    ],
  },
  {
    slug: 'build-an-atom',
    title: 'Bangun Atom',
    description: 'Susun proton, neutron, elektron — pelajari nomor atom, isotop, dan ion.',
    category: 'Fisika Modern',
    level: 'Kelas XII',
    duration: '15 menit',
    tone: 'blue',
    iconName: 'Atom',
    kind: 'PHET',
    embedUrl: 'https://phet.colorado.edu/sims/html/build-an-atom/latest/build-an-atom_en.html',
    objectives: [
      'Membedakan nomor atom & nomor massa',
      'Mengidentifikasi isotop & ion',
      'Memahami struktur atom dasar',
    ],
    questions: [
      { prompt: 'Bangun atom Karbon-12 dan Karbon-14. Apa yang membedakan keduanya?' },
      { prompt: 'Buat ion Litium dengan muatan +1. Berapa proton dan elektron yang kamu gunakan?' },
      { prompt: 'Apa yang terjadi pada simbol unsur ketika kamu menambah/mengurangi proton? Mengapa?' },
    ],
  },
]

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL tidak ditemukan di .env')
  }

  const adapter = new PrismaTiDBCloud({ url: databaseUrl })
  const prisma = new PrismaClient({ adapter })

  console.log(`Seeding ${labs.length} lab(s)...`)

  for (const lab of labs) {
    const upserted = await prisma.lab.upsert({
      where: { slug: lab.slug },
      create: {
        slug: lab.slug,
        title: lab.title,
        description: lab.description,
        category: lab.category,
        level: lab.level,
        duration: lab.duration,
        tone: lab.tone,
        iconName: lab.iconName,
        kind: lab.kind,
        embedUrl: lab.embedUrl,
        customComponent: lab.customComponent,
        objectives: lab.objectives,
      },
      update: {
        title: lab.title,
        description: lab.description,
        category: lab.category,
        level: lab.level,
        duration: lab.duration,
        tone: lab.tone,
        iconName: lab.iconName,
        kind: lab.kind,
        embedUrl: lab.embedUrl ?? null,
        customComponent: lab.customComponent ?? null,
        objectives: lab.objectives,
      },
    })

    await prisma.labQuestion.deleteMany({ where: { labId: upserted.id } })
    await prisma.labQuestion.createMany({
      data: lab.questions.map((q, idx) => ({
        labId: upserted.id,
        order: idx + 1,
        prompt: q.prompt,
        hint: q.hint ?? null,
      })),
    })

    console.log(`  ✓ ${lab.slug} (${lab.questions.length} soal)`)
  }

  console.log('Seed selesai.')
  await prisma.$disconnect()
}

main().catch(async (err) => {
  console.error(err)
  process.exit(1)
})

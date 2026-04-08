import { Gauge, Waves, Atom, Orbit } from 'lucide-vue-next';

function useCourses() {
  const courses = [
    {
      id: "mechanics-newton",
      title: "Mekanika: Newton & Gaya",
      description: "Konsep gaya, percepatan, gaya gesek, dan aplikasi problem solving yang rapi.",
      lessons: 18,
      progress: 42,
      level: "Kelas X",
      icon: Gauge,
      tone: "blue",
      modules: [
        { id: "m1", title: "Gaya & resultan", duration: "8:20", type: "video" },
        { id: "m2", title: "Hukum Newton II (intuitif)", duration: "6 min", type: "reading" },
        { id: "m3", title: "Kuis: free body diagram", duration: "10 soal", type: "quiz" }
      ]
    },
    {
      id: "waves-resonance",
      title: "Gelombang: Interferensi & Resonansi",
      description: "Visualisasi gelombang, fase, superposisi, dan latihan intuitif.",
      lessons: 14,
      progress: 68,
      level: "Kelas XI",
      icon: Waves,
      tone: "indigo",
      modules: [
        { id: "m1", title: "Fase & superposisi", duration: "10:05", type: "video" },
        { id: "m2", title: "Interferensi (ringkas)", duration: "7 min", type: "reading" },
        { id: "m3", title: "Kuis: resonansi", duration: "8 soal", type: "quiz" }
      ]
    },
    {
      id: "atom-matter",
      title: "Atom & Struktur Materi",
      description: "Model atom, spektrum, dan jembatan menuju fisika modern.",
      lessons: 11,
      progress: 15,
      level: "Kelas XII",
      icon: Atom,
      tone: "blue",
      modules: [
        { id: "m1", title: "Spektrum & energi", duration: "9:12", type: "video" },
        { id: "m2", title: "Model atom (timeline)", duration: "5 min", type: "reading" },
        { id: "m3", title: "Kuis: emisi-absorpsi", duration: "6 soal", type: "quiz" }
      ]
    },
    {
      id: "orbit-circular",
      title: "Gerak Melingkar & Orbit",
      description: "Percepatan sentripetal, gravitasi, dan orbit yang dibuat terasa “real”.",
      lessons: 9,
      progress: 80,
      level: "Kelas XI",
      icon: Orbit,
      tone: "indigo",
      modules: [
        { id: "m1", title: "Sentripetal & perioda", duration: "7:40", type: "video" },
        { id: "m2", title: "Orbit & intuisi energi", duration: "6 min", type: "reading" },
        { id: "m3", title: "Kuis: satelit", duration: "5 soal", type: "quiz" }
      ]
    }
  ];
  return { courses };
}

export { useCourses as u };
//# sourceMappingURL=useCourses-COs92Q0Q.mjs.map

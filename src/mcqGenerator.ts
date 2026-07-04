export interface MCQ {
  q: string;
  opts: string[];
  ans: string;
  explanation: string;
}

// Template-based intelligent MCQ generator
// Generates contextual questions based on subject, topic, and learning objectives

interface QuestionTemplate {
  pattern: string;
  optionsGenerator: (topic: string, context: string[]) => string[];
  correctIndex: number;
  explanationPattern: string;
}

// Subject-specific question patterns
const subjectPatterns: Record<string, QuestionTemplate[]> = {
  default: [
    {
      pattern: "Apa yang dimaksud dengan {topic}?",
      optionsGenerator: (topic, ctx) => [
        `${topic} adalah ${ctx[0] || "konsep dasar dalam pembelajaran"}`,
        `${topic} adalah kegiatan yang tidak berhubungan dengan materi`,
        `${topic} hanya berlaku untuk orang dewasa saja`,
        `${topic} tidak memiliki manfaat dalam kehidupan`,
      ],
      correctIndex: 0,
      explanationPattern: "{topic} merupakan konsep penting yang perlu dipahami siswa",
    },
    {
      pattern: "Manfaat mempelajari {topic} dalam kehidupan sehari-hari adalah...",
      optionsGenerator: (topic) => [
        "Tidak ada manfaatnya sama sekali",
        `Membantu memahami dan menerapkan ${topic} dengan baik`,
        "Hanya untuk mendapat nilai bagus",
        "Membuat bingung dan sulit dipahami",
      ],
      correctIndex: 1,
      explanationPattern: "Mempelajari {topic} memiliki manfaat praktis dalam kehidupan",
    },
    {
      pattern: "Sikap yang tepat saat mempelajari {topic} adalah...",
      optionsGenerator: () => [
        "Malas dan tidak bersemangat",
        "Tidak perlu memperhatikan guru",
        "Antusias, tekun, dan mau bertanya",
        "Bermain sendiri di kelas",
      ],
      correctIndex: 2,
      explanationPattern: "Sikap positif sangat penting dalam proses pembelajaran",
    },
    {
      pattern: "Langkah pertama yang harus dilakukan saat belajar tentang {topic} adalah...",
      optionsGenerator: () => [
        "Langsung mengerjakan tanpa membaca",
        "Memahami konsep dasar terlebih dahulu",
        "Mencontek pekerjaan teman",
        "Tidak perlu belajar sama sekali",
      ],
      correctIndex: 1,
      explanationPattern: "Memahami konsep dasar adalah langkah awal yang penting",
    },
    {
      pattern: "Mengapa {topic} penting untuk dipelajari?",
      optionsGenerator: (topic) => [
        "Karena tidak ada gunanya",
        "Hanya untuk mengisi waktu luang",
        `Karena ${topic} berguna dalam kehidupan sehari-hari`,
        "Karena guru memaksa untuk belajar",
      ],
      correctIndex: 2,
      explanationPattern: "{topic} memiliki nilai penting dalam kehidupan nyata",
    },
    {
      pattern: "Cara terbaik untuk memahami {topic} adalah...",
      optionsGenerator: () => [
        "Belajar dengan tekun dan berlatih",
        "Tidak perlu belajar sama sekali",
        "Hanya membaca sekali saja",
        "Menghafal tanpa memahami",
      ],
      correctIndex: 0,
      explanationPattern: "Belajar tekun dan berlatih adalah kunci keberhasilan",
    },
    {
      pattern: "Apa yang harus dilakukan jika mengalami kesulitan dalam memahami {topic}?",
      optionsGenerator: () => [
        "Menyerah dan tidak belajar lagi",
        "Bertanya kepada guru atau teman",
        "Diam saja dan tidak peduli",
        "Marah dan kesal",
      ],
      correctIndex: 1,
      explanationPattern: "Bertanya adalah cara baik untuk mengatasi kesulitan belajar",
    },
    {
      pattern: "Nilai karakter yang dapat dikembangkan saat mempelajari {topic} adalah...",
      optionsGenerator: () => [
        "Kemalasan dan ketidakpedulian",
        "Ketekunan, kerja sama, dan tanggung jawab",
        "Sifat sombong dan angkuh",
        "Tidak mau berusaha",
      ],
      correctIndex: 1,
      explanationPattern: "Pembelajaran mengembangkan karakter positif siswa",
    },
    {
      pattern: "Hasil yang diharapkan setelah mempelajari {topic} adalah...",
      optionsGenerator: (topic) => [
        "Tidak ada perubahan sama sekali",
        "Menjadi lebih bingung",
        `Mampu memahami dan menerapkan ${topic}`,
        "Lupa semua yang dipelajari",
      ],
      correctIndex: 2,
      explanationPattern: "Pembelajaran bertujuan meningkatkan pemahaman dan kemampuan",
    },
    {
      pattern: "Bagaimana cara menerapkan {topic} dalam kehidupan sehari-hari?",
      optionsGenerator: (topic) => [
        "Tidak perlu diterapkan sama sekali",
        `Mempraktikkan ${topic} secara konsisten`,
        "Hanya teori tanpa praktik",
        "Mengabaikan apa yang sudah dipelajari",
      ],
      correctIndex: 1,
      explanationPattern: "Penerapan konsisten adalah kunci keberhasilan pembelajaran",
    },
  ],
};

// Subject-specific question generators
const subjectGenerators: Record<string, (topic: string, tujuan: string) => MCQ[]> = {
  "bahasa inggris": generateEnglishQuestions,
  "english": generateEnglishQuestions,
  "matematika": generateMathQuestions,
  "math": generateMathQuestions,
  "ipa": generateScienceQuestions,
  "ilmu pengetahuan alam": generateScienceQuestions,
  "sains": generateScienceQuestions,
  "science": generateScienceQuestions,
  "ips": generateSocialQuestions,
  "ilmu pengetahuan sosial": generateSocialQuestions,
  "pkn": generateCivicsQuestions,
  "ppkn": generateCivicsQuestions,
  "pendidikan kewarganegaraan": generateCivicsQuestions,
  "bahasa indonesia": generateIndonesianQuestions,
  "seni": generateArtQuestions,
  "seni budaya": generateArtQuestions,
  "sbdp": generateArtQuestions,
  "pjok": generateSportsQuestions,
  "olahraga": generateSportsQuestions,
  "pendidikan jasmani": generateSportsQuestions,
  "agama": generateReligionQuestions,
  "pai": generateReligionQuestions,
  "pendidikan agama islam": generateReligionQuestions,
};

function generateEnglishQuestions(topic: string): MCQ[] {
  const questions: MCQ[] = [];
  const topicLower = topic.toLowerCase();
  
  // Greeting-related
  if (topicLower.includes("greeting") || topicLower.includes("salam") || topicLower.includes("sapaan")) {
    questions.push(
      { q: "What is the correct greeting to say in the morning?", opts: ["Good night", "Good morning", "Good evening", "Goodbye"], ans: "B", explanation: "Good morning digunakan untuk menyapa di pagi hari" },
      { q: "How do you respond to 'How are you?'", opts: ["I am fine, thank you", "Good morning", "Goodbye", "See you"], ans: "A", explanation: "I am fine, thank you adalah respons yang tepat" },
      { q: "What do you say when meeting someone for the first time?", opts: ["Goodbye", "See you later", "Nice to meet you", "Good night"], ans: "C", explanation: "Nice to meet you digunakan saat bertemu pertama kali" },
      { q: "'Good afternoon' digunakan pada waktu...", opts: ["Pagi hari", "Siang hari", "Malam hari", "Tengah malam"], ans: "B", explanation: "Good afternoon digunakan pada siang hari (12.00-18.00)" },
      { q: "Cara yang sopan untuk mengucapkan selamat tinggal adalah...", opts: ["Go away", "Goodbye, see you later", "I hate you", "Whatever"], ans: "B", explanation: "Goodbye, see you later adalah cara sopan mengucapkan selamat tinggal" },
    );
  }
  
  // Colors
  if (topicLower.includes("color") || topicLower.includes("warna") || topicLower.includes("colour")) {
    questions.push(
      { q: "What color is the sky on a clear day?", opts: ["Red", "Green", "Blue", "Yellow"], ans: "C", explanation: "Langit cerah berwarna biru (blue)" },
      { q: "What color do you get when you mix red and yellow?", opts: ["Green", "Blue", "Orange", "Purple"], ans: "C", explanation: "Merah dan kuning menghasilkan warna oranye (orange)" },
      { q: "Bahasa Inggris dari 'hijau' adalah...", opts: ["Red", "Blue", "Green", "Yellow"], ans: "C", explanation: "Hijau dalam bahasa Inggris adalah green" },
      { q: "The color of banana is...", opts: ["Red", "Yellow", "Blue", "Green"], ans: "B", explanation: "Pisang berwarna kuning (yellow)" },
      { q: "What color is associated with stop signs?", opts: ["Green", "Blue", "Red", "White"], ans: "C", explanation: "Tanda berhenti berwarna merah (red)" },
    );
  }
  
  // Numbers
  if (topicLower.includes("number") || topicLower.includes("angka") || topicLower.includes("bilangan")) {
    questions.push(
      { q: "How do you write '5' in English?", opts: ["Four", "Five", "Six", "Seven"], ans: "B", explanation: "Angka 5 dalam bahasa Inggris adalah five" },
      { q: "What comes after 'nine'?", opts: ["Eight", "Ten", "Eleven", "Seven"], ans: "B", explanation: "Setelah nine (9) adalah ten (10)" },
      { q: "Bahasa Inggris dari angka 7 adalah...", opts: ["Six", "Seven", "Eight", "Nine"], ans: "B", explanation: "Angka 7 dalam bahasa Inggris adalah seven" },
      { q: "How many days are in a week?", opts: ["Five", "Six", "Seven", "Eight"], ans: "C", explanation: "Ada tujuh (seven) hari dalam seminggu" },
      { q: "'Twelve' adalah angka...", opts: ["10", "11", "12", "13"], ans: "C", explanation: "Twelve adalah angka 12" },
    );
  }

  // Animals
  if (topicLower.includes("animal") || topicLower.includes("hewan") || topicLower.includes("binatang")) {
    questions.push(
      { q: "What animal says 'meow'?", opts: ["Dog", "Cat", "Bird", "Fish"], ans: "B", explanation: "Kucing (cat) mengeluarkan suara 'meow'" },
      { q: "Which animal can fly?", opts: ["Fish", "Cat", "Bird", "Dog"], ans: "C", explanation: "Burung (bird) dapat terbang" },
      { q: "Bahasa Inggris dari 'gajah' adalah...", opts: ["Lion", "Tiger", "Elephant", "Monkey"], ans: "C", explanation: "Gajah dalam bahasa Inggris adalah elephant" },
      { q: "Which animal lives in water?", opts: ["Cat", "Dog", "Fish", "Bird"], ans: "C", explanation: "Ikan (fish) hidup di air" },
      { q: "The king of the jungle is...", opts: ["Tiger", "Lion", "Elephant", "Bear"], ans: "B", explanation: "Singa (lion) dijuluki raja hutan" },
    );
  }

  // Family
  if (topicLower.includes("family") || topicLower.includes("keluarga")) {
    questions.push(
      { q: "Who is your mother's husband?", opts: ["Uncle", "Father", "Brother", "Grandfather"], ans: "B", explanation: "Suami ibu adalah ayah (father)" },
      { q: "Bahasa Inggris dari 'kakak perempuan' adalah...", opts: ["Brother", "Sister", "Mother", "Aunt"], ans: "B", explanation: "Kakak perempuan adalah sister" },
      { q: "Your father's mother is your...", opts: ["Aunt", "Mother", "Grandmother", "Sister"], ans: "C", explanation: "Ibu dari ayah adalah nenek (grandmother)" },
      { q: "Who is your parent's son?", opts: ["Daughter", "Brother", "Sister", "Cousin"], ans: "B", explanation: "Anak laki-laki orang tua adalah saudara laki-laki (brother)" },
      { q: "'Uncle' dalam bahasa Indonesia adalah...", opts: ["Bibi", "Paman", "Kakek", "Ayah"], ans: "B", explanation: "Uncle artinya paman" },
    );
  }

  // Body parts
  if (topicLower.includes("body") || topicLower.includes("tubuh") || topicLower.includes("badan")) {
    questions.push(
      { q: "We use our ... to see.", opts: ["Ears", "Eyes", "Nose", "Mouth"], ans: "B", explanation: "Kita menggunakan mata (eyes) untuk melihat" },
      { q: "Bahasa Inggris dari 'tangan' adalah...", opts: ["Foot", "Hand", "Head", "Leg"], ans: "B", explanation: "Tangan dalam bahasa Inggris adalah hand" },
      { q: "We use our ... to hear sounds.", opts: ["Eyes", "Nose", "Ears", "Mouth"], ans: "C", explanation: "Kita menggunakan telinga (ears) untuk mendengar" },
      { q: "How many fingers do we have on one hand?", opts: ["Three", "Four", "Five", "Six"], ans: "C", explanation: "Kita memiliki lima (five) jari di satu tangan" },
      { q: "'Nose' digunakan untuk...", opts: ["Melihat", "Mendengar", "Mencium", "Berbicara"], ans: "C", explanation: "Hidung (nose) digunakan untuk mencium" },
    );
  }

  // Days and months
  if (topicLower.includes("day") || topicLower.includes("hari") || topicLower.includes("month") || topicLower.includes("bulan")) {
    questions.push(
      { q: "What day comes after Monday?", opts: ["Sunday", "Tuesday", "Wednesday", "Thursday"], ans: "B", explanation: "Setelah Monday adalah Tuesday" },
      { q: "Bahasa Inggris dari 'Minggu' adalah...", opts: ["Monday", "Saturday", "Sunday", "Friday"], ans: "C", explanation: "Minggu dalam bahasa Inggris adalah Sunday" },
      { q: "How many days are there in a week?", opts: ["Five", "Six", "Seven", "Eight"], ans: "C", explanation: "Ada tujuh hari dalam seminggu" },
      { q: "The first month of the year is...", opts: ["February", "January", "March", "December"], ans: "B", explanation: "Bulan pertama adalah January (Januari)" },
      { q: "Which month has 28 or 29 days?", opts: ["January", "February", "March", "April"], ans: "B", explanation: "February memiliki 28 atau 29 hari" },
    );
  }

  // Food and drinks
  if (topicLower.includes("food") || topicLower.includes("makanan") || topicLower.includes("drink") || topicLower.includes("minuman")) {
    questions.push(
      { q: "Bahasa Inggris dari 'nasi' adalah...", opts: ["Bread", "Rice", "Noodle", "Meat"], ans: "B", explanation: "Nasi dalam bahasa Inggris adalah rice" },
      { q: "What do we drink when we are thirsty?", opts: ["Rice", "Bread", "Water", "Meat"], ans: "C", explanation: "Kita minum air (water) saat haus" },
      { q: "Which one is a fruit?", opts: ["Carrot", "Apple", "Rice", "Bread"], ans: "B", explanation: "Apple (apel) adalah buah" },
      { q: "'Milk' dalam bahasa Indonesia adalah...", opts: ["Teh", "Kopi", "Susu", "Jus"], ans: "C", explanation: "Milk artinya susu" },
      { q: "We eat ... for breakfast.", opts: ["Dinner", "Lunch", "Bread and eggs", "Nothing"], ans: "C", explanation: "Kita makan roti dan telur untuk sarapan" },
    );
  }

  // Fill with default English questions if needed
  while (questions.length < 10) {
    const defaultQ: MCQ[] = [
      { q: `What is the main topic we are learning about "${topic}"?`, opts: [`Understanding ${topic} concepts`, "Playing games", "Sleeping in class", "Doing nothing"], ans: "A", explanation: `Topik utama adalah memahami konsep ${topic}` },
      { q: "Which word is a greeting in English?", opts: ["Goodbye", "Hello", "Sorry", "Please"], ans: "B", explanation: "Hello adalah kata sapaan dalam bahasa Inggris" },
      { q: "How do you say 'terima kasih' in English?", opts: ["Sorry", "Please", "Thank you", "Excuse me"], ans: "C", explanation: "Terima kasih dalam bahasa Inggris adalah thank you" },
      { q: "What should we say when we make a mistake?", opts: ["Thank you", "Hello", "Sorry", "Goodbye"], ans: "C", explanation: "Kita mengucapkan sorry saat melakukan kesalahan" },
      { q: "'Please' digunakan untuk...", opts: ["Meminta maaf", "Meminta tolong dengan sopan", "Mengucapkan selamat tinggal", "Menyapa"], ans: "B", explanation: "Please digunakan untuk meminta dengan sopan" },
      { q: "Bahasa Inggris dari 'buku' adalah...", opts: ["Pen", "Book", "Pencil", "Bag"], ans: "B", explanation: "Buku dalam bahasa Inggris adalah book" },
      { q: "Where do students study?", opts: ["Market", "School", "Hospital", "Airport"], ans: "B", explanation: "Siswa belajar di sekolah (school)" },
      { q: "A person who teaches is called a...", opts: ["Doctor", "Teacher", "Farmer", "Driver"], ans: "B", explanation: "Orang yang mengajar disebut guru (teacher)" },
      { q: "'Classroom' dalam bahasa Indonesia adalah...", opts: ["Perpustakaan", "Kantin", "Ruang kelas", "Lapangan"], ans: "C", explanation: "Classroom artinya ruang kelas" },
      { q: "What do we use to write?", opts: ["Book", "Pen", "Bag", "Table"], ans: "B", explanation: "Kita menggunakan pena (pen) untuk menulis" },
    ];
    
    for (const q of defaultQ) {
      if (questions.length < 10 && !questions.find(existing => existing.q === q.q)) {
        questions.push(q);
      }
    }
  }

  return questions.slice(0, 10);
}

function generateMathQuestions(topic: string): MCQ[] {
  const questions: MCQ[] = [];
  const topicLower = topic.toLowerCase();

  // Addition
  if (topicLower.includes("penjumlahan") || topicLower.includes("tambah") || topicLower.includes("addition")) {
    questions.push(
      { q: "Berapakah hasil dari 5 + 3?", opts: ["6", "7", "8", "9"], ans: "C", explanation: "5 + 3 = 8" },
      { q: "12 + 8 = ...", opts: ["18", "19", "20", "21"], ans: "C", explanation: "12 + 8 = 20" },
      { q: "Jika Ani memiliki 7 apel dan mendapat 5 apel lagi, berapa jumlah apel Ani sekarang?", opts: ["10", "11", "12", "13"], ans: "C", explanation: "7 + 5 = 12 apel" },
      { q: "25 + 15 = ...", opts: ["35", "40", "45", "50"], ans: "B", explanation: "25 + 15 = 40" },
      { q: "Hasil dari 18 + 7 adalah...", opts: ["23", "24", "25", "26"], ans: "C", explanation: "18 + 7 = 25" },
    );
  }

  // Subtraction
  if (topicLower.includes("pengurangan") || topicLower.includes("kurang") || topicLower.includes("subtraction")) {
    questions.push(
      { q: "Berapakah hasil dari 10 - 4?", opts: ["4", "5", "6", "7"], ans: "C", explanation: "10 - 4 = 6" },
      { q: "15 - 8 = ...", opts: ["5", "6", "7", "8"], ans: "C", explanation: "15 - 8 = 7" },
      { q: "Budi memiliki 20 kelereng, diberikan kepada temannya 8 kelereng. Berapa sisa kelereng Budi?", opts: ["10", "11", "12", "13"], ans: "C", explanation: "20 - 8 = 12 kelereng" },
      { q: "30 - 12 = ...", opts: ["16", "17", "18", "19"], ans: "C", explanation: "30 - 12 = 18" },
      { q: "Hasil dari 25 - 9 adalah...", opts: ["14", "15", "16", "17"], ans: "C", explanation: "25 - 9 = 16" },
    );
  }

  // Multiplication
  if (topicLower.includes("perkalian") || topicLower.includes("kali") || topicLower.includes("multiplication")) {
    questions.push(
      { q: "Berapakah hasil dari 3 × 4?", opts: ["10", "11", "12", "13"], ans: "C", explanation: "3 × 4 = 12" },
      { q: "5 × 6 = ...", opts: ["28", "29", "30", "31"], ans: "C", explanation: "5 × 6 = 30" },
      { q: "Jika satu kotak berisi 8 pensil, berapa pensil dalam 3 kotak?", opts: ["22", "23", "24", "25"], ans: "C", explanation: "8 × 3 = 24 pensil" },
      { q: "7 × 7 = ...", opts: ["47", "48", "49", "50"], ans: "C", explanation: "7 × 7 = 49" },
      { q: "Hasil dari 9 × 5 adalah...", opts: ["43", "44", "45", "46"], ans: "C", explanation: "9 × 5 = 45" },
    );
  }

  // Division
  if (topicLower.includes("pembagian") || topicLower.includes("bagi") || topicLower.includes("division")) {
    questions.push(
      { q: "Berapakah hasil dari 12 ÷ 3?", opts: ["2", "3", "4", "5"], ans: "C", explanation: "12 ÷ 3 = 4" },
      { q: "20 ÷ 4 = ...", opts: ["3", "4", "5", "6"], ans: "C", explanation: "20 ÷ 4 = 5" },
      { q: "Ibu membagi 18 kue kepada 6 anak sama rata. Berapa kue yang diterima setiap anak?", opts: ["2", "3", "4", "5"], ans: "B", explanation: "18 ÷ 6 = 3 kue" },
      { q: "36 ÷ 6 = ...", opts: ["4", "5", "6", "7"], ans: "C", explanation: "36 ÷ 6 = 6" },
      { q: "Hasil dari 45 ÷ 9 adalah...", opts: ["3", "4", "5", "6"], ans: "C", explanation: "45 ÷ 9 = 5" },
    );
  }

  // Fractions
  if (topicLower.includes("pecahan") || topicLower.includes("fraction")) {
    questions.push(
      { q: "Berapa nilai dari ½ + ½?", opts: ["½", "¾", "1", "1½"], ans: "C", explanation: "½ + ½ = 1" },
      { q: "Pecahan ¼ sama dengan berapa persen?", opts: ["20%", "25%", "30%", "50%"], ans: "B", explanation: "¼ = 25%" },
      { q: "Manakah pecahan yang lebih besar?", opts: ["¼", "½", "⅓", "⅕"], ans: "B", explanation: "½ adalah pecahan terbesar dari pilihan" },
      { q: "¾ - ¼ = ...", opts: ["¼", "½", "¾", "1"], ans: "B", explanation: "¾ - ¼ = ²⁄₄ = ½" },
      { q: "Jika kue dipotong menjadi 8 bagian sama besar, 2 potong sama dengan...", opts: ["¼", "⅛", "²⁄₈", "½"], ans: "A", explanation: "2/8 = ¼" },
    );
  }

  // Geometry
  if (topicLower.includes("bangun") || topicLower.includes("geometri") || topicLower.includes("bentuk") || topicLower.includes("geometry")) {
    questions.push(
      { q: "Berapa sisi yang dimiliki segitiga?", opts: ["2", "3", "4", "5"], ans: "B", explanation: "Segitiga memiliki 3 sisi" },
      { q: "Bangun datar yang memiliki 4 sisi sama panjang adalah...", opts: ["Segitiga", "Persegi", "Lingkaran", "Trapesium"], ans: "B", explanation: "Persegi memiliki 4 sisi sama panjang" },
      { q: "Berapa sudut yang dimiliki persegi panjang?", opts: ["2", "3", "4", "5"], ans: "C", explanation: "Persegi panjang memiliki 4 sudut" },
      { q: "Bangun datar yang tidak memiliki sudut adalah...", opts: ["Segitiga", "Persegi", "Lingkaran", "Trapesium"], ans: "C", explanation: "Lingkaran tidak memiliki sudut" },
      { q: "Rumus luas persegi adalah...", opts: ["p × l", "s × s", "π × r²", "½ × a × t"], ans: "B", explanation: "Luas persegi = sisi × sisi" },
    );
  }

  // Fill with default math questions
  while (questions.length < 10) {
    const defaultQ: MCQ[] = [
      { q: "Bilangan genap di bawah ini adalah...", opts: ["3", "5", "8", "9"], ans: "C", explanation: "8 adalah bilangan genap (habis dibagi 2)" },
      { q: "Bilangan ganjil di bawah ini adalah...", opts: ["2", "4", "7", "10"], ans: "C", explanation: "7 adalah bilangan ganjil" },
      { q: "Urutan bilangan dari terkecil adalah...", opts: ["5, 3, 7, 1", "1, 3, 5, 7", "7, 5, 3, 1", "3, 1, 7, 5"], ans: "B", explanation: "Urutan dari terkecil: 1, 3, 5, 7" },
      { q: "Nilai tempat angka 5 pada bilangan 152 adalah...", opts: ["Satuan", "Puluhan", "Ratusan", "Ribuan"], ans: "B", explanation: "Angka 5 berada di nilai tempat puluhan" },
      { q: "100 + 50 - 25 = ...", opts: ["120", "125", "130", "135"], ans: "B", explanation: "100 + 50 = 150, lalu 150 - 25 = 125" },
      { q: "Lambang bilangan dari 'dua ratus lima puluh' adalah...", opts: ["25", "205", "250", "2050"], ans: "C", explanation: "Dua ratus lima puluh = 250" },
      { q: "Hasil dari 8 × 0 adalah...", opts: ["0", "8", "80", "88"], ans: "A", explanation: "Bilangan apapun dikali 0 hasilnya 0" },
      { q: "15 + ... = 23", opts: ["6", "7", "8", "9"], ans: "C", explanation: "23 - 15 = 8" },
      { q: "Bilangan prima di bawah ini adalah...", opts: ["4", "6", "7", "9"], ans: "C", explanation: "7 adalah bilangan prima (hanya habis dibagi 1 dan dirinya sendiri)" },
      { q: "Kelipatan 3 yang kurang dari 15 adalah...", opts: ["3, 6, 9, 12", "3, 5, 9, 12", "3, 6, 10, 12", "3, 6, 9, 14"], ans: "A", explanation: "Kelipatan 3: 3, 6, 9, 12" },
    ];
    
    for (const q of defaultQ) {
      if (questions.length < 10 && !questions.find(existing => existing.q === q.q)) {
        questions.push(q);
      }
    }
  }

  return questions.slice(0, 10);
}

function generateScienceQuestions(topic: string): MCQ[] {
  const questions: MCQ[] = [];
  const topicLower = topic.toLowerCase();

  // Plants
  if (topicLower.includes("tumbuhan") || topicLower.includes("tanaman") || topicLower.includes("plant")) {
    questions.push(
      { q: "Bagian tumbuhan yang berfungsi menyerap air dan mineral dari tanah adalah...", opts: ["Daun", "Batang", "Akar", "Bunga"], ans: "C", explanation: "Akar berfungsi menyerap air dan mineral" },
      { q: "Proses pembuatan makanan pada tumbuhan disebut...", opts: ["Respirasi", "Fotosintesis", "Transpirasi", "Reproduksi"], ans: "B", explanation: "Fotosintesis adalah proses tumbuhan membuat makanan" },
      { q: "Tumbuhan membutuhkan ... untuk fotosintesis.", opts: ["Air, CO2, dan cahaya matahari", "Hanya air saja", "Hanya udara saja", "Hanya tanah saja"], ans: "A", explanation: "Fotosintesis membutuhkan air, CO2, dan cahaya" },
      { q: "Bagian tumbuhan yang menghasilkan biji adalah...", opts: ["Akar", "Batang", "Daun", "Buah"], ans: "D", explanation: "Buah mengandung biji untuk perkembangbiakan" },
      { q: "Fungsi daun pada tumbuhan adalah...", opts: ["Menyerap air", "Tempat fotosintesis", "Menyimpan cadangan makanan", "Menyerap mineral"], ans: "B", explanation: "Daun adalah tempat berlangsungnya fotosintesis" },
    );
  }

  // Animals
  if (topicLower.includes("hewan") || topicLower.includes("binatang") || topicLower.includes("animal")) {
    questions.push(
      { q: "Hewan yang berkembang biak dengan bertelur disebut...", opts: ["Vivipar", "Ovipar", "Ovovivipar", "Herbivora"], ans: "B", explanation: "Ovipar adalah hewan yang bertelur" },
      { q: "Contoh hewan herbivora adalah...", opts: ["Harimau", "Singa", "Sapi", "Elang"], ans: "C", explanation: "Sapi adalah hewan pemakan tumbuhan (herbivora)" },
      { q: "Hewan yang hidup di dua alam disebut...", opts: ["Mamalia", "Reptil", "Amfibi", "Aves"], ans: "C", explanation: "Amfibi hidup di darat dan air" },
      { q: "Alat pernapasan pada ikan adalah...", opts: ["Paru-paru", "Insang", "Kulit", "Trakea"], ans: "B", explanation: "Ikan bernapas menggunakan insang" },
      { q: "Hewan yang aktif di malam hari disebut...", opts: ["Diurnal", "Nokturnal", "Karnivora", "Omnivora"], ans: "B", explanation: "Nokturnal adalah hewan yang aktif di malam hari" },
    );
  }

  // Human body
  if (topicLower.includes("tubuh") || topicLower.includes("organ") || topicLower.includes("body")) {
    questions.push(
      { q: "Organ yang berfungsi memompa darah ke seluruh tubuh adalah...", opts: ["Paru-paru", "Jantung", "Hati", "Ginjal"], ans: "B", explanation: "Jantung memompa darah ke seluruh tubuh" },
      { q: "Sistem pencernaan manusia dimulai dari...", opts: ["Lambung", "Usus", "Mulut", "Kerongkongan"], ans: "C", explanation: "Pencernaan dimulai dari mulut" },
      { q: "Fungsi paru-paru adalah untuk...", opts: ["Mencerna makanan", "Memompa darah", "Bernapas", "Menyaring darah"], ans: "C", explanation: "Paru-paru berfungsi untuk bernapas" },
      { q: "Tulang terkecil dalam tubuh manusia terdapat di...", opts: ["Tangan", "Kaki", "Telinga", "Hidung"], ans: "C", explanation: "Tulang terkecil (tulang sanggurdi) ada di telinga" },
      { q: "Vitamin yang baik untuk kesehatan mata adalah...", opts: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], ans: "A", explanation: "Vitamin A baik untuk kesehatan mata" },
    );
  }

  // Energy and force
  if (topicLower.includes("energi") || topicLower.includes("gaya") || topicLower.includes("energy") || topicLower.includes("force")) {
    questions.push(
      { q: "Sumber energi terbesar di bumi adalah...", opts: ["Air", "Angin", "Matahari", "Tanah"], ans: "C", explanation: "Matahari adalah sumber energi terbesar" },
      { q: "Energi yang tersimpan dalam makanan disebut energi...", opts: ["Kinetik", "Potensial", "Kimia", "Listrik"], ans: "C", explanation: "Makanan mengandung energi kimia" },
      { q: "Gaya yang menyebabkan benda jatuh ke bawah adalah...", opts: ["Gaya gesek", "Gaya gravitasi", "Gaya magnet", "Gaya pegas"], ans: "B", explanation: "Gaya gravitasi menarik benda ke bawah" },
      { q: "Contoh energi terbarukan adalah...", opts: ["Minyak bumi", "Batu bara", "Tenaga surya", "Gas alam"], ans: "C", explanation: "Tenaga surya adalah energi terbarukan" },
      { q: "Alat yang mengubah energi listrik menjadi energi cahaya adalah...", opts: ["Kipas angin", "Lampu", "Setrika", "Rice cooker"], ans: "B", explanation: "Lampu mengubah energi listrik menjadi cahaya" },
    );
  }

  // Fill with default science questions
  while (questions.length < 10) {
    const defaultQ: MCQ[] = [
      { q: "Air mendidih pada suhu...", opts: ["50°C", "75°C", "100°C", "150°C"], ans: "C", explanation: "Air mendidih pada suhu 100°C" },
      { q: "Wujud air yang beku adalah...", opts: ["Cair", "Gas", "Padat", "Plasma"], ans: "C", explanation: "Air beku berwujud padat (es)" },
      { q: "Benda yang dapat ditarik magnet disebut...", opts: ["Magnetis", "Konduktor", "Isolator", "Plastik"], ans: "A", explanation: "Benda magnetis dapat ditarik magnet" },
      { q: "Matahari terbit dari arah...", opts: ["Barat", "Utara", "Timur", "Selatan"], ans: "C", explanation: "Matahari terbit dari arah timur" },
      { q: "Gas yang kita hirup saat bernapas adalah...", opts: ["Karbondioksida", "Nitrogen", "Oksigen", "Hidrogen"], ans: "C", explanation: "Kita menghirup oksigen saat bernapas" },
      { q: "Pelangi terjadi karena...", opts: ["Angin kencang", "Pembiasan cahaya", "Hujan lebat", "Petir"], ans: "B", explanation: "Pelangi terjadi karena pembiasan cahaya matahari" },
      { q: "Planet terdekat dengan matahari adalah...", opts: ["Venus", "Merkurius", "Bumi", "Mars"], ans: "B", explanation: "Merkurius adalah planet terdekat dengan matahari" },
      { q: "Hewan yang memiliki tulang belakang disebut...", opts: ["Invertebrata", "Vertebrata", "Herbivora", "Karnivora"], ans: "B", explanation: "Vertebrata adalah hewan bertulang belakang" },
      { q: "Siklus hidup kupu-kupu dimulai dari...", opts: ["Kepompong", "Ulat", "Telur", "Kupu-kupu dewasa"], ans: "C", explanation: "Siklus dimulai dari telur" },
      { q: "Bagian mata yang memberi warna adalah...", opts: ["Pupil", "Kornea", "Iris", "Retina"], ans: "C", explanation: "Iris memberi warna pada mata" },
    ];
    
    for (const q of defaultQ) {
      if (questions.length < 10 && !questions.find(existing => existing.q === q.q)) {
        questions.push(q);
      }
    }
  }

  return questions.slice(0, 10);
}

function generateSocialQuestions(topic: string): MCQ[] {
  const questions: MCQ[] = [];
  const topicLower = topic.toLowerCase();

  if (topicLower.includes("peta") || topicLower.includes("map")) {
    questions.push(
      { q: "Simbol pada peta yang menunjukkan arah mata angin disebut...", opts: ["Legenda", "Skala", "Kompas", "Judul"], ans: "C", explanation: "Kompas menunjukkan arah mata angin" },
      { q: "Perbandingan jarak pada peta dengan jarak sebenarnya disebut...", opts: ["Legenda", "Skala", "Simbol", "Kompas"], ans: "B", explanation: "Skala menunjukkan perbandingan jarak" },
    );
  }

  // Default social questions
  const defaultQ: MCQ[] = [
    { q: "Ibu kota negara Indonesia adalah...", opts: ["Surabaya", "Bandung", "Jakarta", "Yogyakarta"], ans: "C", explanation: "Jakarta adalah ibu kota Indonesia" },
    { q: "Hari kemerdekaan Indonesia diperingati setiap tanggal...", opts: ["17 Agustus", "1 Juni", "28 Oktober", "10 November"], ans: "A", explanation: "Indonesia merdeka tanggal 17 Agustus 1945" },
    { q: "Presiden pertama Indonesia adalah...", opts: ["Soekarno", "Soeharto", "Habibie", "Megawati"], ans: "A", explanation: "Ir. Soekarno adalah presiden pertama Indonesia" },
    { q: "Pulau terbesar di Indonesia adalah...", opts: ["Jawa", "Sumatera", "Kalimantan", "Sulawesi"], ans: "C", explanation: "Kalimantan adalah pulau terbesar di Indonesia" },
    { q: "Mata uang negara Indonesia adalah...", opts: ["Ringgit", "Rupiah", "Dollar", "Peso"], ans: "B", explanation: "Rupiah adalah mata uang Indonesia" },
    { q: "Bendera negara Indonesia berwarna...", opts: ["Merah Putih", "Merah Kuning", "Biru Putih", "Hijau Putih"], ans: "A", explanation: "Bendera Indonesia berwarna Merah Putih" },
    { q: "Lagu kebangsaan Indonesia adalah...", opts: ["Garuda Pancasila", "Indonesia Raya", "Tanah Airku", "Bagimu Negeri"], ans: "B", explanation: "Indonesia Raya adalah lagu kebangsaan" },
    { q: "Sumpah Pemuda diperingati setiap tanggal...", opts: ["17 Agustus", "28 Oktober", "10 November", "1 Juni"], ans: "B", explanation: "Sumpah Pemuda diperingati tanggal 28 Oktober" },
    { q: "Lambang negara Indonesia adalah...", opts: ["Harimau", "Garuda", "Elang", "Rajawali"], ans: "B", explanation: "Garuda Pancasila adalah lambang negara" },
    { q: "Jumlah sila dalam Pancasila adalah...", opts: ["4", "5", "6", "7"], ans: "B", explanation: "Pancasila memiliki 5 sila" },
  ];

  for (const q of defaultQ) {
    if (questions.length < 10) {
      questions.push(q);
    }
  }

  return questions.slice(0, 10);
}

function generateCivicsQuestions(topic: string, tujuan: string): MCQ[] {
  const questions: MCQ[] = [
    { q: "Sila pertama Pancasila berbunyi...", opts: ["Kemanusiaan yang adil dan beradab", "Ketuhanan Yang Maha Esa", "Persatuan Indonesia", "Kerakyatan yang dipimpin oleh hikmat"], ans: "B", explanation: "Sila pertama: Ketuhanan Yang Maha Esa" },
    { q: "Sikap yang mencerminkan sila Persatuan Indonesia adalah...", opts: ["Memilih-milih teman", "Menghargai perbedaan", "Mementingkan diri sendiri", "Tidak mau bekerja sama"], ans: "B", explanation: "Menghargai perbedaan mencerminkan persatuan" },
    { q: "Contoh perilaku yang sesuai dengan Pancasila adalah...", opts: ["Berkelahi dengan teman", "Mencontek saat ujian", "Menolong teman yang kesulitan", "Membuang sampah sembarangan"], ans: "C", explanation: "Menolong teman adalah perilaku terpuji" },
    { q: "Lambang sila kedua Pancasila adalah...", opts: ["Bintang", "Rantai", "Pohon beringin", "Kepala banteng"], ans: "B", explanation: "Rantai melambangkan sila kedua" },
    { q: "Musyawarah untuk mufakat merupakan pengamalan sila ke...", opts: ["Dua", "Tiga", "Empat", "Lima"], ans: "C", explanation: "Sila keempat tentang musyawarah" },
    { q: "Gotong royong mencerminkan nilai...", opts: ["Individualisme", "Kebersamaan", "Egoisme", "Kemalasan"], ans: "B", explanation: "Gotong royong mencerminkan kebersamaan" },
  ];

  return [...questions, ...contextualQuestions(topic, tujuan, 4)].slice(0, 10);
}

function generateIndonesianQuestions(topic: string): MCQ[] {
  const questions: MCQ[] = [];
  const topicLower = topic.toLowerCase();

  if (topicLower.includes("puisi") || topicLower.includes("sajak")) {
    questions.push(
      { q: "Puisi adalah karya sastra yang menggunakan...", opts: ["Bahasa sehari-hari", "Bahasa yang indah dan berirama", "Bahasa ilmiah", "Bahasa asing"], ans: "B", explanation: "Puisi menggunakan bahasa indah dan berirama" },
      { q: "Rima dalam puisi adalah...", opts: ["Judul puisi", "Persamaan bunyi akhir", "Nama penulis", "Tema puisi"], ans: "B", explanation: "Rima adalah persamaan bunyi akhir baris" },
    );
  }

  if (topicLower.includes("cerita") || topicLower.includes("narasi") || topicLower.includes("dongeng")) {
    questions.push(
      { q: "Tokoh utama dalam cerita disebut...", opts: ["Antagonis", "Protagonis", "Figuran", "Narator"], ans: "B", explanation: "Protagonis adalah tokoh utama" },
      { q: "Bagian cerita yang berisi pengenalan tokoh dan latar disebut...", opts: ["Konflik", "Klimaks", "Orientasi", "Resolusi"], ans: "C", explanation: "Orientasi berisi pengenalan cerita" },
    );
  }

  // Default Indonesian questions
  const defaultQ: MCQ[] = [
    { q: "Kata yang tepat untuk melengkapi kalimat 'Ani ... ke sekolah setiap hari' adalah...", opts: ["pergi", "makan", "tidur", "bermain"], ans: "A", explanation: "Pergi ke sekolah adalah kegiatan yang tepat" },
    { q: "Huruf kapital digunakan pada...", opts: ["Setiap kata", "Awal kalimat dan nama orang", "Akhir kalimat", "Kata kerja"], ans: "B", explanation: "Huruf kapital untuk awal kalimat dan nama" },
    { q: "Tanda baca yang digunakan di akhir kalimat tanya adalah...", opts: ["Titik (.)", "Koma (,)", "Tanda tanya (?)", "Tanda seru (!)"], ans: "C", explanation: "Kalimat tanya diakhiri tanda tanya" },
    { q: "Sinonim dari kata 'pandai' adalah...", opts: ["Bodoh", "Cerdas", "Malas", "Lambat"], ans: "B", explanation: "Cerdas adalah sinonim dari pandai" },
    { q: "Antonim dari kata 'besar' adalah...", opts: ["Tinggi", "Panjang", "Kecil", "Lebar"], ans: "C", explanation: "Kecil adalah lawan kata dari besar" },
    { q: "Kalimat yang menggunakan kata kerja adalah...", opts: ["Rumah itu besar", "Ayah membaca koran", "Bunga itu indah", "Langit biru"], ans: "B", explanation: "Membaca adalah kata kerja" },
    { q: "Kata 'sangat' dalam kalimat termasuk jenis kata...", opts: ["Kata benda", "Kata kerja", "Kata sifat", "Kata keterangan"], ans: "D", explanation: "Sangat adalah kata keterangan" },
    { q: "Ide pokok paragraf biasanya terdapat pada...", opts: ["Kalimat terakhir saja", "Kalimat utama", "Setiap kalimat", "Tidak ada"], ans: "B", explanation: "Ide pokok ada pada kalimat utama" },
    { q: "Fungsi tanda koma (,) adalah...", opts: ["Mengakhiri kalimat", "Memisahkan unsur dalam kalimat", "Menunjukkan pertanyaan", "Menunjukkan seruan"], ans: "B", explanation: "Koma untuk memisahkan unsur kalimat" },
    { q: "Kata baku dari 'nggak' adalah...", opts: ["Engak", "Ndak", "Tidak", "Gak"], ans: "C", explanation: "Tidak adalah bentuk baku" },
  ];

  for (const q of defaultQ) {
    if (questions.length < 10 && !questions.find(existing => existing.q === q.q)) {
      questions.push(q);
    }
  }

  return questions.slice(0, 10);
}

function generateArtQuestions(topic: string, tujuan: string): MCQ[] {
  const questions: MCQ[] = [
    { q: "Warna primer terdiri dari...", opts: ["Hijau, oranye, ungu", "Merah, kuning, biru", "Hitam, putih, abu-abu", "Coklat, pink, cyan"], ans: "B", explanation: "Warna primer: merah, kuning, biru" },
    { q: "Hasil pencampuran warna merah dan kuning adalah...", opts: ["Hijau", "Ungu", "Oranye", "Biru"], ans: "C", explanation: "Merah + kuning = oranye" },
    { q: "Garis yang melengkung disebut garis...", opts: ["Lurus", "Lengkung", "Patah", "Zig-zag"], ans: "B", explanation: "Garis yang tidak lurus disebut garis lengkung" },
    { q: "Seni rupa dua dimensi memiliki...", opts: ["Panjang saja", "Panjang dan lebar", "Panjang, lebar, dan tinggi", "Tinggi saja"], ans: "B", explanation: "2D memiliki panjang dan lebar" },
    { q: "Contoh karya seni rupa tiga dimensi adalah...", opts: ["Lukisan", "Foto", "Patung", "Gambar"], ans: "C", explanation: "Patung adalah karya 3 dimensi" },
    { q: "Tempo cepat dalam musik disebut...", opts: ["Largo", "Adagio", "Allegro", "Andante"], ans: "C", explanation: "Allegro adalah tempo cepat" },
  ];

  return [...questions, ...contextualQuestions(topic, tujuan, 4)].slice(0, 10);
}

function generateSportsQuestions(topic: string, tujuan: string): MCQ[] {
  const questions: MCQ[] = [
    { q: "Gerakan senam yang baik untuk pemanasan adalah...", opts: ["Langsung lari cepat", "Stretching/peregangan", "Angkat beban berat", "Tidur"], ans: "B", explanation: "Peregangan penting untuk pemanasan" },
    { q: "Manfaat olahraga teratur adalah...", opts: ["Membuat malas", "Menyehatkan tubuh", "Membuat lemah", "Tidak ada manfaat"], ans: "B", explanation: "Olahraga teratur menyehatkan tubuh" },
    { q: "Gerakan mengayunkan tangan ke depan dan belakang saat berjalan disebut...", opts: ["Langkah", "Ayunan lengan", "Lompatan", "Putaran"], ans: "B", explanation: "Ayunan lengan membantu keseimbangan" },
    { q: "Sikap tubuh yang benar saat berdiri adalah...", opts: ["Membungkuk", "Tegak dan seimbang", "Miring ke kiri", "Miring ke kanan"], ans: "B", explanation: "Postur tegak dan seimbang adalah yang benar" },
    { q: "Lama waktu pemanasan yang baik sebelum olahraga adalah...", opts: ["1 menit", "5-10 menit", "30 menit", "1 jam"], ans: "B", explanation: "Pemanasan idealnya 5-10 menit" },
    { q: "Posisi start dalam lari jarak pendek adalah...", opts: ["Berdiri tegak", "Jongkok", "Duduk", "Tidur"], ans: "B", explanation: "Start jongkok untuk lari jarak pendek" },
  ];

  return [...questions, ...contextualQuestions(topic, tujuan, 4)].slice(0, 10);
}

function generateReligionQuestions(topic: string, tujuan: string): MCQ[] {
  const questions: MCQ[] = [
    { q: "Sikap yang mencerminkan rasa syukur adalah...", opts: ["Mengeluh terus", "Berterima kasih atas nikmat", "Tidak pernah puas", "Iri dengan orang lain"], ans: "B", explanation: "Syukur adalah berterima kasih atas nikmat" },
    { q: "Perilaku jujur artinya...", opts: ["Berbohong", "Berkata sesuai kenyataan", "Menipu orang lain", "Menyembunyikan kebenaran"], ans: "B", explanation: "Jujur adalah berkata sesuai kenyataan" },
    { q: "Sikap tolong-menolong termasuk perilaku...", opts: ["Tercela", "Terpuji", "Buruk", "Jahat"], ans: "B", explanation: "Tolong-menolong adalah perilaku terpuji" },
    { q: "Menghormati orang tua adalah...", opts: ["Tidak penting", "Kewajiban anak", "Boleh dilakukan boleh tidak", "Hanya untuk anak baik"], ans: "B", explanation: "Menghormati orang tua adalah kewajiban" },
    { q: "Memaafkan kesalahan orang lain adalah sikap...", opts: ["Lemah", "Mulia", "Bodoh", "Rugi"], ans: "B", explanation: "Memaafkan adalah sikap mulia" },
    { q: "Sikap rendah hati artinya...", opts: ["Merasa paling hebat", "Tidak sombong", "Meremehkan orang lain", "Membanggakan diri"], ans: "B", explanation: "Rendah hati adalah tidak sombong" },
  ];

  return [...questions, ...contextualQuestions(topic, tujuan, 4)].slice(0, 10);
}

// Menghasilkan soal yang benar-benar merujuk ke topik/materi ("{topic}") yang
// diisi guru, dipakai untuk mapel yang tidak punya bank soal kontekstual sendiri.
function contextualQuestions(topic: string, tujuan: string, count: number): MCQ[] {
  const patterns = subjectPatterns.default;
  const context = tujuan.split(/[,.]/).map((s) => s.trim()).filter(Boolean);
  const questions: MCQ[] = [];

  for (let i = 0; i < patterns.length && questions.length < count; i++) {
    const pattern = patterns[i];
    const q = pattern.pattern.replace(/{topic}/g, topic);
    const opts = pattern.optionsGenerator(topic, context);
    const ans = ["A", "B", "C", "D"][pattern.correctIndex];
    const explanation = pattern.explanationPattern.replace(/{topic}/g, topic);

    questions.push({ q, opts, ans, explanation });
  }

  return questions;
}

function generateGenericQuestions(topic: string, tujuan: string): MCQ[] {
  return contextualQuestions(topic, tujuan, 10);
}

// Main export function
export function generateMCQLocally(mapel: string, tema: string, tujuan: string): MCQ[] {
  const mapelLower = mapel.toLowerCase().trim();
  
  // Find subject-specific generator
  for (const [key, generator] of Object.entries(subjectGenerators)) {
    if (mapelLower.includes(key) || key.includes(mapelLower)) {
      const questions = generator(tema, tujuan);
      if (questions.length >= 10) {
        return shuffleQuestions(questions);
      }
    }
  }
  
  // Fallback to generic questions
  return shuffleQuestions(generateGenericQuestions(tema, tujuan));
}

function shuffleQuestions(questions: MCQ[]): MCQ[] {
  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 10);
}

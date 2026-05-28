import { Question } from './types';

export const questionsData: Question[] = [
  // ==============================================
  // BAGIAN 1: PILIHAN GANDA (1 - 20)
  // ==============================================
  {
    id: 1,
    type: 'pilihan-ganda',
    questionText: 'Secara bahasa, kata Tawadhu berarti ....',
    options: [
      { key: 'A', text: 'Merasa diri lebih tinggi dan mulia' },
      { key: 'B', text: 'Merendahkan diri atau tidak sombong' },
      { key: 'C', text: 'Merasa diri tidak berharga dan lemah' },
      { key: 'D', text: 'Menunjukkan kehebatan diri kepada orang lain' }
    ],
    correctKey: 'B',
    explanation: 'Tawadhu artinya merendahkan diri di hadapan Allah dan tidak sombong kepada manusia, bukan merasa diri rendah atau tidak berharga.'
  },
  {
    id: 2,
    type: 'pilihan-ganda',
    questionText: 'Dasar hukum bersikap tawadhu terdapat dalam Al-Qur’an surah ....',
    options: [
      { key: 'A', text: 'Al-Hujurat ayat 13' },
      { key: 'B', text: 'Al-Baqarah ayat 183' },
      { key: 'C', text: 'Ali Imran ayat 104' },
      { key: 'D', text: 'An-Nisa ayat 59' }
    ],
    correctKey: 'A',
    explanation: 'Q.S. Al-Hujurat ayat 13 menjelaskan tentang persamaan derajat manusia dan perintah bertawadhu serta bertakwa.'
  },
  {
    id: 3,
    type: 'pilihan-ganda',
    questionText: 'Sikap yang bertentangan dengan tawadhu adalah ....',
    options: [
      { key: 'A', text: 'Dermawan' },
      { key: 'B', text: 'Pemberani' },
      { key: 'C', text: 'Sombong / Takabur' },
      { key: 'D', text: 'Penyayang' }
    ],
    correctKey: 'C',
    explanation: 'Tawadhu adalah lawan kata dari sombong. Orang yang tawadhu pasti tidak sombong.'
  },
  {
    id: 4,
    type: 'pilihan-ganda',
    questionText: 'Berikut ini yang bukan merupakan ciri orang bertawadhu adalah ....',
    options: [
      { key: 'A', text: 'Mau menerima pendapat orang lain yang benar' },
      { key: 'B', text: 'Berbicara dengan nada lemah lembut' },
      { key: 'C', text: 'Selalu merasa diri paling hebat dan pandai' },
      { key: 'D', text: 'Tidak memandang rendah orang lain' }
    ],
    correctKey: 'C',
    explanation: 'Merasa diri paling hebat adalah ciri orang yang sombong, bukan tawadhu.'
  },
  {
    id: 5,
    type: 'pilihan-ganda',
    questionText: 'Tasamuh menurut istilah berarti sikap ....',
    options: [
      { key: 'A', text: 'Saling memaksakan kehendak' },
      { key: 'B', text: 'Saling menghormati dan menghargai perbedaan' },
      { key: 'C', text: 'Menganggap semua agama sama benarnya' },
      { key: 'D', text: 'Saling menolak pendapat orang lain' }
    ],
    correctKey: 'B',
    explanation: 'Tasamuh adalah toleransi, menghargai perbedaan tanpa harus membenarkan ajaran yang berbeda.'
  },
  {
    id: 6,
    type: 'pilihan-ganda',
    questionText: 'Dasar hukum sikap tasamuh terdapat dalam Q.S. Al-Kafirun ayat 6 yang berbunyi ....',
    options: [
      { key: 'A', text: 'Bagimu agamamu, dan bagiku agamaku' },
      { key: 'B', text: 'Tolong-menolonglah kamu dalam kebaikan' },
      { key: 'C', text: 'Sesungguhnya orang yang paling mulia...' },
      { key: 'D', text: 'Janganlah kamu mengikuti apa yang tidak kamu ketahui' }
    ],
    correctKey: 'A',
    explanation: 'Ayat ini menjadi dasar toleransi dalam beragama, kita menghormati keyakinan orang lain namun tetap teguh pada keyakinan sendiri.'
  },
  {
    id: 7,
    type: 'pilihan-ganda',
    questionText: 'Sikap tasamuh paling tepat diterapkan dalam bidang ....',
    options: [
      { key: 'A', text: 'Akidah dan Ibadah' },
      { key: 'B', text: 'Hukum Waris' },
      { key: 'C', text: 'Kemasyarakatan dan Muamalah' },
      { key: 'D', text: 'Hukum Pidana' }
    ],
    correctKey: 'C',
    explanation: 'Dalam masalah akidah dan ibadah tidak boleh ada kompromi, sedangkan dalam kemasyarakatan kita harus saling menghargai.'
  },
  {
    id: 8,
    type: 'pilihan-ganda',
    questionText: 'Ta’awun artinya sikap ....',
    options: [
      { key: 'A', text: 'Saling bermusuhan' },
      { key: 'B', text: 'Saling tolong-menolong' },
      { key: 'C', text: 'Saling bersaing' },
      { key: 'D', text: 'Saling menolak' }
    ],
    correctKey: 'B',
    explanation: 'Ta\'awun berasal dari kata Aun yang berarti tolong, jadi artinya saling tolong-menolong.'
  },
  {
    id: 9,
    type: 'pilihan-ganda',
    questionText: 'Allah memerintahkan untuk saling tolong-menolong dalam ....',
    options: [
      { key: 'A', text: 'Segala hal baik maupun buruk' },
      { key: 'B', text: 'Kebaikan dan Ketakwaan' },
      { key: 'C', text: 'Perbuatan dosa dan permusuhan' },
      { key: 'D', text: 'Hal yang mendatangkan keuntungan saja' }
    ],
    correctKey: 'B',
    explanation: 'Sesuai Q.S. Al-Maidah ayat 2: "...dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan janganlah kamu tolong-menolong dalam berbuat dosa dan pelanggaran".'
  },
  {
    id: 10,
    type: 'pilihan-ganda',
    questionText: 'Contoh perilaku ta’awun yang benar adalah ....',
    options: [
      { key: 'A', text: 'Membantu teman menyontek saat ujian' },
      { key: 'B', text: 'Membantu korban bencana alam dengan ikhlas' },
      { key: 'C', text: 'Membantu orang merampok' },
      { key: 'D', text: 'Membiarkan teman jatuh' }
    ],
    correctKey: 'B',
    explanation: 'Pertolongan harus pada hal yang baik dan benar. Membantu menyontek atau kejahatan hukumnya dilarang.'
  },
  {
    id: 11,
    type: 'pilihan-ganda',
    questionText: 'Dasar hukum beretika atau adab dalam komunikasi terdapat dalam Al-Qur’an surah ....',
    options: [
      { key: 'A', text: 'Al-Hujurat ayat 11-12' },
      { key: 'B', text: 'Al-Maidah ayat 2' },
      { key: 'C', text: 'Al-Kafirun ayat 6' },
      { key: 'D', text: 'An-Nasr ayat 3' }
    ],
    correctKey: 'A',
    explanation: 'Q.S. Al-Hujurat ayat 11-12 melarang mengejek, mencela, berprasangka buruk, dan mencari-cari kesalahan orang lain.'
  },
  {
    id: 12,
    type: 'pilihan-ganda',
    questionText: 'Menyebarkan berita yang belum jelas kebenarannya di media sosial hukumnya adalah ....',
    options: [
      { key: 'A', text: 'Boleh-boleh saja' },
      { key: 'B', text: 'Sunnah dianjurkan' },
      { key: 'C', text: 'Dilarang dan berdosa' },
      { key: 'D', text: 'Wajib bagi setiap muslim' }
    ],
    correctKey: 'C',
    explanation: 'Hal ini termasuk menyebarkan berita bohong atau fitnah yang dilarang keras dalam Islam karena merusak ketenangan masyarakat.'
  },
  {
    id: 13,
    type: 'pilihan-ganda',
    questionText: 'Berikut ini yang termasuk bahaya tidak beradab di media sosial adalah ....',
    options: [
      { key: 'A', text: 'Mendapat banyak teman baik' },
      { key: 'B', text: 'Terjadi perselisihan dan permusuhan' },
      { key: 'C', text: 'Disukai banyak orang' },
      { key: 'D', text: 'Mendapat pahala yang besar' }
    ],
    correctKey: 'B',
    explanation: 'Perilaku buruk di medsos seperti menghina atau menyebar kebencian pasti akan memicu pertengkaran dan permusuhan.'
  },
  {
    id: 14,
    type: 'pilihan-ganda',
    questionText: 'Nama asli Abu Bakar As-Siddiq sebelum masuk Islam adalah ....',
    options: [
      { key: 'A', text: 'Umar bin Khattab' },
      { key: 'B', text: 'Amr bin Utsman' },
      { key: 'C', text: 'Abdullah bin Abi Quhafah' },
      { key: 'D', text: 'Ali bin Abi Thalib' }
    ],
    correctKey: 'C',
    explanation: 'Nama aslinya adalah Abdullah bin Abi Quhafah, kemudian dikenal dengan sebutan Abu Bakar dan diberi gelar As-Siddiq oleh Nabi.'
  },
  {
    id: 15,
    type: 'pilihan-ganda',
    questionText: 'Gelar As-Siddiq yang diberikan kepada Abu Bakar berarti ....',
    options: [
      { key: 'A', text: 'Yang membenarkan / memercayai kebenaran' },
      { key: 'B', text: 'Yang paling berani berperang' },
      { key: 'C', text: 'Yang paling kaya dan dermawan' },
      { key: 'D', text: 'Yang paling bijaksana memimpin' }
    ],
    correctKey: 'A',
    explanation: 'Beliau diberi gelar ini karena beliau adalah orang yang langsung membenarkan dan percaya sepenuhnya kepada Rasulullah tanpa ragu sedikitpun.'
  },
  {
    id: 16,
    type: 'pilihan-ganda',
    questionText: 'Abu Bakar masuk Islam pada usia ....',
    options: [
      { key: 'A', text: '25 Tahun' },
      { key: 'B', text: '35 Tahun' },
      { key: 'C', text: '40 Tahun' },
      { key: 'D', text: '50 Tahun' }
    ],
    correctKey: 'B',
    explanation: 'Beliau masuk Islam pada usia sekitar 35 tahun dan menjadi orang pertama yang masuk Islam dari kalangan laki-laki dewasa.'
  },
  {
    id: 17,
    type: 'pilihan-ganda',
    questionText: 'Peran Abu Bakar saat peristiwa Hijrah adalah ....',
    options: [
      { key: 'A', text: 'Menjadi pemimpin pasukan' },
      { key: 'B', text: 'Menjadi juru tulis wahyu' },
      { key: 'C', text: 'Mendampingi Rasulullah bersembunyi di Gua Tsur' },
      { key: 'D', text: 'Menyebarkan Islam ke Yatsrib' }
    ],
    correctKey: 'C',
    explanation: 'Beliau setia menemani Rasulullah, bahkan saat bersembunyi di Gua Tsur selama 3 hari dari kejaran kaum Quraisy.'
  },
  {
    id: 18,
    type: 'pilihan-ganda',
    questionText: 'Jasa terbesar Abu Bakar bagi umat Islam setelah wafatnya Nabi adalah ....',
    options: [
      { key: 'A', text: 'Membangun Masjidil Haram' },
      { key: 'B', text: 'Menyatukan dan membukukan lembaran Al-Qur’an' },
      { key: 'C', text: 'Menetapkan kalender Hijriah' },
      { key: 'D', text: 'Menaklukkan Persia dan Romawi' }
    ],
    correctKey: 'B',
    explanation: 'Beliau memerintahkan Zaid bin Tsabit untuk mengumpulkan ayat-ayat Al-Qur\'an yang berserakan agar tidak hilang setelah banyak penghafal gugur dalam perang.'
  },
  {
    id: 19,
    type: 'pilihan-ganda',
    questionText: 'Abu Bakar menjadi Khalifah atau pemimpin umat Islam yang ke ....',
    options: [
      { key: 'A', text: 'Satu' },
      { key: 'B', text: 'Dua' },
      { key: 'C', text: 'Tiga' },
      { key: 'D', text: 'Empat' }
    ],
    correctKey: 'A',
    explanation: 'Beliau adalah Khalifah pertama yang memimpin umat Islam setelah Rasulullah SAW wafat.'
  },
  {
    id: 20,
    type: 'pilihan-ganda',
    questionText: 'Salah satu sifat utama Abu Bakar yang patut diteladani adalah ....',
    options: [
      { key: 'A', text: 'Pemarah dan kasar' },
      { key: 'B', text: 'Pelit dan kikir' },
      { key: 'C', text: 'Setia dan rendah hati' },
      { key: 'D', text: 'Sombong dan angkuh' }
    ],
    correctKey: 'C',
    explanation: 'Abu Bakar dikenal sebagai sahabat yang paling setia, sabar, dan memiliki sifat tawadhu yang tinggi.'
  },
  // ==============================================
  // BAGIAN 2: BENAR / SALAH (21 - 25)
  // ==============================================
  {
    id: 21,
    type: 'benar-salah',
    questionText: 'Bersikap tawadhu berarti merendahkan diri sehingga merasa diri tidak berharga dan rendah di hadapan siapa saja.',
    options: [
      { key: 'A', text: 'BENAR' },
      { key: 'B', text: 'SALAH' }
    ],
    correctKey: 'B',
    explanation: 'SALAH. Tawadhu itu merendahkan diri di hadapan Allah dan tidak sombong pada manusia, bukan merasa diri tidak berharga atau rendah diri yang berlebihan.'
  },
  {
    id: 22,
    type: 'benar-salah',
    questionText: 'Sikap Tasamuh mengajarkan kita untuk tetap menghormati orang lain meskipun berbeda pendapat atau keyakinan.',
    options: [
      { key: 'A', text: 'BENAR' },
      { key: 'B', text: 'SALAH' }
    ],
    correctKey: 'A',
    explanation: 'BENAR. Inti dari tasamuh adalah toleransi, yaitu saling menghargai tanpa harus mengorbankan keyakinan sendiri.'
  },
  {
    id: 23,
    type: 'benar-salah',
    questionText: 'Kita diperbolehkan saling menolong dalam perbuatan dosa asalkan tujuannya baik.',
    options: [
      { key: 'A', text: 'BENAR' },
      { key: 'B', text: 'SALAH' }
    ],
    correctKey: 'B',
    explanation: 'SALAH. Islam melarang keras tolong-menolong dalam dosa dan permusuhan, pertolongan hanya boleh dalam kebaikan dan ketakwaan.'
  },
  {
    id: 24,
    type: 'benar-salah',
    questionText: 'Berkomentar dengan kata-kata kasar dan menghina di kolom komentar media sosial termasuk pelanggaran adab.',
    options: [
      { key: 'A', text: 'BENAR' },
      { key: 'B', text: 'SALAH' }
    ],
    correctKey: 'A',
    explanation: 'BENAR. Kita wajib menjaga lisan dan tulisan di mana saja, termasuk di dunia maya, karena itu bisa menyakiti hati orang lain.'
  },
  {
    id: 25,
    type: 'benar-salah',
    questionText: 'Abu Bakar As-Siddiq berasal dari kabilah Quraisy dan merupakan sahabat yang paling dekat dengan Rasulullah.',
    options: [
      { key: 'A', text: 'BENAR' },
      { key: 'B', text: 'SALAH' }
    ],
    correctKey: 'A',
    explanation: 'BENAR. Beliau berasal dari Bani Taim yang masih satu kabilah dengan Rasulullah dan menjadi sahabat kepercayaan hingga akhir hayat.'
  },
  // ==============================================
  // BAGIAN 3: PILIH LEBIH DARI SATU JAWABAN (26 - 30)
  // ==============================================
  {
    id: 26,
    type: 'pilihan-ganyak',
    questionText: 'Pilihlah ciri-ciri orang yang bersikap Tawadhu!',
    options: [
      { key: 'A', text: 'Berbicara dengan sopan dan lemah lembut' },
      { key: 'B', text: 'Suka memuji diri sendiri di depan umum' },
      { key: 'C', text: 'Mau menerima nasihat dan pendapat orang lain yang benar' },
      { key: 'D', text: 'Tidak memandang rendah orang lain' },
      { key: 'E', text: 'Selalu merasa paling hebat' }
    ],
    correctKey: ['A', 'C', 'D'],
    explanation: 'Yang benar adalah A, C, D. Suka memuji diri sendiri dan merasa paling hebat adalah ciri orang sombong, bukan tawadhu.'
  },
  {
    id: 27,
    type: 'pilihan-ganyak',
    questionText: 'Berikut ini adalah manfaat bersikap Tasamuh dalam kehidupan bermasyarakat!',
    options: [
      { key: 'A', text: 'Menghindari perselisihan dan pertengkaran' },
      { key: 'B', text: 'Mempererat tali persaudaraan' },
      { key: 'C', text: 'Membuat kita mengikuti agama orang lain' },
      { key: 'D', text: 'Menciptakan suasana yang aman dan damai' },
      { key: 'E', text: 'Membuat kita menjadi orang yang lemah' }
    ],
    correctKey: ['A', 'B', 'D'],
    explanation: 'Yang benar adalah A, B, D. Tasamuh tidak membuat kita lemah atau mengubah agama, justru membuat hidup rukun dan damai.'
  },
  {
    id: 28,
    type: 'pilihan-ganyak',
    questionText: 'Manakah yang termasuk contoh sikap Ta’awun yang benar?',
    options: [
      { key: 'A', text: 'Gotong royong membersihkan lingkungan masjid' },
      { key: 'B', text: 'Membantu teman yang sedang kesusahan' },
      { key: 'C', text: 'Bekerja sama dalam kegiatan bakti sosial' },
      { key: 'D', text: 'Bersama-sama mengerjai teman di sekolah' },
      { key: 'E', text: 'Bersama-sama membolos sekolah' }
    ],
    correctKey: ['A', 'B', 'C'],
    explanation: 'Yang benar adalah A, B, C. Mengerjai teman atau membolos adalah perbuatan salah, maka bekerja sama dalam hal itu dilarang.'
  },
  {
    id: 29,
    type: 'pilihan-ganyak',
    questionText: 'Adab-adab yang harus diperhatikan saat menggunakan media sosial antara lain adalah ...',
    options: [
      { key: 'A', text: 'Menyampaikan berita yang benar dan terpercaya' },
      { key: 'B', text: 'Menyebarkan berita yang menggembirakan meskipun bohong' },
      { key: 'C', text: 'Menghormati orang lain dalam berkomentar' },
      { key: 'D', text: 'Tidak menyebutkan aib atau keburukan orang lain' },
      { key: 'E', text: 'Menggunakan kata-kata kasar agar disegani' }
    ],
    correctKey: ['A', 'C', 'D'],
    explanation: 'Yang benar adalah A, C, D. Menyebar berita bohong dan berkata kasar adalah perbuatan dosa yang dilarang agama.'
  },
  {
    id: 30,
    type: 'pilihan-ganyak',
    questionText: 'Sifat-sifat terpuji yang dimiliki oleh Abu Bakar As-Siddiq adalah ...',
    options: [
      { key: 'A', text: 'Jujur dan dapat dipercaya' },
      { key: 'B', text: 'Dermawan dan suka memberi' },
      { key: 'C', text: 'Pemberani dan tegas' },
      { key: 'D', text: 'Licik dan penakut' },
      { key: 'E', text: 'Pelit dan suka menumpuk harta' }
    ],
    correctKey: ['A', 'B', 'C'],
    explanation: 'Yang benar adalah A, B, C. Abu Bakar dikenal sangat jujur, banyak menyumbangkan hartanya untuk Islam, dan sangat berani serta tegas saat memimpin umat.'
  }
];

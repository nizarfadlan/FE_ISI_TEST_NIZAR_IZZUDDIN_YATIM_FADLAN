import moment from "moment-timezone";
moment.defineLocale("id", {
  months:
    "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split(
      "_",
    ),
  monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Agt_Sep_Okt_Nov_Des".split("_"),
  weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
  weekdaysShort: "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
  weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
  longDateFormat: {
    LT: "HH.mm",
    LTS: "HH.mm.ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY [pukul] HH.mm",
    LLLL: "dddd, D MMMM YYYY [pukul] HH.mm",
    // Tambahan format
    l: "D/M/YYYY",
    ll: "D MMM YYYY",
    lll: "D MMM YYYY HH.mm",
    llll: "ddd, D MMM YYYY HH.mm",
  },
  meridiemParse: /pagi|siang|sore|malam/,
  meridiemHour: function (hour: number, meridiem: string) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === "pagi") {
      return hour;
    } else if (meridiem === "siang") {
      return hour >= 11 ? hour : hour + 12;
    } else if (meridiem === "sore" || meridiem === "malam") {
      return hour + 12;
    }
  },
  meridiem: function (hours) {
    if (hours < 11) {
      return "pagi";
    } else if (hours < 15) {
      return "siang";
    } else if (hours < 19) {
      return "sore";
    } else {
      return "malam";
    }
  },
  calendar: {
    sameDay: "[Hari ini pukul] LT",
    nextDay: "[Besok pukul] LT",
    nextWeek: "dddd [pukul] LT",
    lastDay: "[Kemarin pukul] LT",
    lastWeek: "dddd [lalu pukul] LT",
    sameElse: "L",
    // Tambahan format kalender
    sameElseTime: "L [pukul] LT",
    nextMonth: "D MMMM YYYY",
    lastMonth: "D MMMM YYYY",
    sameMonth: "D MMMM YYYY",
  },
  relativeTime: {
    future: "dalam %s",
    past: "%s yang lalu",
    s: "beberapa detik",
    ss: "%d detik",
    m: "semenit",
    mm: "%d menit",
    h: "sejam",
    hh: "%d jam",
    d: "sehari",
    dd: "%d hari",
    M: "sebulan",
    MM: "%d bulan",
    y: "setahun",
    yy: "%d tahun",
  },
  week: {
    dow: 1, // Senin adalah hari pertama dalam seminggu
    doy: 7, // Minggu yang berisi 1 Januari adalah minggu pertama tahun itu
  },
  // Tambahan untuk ordinal numbers (angka urutan)
  ordinal: function (number) {
    return "ke-" + number;
  },
  // Format untuk durasi
  invalidDate: "Tanggal tidak valid",
  defaultFormat: "D MMM YYYY",
  defaultTimeFormat: "HH:mm",
  // Tambahan untuk parsing
  monthsRegex:
    /^(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i,
  monthsShortRegex: /^(jan|feb|mar|apr|mei|jun|jul|agt|sep|okt|nov|des)/i,
  monthsStrictRegex:
    /^(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)$/i,
  monthsShortStrictRegex:
    /^(jan|feb|mar|apr|mei|jun|jul|agt|sep|okt|nov|des)$/i,
  monthsParse: [
    /^jan/i,
    /^feb/i,
    /^mar/i,
    /^apr/i,
    /^mei/i,
    /^jun/i,
    /^jul/i,
    /^agt/i,
    /^sep/i,
    /^okt/i,
    /^nov/i,
    /^des/i,
  ],
  // Tambahan untuk parsing hari
  weekdaysRegex: /^(minggu|senin|selasa|rabu|kamis|jumat|sabtu)/i,
  weekdaysShortRegex: /^(min|sen|sel|rab|kam|jum|sab)/i,
  weekdaysMinRegex: /^(mg|sn|sl|rb|km|jm|sb)/i,
  weekdaysStrictRegex: /^(minggu|senin|selasa|rabu|kamis|jumat|sabtu)$/i,
  weekdaysShortStrictRegex: /^(min|sen|sel|rab|kam|jum|sab)$/i,
  weekdaysMinStrictRegex: /^(mg|sn|sl|rb|km|jm|sb)$/i,
  // Format khusus Indonesia
  formats: {
    LDateTime: "dddd, D MMMM YYYY [pukul] HH.mm",
    LDate: "dddd, D MMMM YYYY",
    LTime: "[pukul] HH.mm",
  },
});

moment.locale("id");

function ensureIndonesianLocale() {
  if (moment.locale() !== "id") {
    moment.locale("id");
  }
}

export function momentDate(date: Date | string) {
  ensureIndonesianLocale();
  return moment(date).tz("Asia/Jakarta").format("dddd, DD MMMM YYYY");
}

export function relativeTime(date: Date | string) {
  ensureIndonesianLocale();
  return moment(date).tz("Asia/Jakarta").fromNow();
}

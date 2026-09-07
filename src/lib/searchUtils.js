/**
 * Bilingual Smart Search & Phonetic Banglish to Bengali transliteration engine.
 * Allows searching Bengali exams and MCQ titles using English / Banglish keywords.
 */

const EN_TO_BN_DIGITS = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

const BN_TO_EN_DIGITS = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

export function convertDigitsToBengali(str) {
  if (!str) return '';
  return String(str).replace(/[0-9]/g, d => EN_TO_BN_DIGITS[d] || d);
}

export function convertDigitsToEnglish(str) {
  if (!str) return '';
  return String(str).replace(/[০-৯]/g, d => BN_TO_EN_DIGITS[d] || d);
}

// Comprehensive dictionary for common Bangladeshi job & exam search terms
export const BANGLISH_DICTIONARY = {
  // Exams & Boards
  'bcs': ['বিসিএস', 'bcs'],
  'preli': ['প্রিলিমিনারি', 'preliminary', 'preli'],
  'preliminary': ['প্রিলিমিনারি', 'preliminary'],
  'written': ['লিখিত', 'written'],
  'viva': ['মৌখিক', 'ভাইভা', 'viva'],
  'ntrca': ['এনটিআরসিএ', 'শিক্ষক নিবন্ধন', 'ntrca'],
  'nibondhon': ['নিবন্ধন', 'এনটিআরসিএ', 'nibondhon'],
  'primary': ['প্রাথমিক', 'প্রাইমারি', 'primary'],
  'prathomik': ['প্রাথমিক', 'prathomik'],
  'shikkhok': ['শিক্ষক', 'shikkhok'],
  'sikkhok': ['শিক্ষক', 'sikkhok'],
  'teacher': ['শিক্ষক', 'teacher'],
  'assistant': ['সহকারী', 'assistant'],
  'sohkari': ['সহকারী', 'sohkari'],
  'sohokari': ['সহকারী'],
  'head': ['প্রধান', 'head'],
  'prodhan': ['প্রধান'],
  
  // Banking Sector
  'bank': ['ব্যাংক', 'bank'],
  'bb': ['বাংলাদেশ ব্যাংক', 'bangladesh bank'],
  'bangladesh': ['বাংলাদেশ', 'bangladesh'],
  'sonali': ['সোনালী', 'সোনালি', 'sonali'],
  'janata': ['জনতা', 'janata'],
  'agrani': ['অগ্রণী', 'অগ্রনী', 'agrani'],
  'rupali': ['রূপালী', 'রুপালী', 'rupali'],
  'krishi': ['কৃষি', 'krishi'],
  'pubali': ['পূবালী', 'পুবালী', 'pubali'],
  'islami': ['ইসলামী', 'ইসলামিক', 'islami'],
  'uttara': ['উত্তরা', 'uttara'],
  'karmasangsthan': ['কর্মসংস্থান', 'karmasangsthan'],
  'kormosangsthan': ['কর্মসংস্থান'],
  'kormo': ['কর্মসংস্থান', 'কর্মচারী', 'kormo'],
  'probationary': ['প্রবেশনারি', 'probationary'],
  'officer': ['অফিসার', 'কর্মকর্তা', 'officer'],
  'kormokorta': ['কর্মকর্তা'],
  'kormochari': ['কর্মচারী', 'কর্মচারী'],
  'cash': ['ক্যাশ', 'ক্যাশিয়ার', 'cash'],
  'senior': ['সিনিয়র', 'সিনিয়র', 'senior', 'sr'],
  'junior': ['জুনিয়র', 'জুনিয়র', 'junior', 'jr'],
  'director': ['পরিচালক', 'director'],
  'porichalok': ['পরিচালক'],
  'general': ['জেনারেল', 'সাধারণ', 'general'],
  'sadharon': ['সাধারণ', 'sadharon'],
  
  // Ministries & Govt Departments
  'ministry': ['মন্ত্রণালয়', 'মন্ত্রণালয়', 'ministry'],
  'montronaloy': ['মন্ত্রণালয়', 'মন্ত্রণালয়', 'montronaloy'],
  'odhidoptor': ['অধিদপ্তর', 'odhidoptor'],
  'doptor': ['দপ্তর', 'অধিদপ্তর', 'doptor'],
  'poridoptor': ['পরিদপ্তর', 'poridoptor'],
  'railway': ['রেলওয়ে', 'রেলওয়ে', 'railway'],
  'relway': ['রেলওয়ে', 'রেলওয়ে'],
  'police': ['পুলিশ', 'police'],
  'ansar': ['আনসার', 'ansar'],
  'biman': ['বিমান', 'biman'],
  'poribesh': ['পরিবেশ', 'poribesh'],
  'shastho': ['স্বাস্থ্য', 'shastho'],
  'sastho': ['স্বাস্থ্য', 'sastho'],
  'health': ['স্বাস্থ্য', 'health'],
  'somaj': ['সমাজ', 'somaj'],
  'somajsheba': ['সমাজসেবা', 'somajsheba'],
  'social': ['সমাজ', 'social'],
  'kollan': ['কল্যাণ', 'kollan'],
  'board': ['বোর্ড', 'board'],
  'jubo': ['যুব', 'jubo'],
  'youth': ['যুব', 'youth'],
  'madhomik': ['মাধ্যমিক', 'madhomik'],
  'maddhomik': ['মাধ্যমিক'],
  'uchomadhomik': ['উচ্চ মাধ্যমিক'],
  'higher': ['উচ্চ', 'higher'],
  'karigori': ['কারিগরি', 'karigori'],
  'technical': ['কারিগরি', 'technical'],
  'prokoushol': ['প্রকৌশল', 'প্রকৌশলী', 'prokoushol'],
  'prokousholi': ['প্রকৌশলী'],
  'engineer': ['প্রকৌশলী', 'engineer'],
  'subassistant': ['উপ-সহকারী', 'উপ সহকারী', 'sub-assistant'],
  'khaddo': ['খাদ্য', 'khaddo'],
  'food': ['খাদ্য', 'food'],
  'dak': ['ডাক', 'পোস্টাল', 'dak'],
  'postal': ['পোস্টাল', 'ডাক', 'postal'],
  'postmaster': ['পোস্টমাস্টার', 'postmaster'],
  'biddut': ['বিদ্যুৎ', 'biddut'],
  'power': ['বিদ্যুৎ', 'power'],
  'water': ['পানি', 'water'],
  'panni': ['পানি', 'panni'],
  'gas': ['গ্যাস', 'gas'],
  'tax': ['কর', 'কাস্টমস', 'রাজস্ব', 'tax'],
  'customs': ['কাস্টমস', 'customs'],
  'rohastho': ['রাজস্ব', 'rohastho'],
  'revenue': ['রাজস্ব', 'revenue'],
  'nirbachon': ['নির্বাচন', 'nirbachon'],
  'election': ['নির্বাচন', 'election'],
  'bhumi': ['ভূমি', 'bhumi'],
  'land': ['ভূমি', 'land'],
  'jorip': ['জরিপ', 'jorip'],
  'survey': ['জরিপ', 'survey'],
  'porisongkhan': ['পরিসংখ্যান', 'porisongkhan'],
  'statistics': ['পরিসংখ্যান', 'statistics'],
  'poridorshok': ['পরিদর্শক', 'poridorshok'],
  'inspector': ['পরিদর্শক', 'inspector'],
  'somobay': ['সমবায়', 'সমবায়', 'somobay'],
  'mothsho': ['মৎস্য', 'মৎস', 'mothsho'],
  'fisheries': ['মৎস্য', 'fisheries'],
  'pranisompod': ['প্রাণিসম্পদ', 'pranisompod'],
  'livestock': ['প্রাণিসম্পদ', 'livestock'],
  'poromanu': ['পরমাণু', 'পরমানু', 'poromanu'],
  'nuclear': ['পরমাণু', 'nuclear'],
  'shrom': ['শ্রম', 'shrom'],
  'labor': ['শ্রম', 'labor'],
  'judiciary': ['জুডিশিয়াল', 'জুডিসিয়াল', 'judiciary'],
  'court': ['আদালত', 'কোর্ট', 'court'],
  'audit': ['নিরীক্ষা', 'অডিট', 'audit'],
  'hishab': ['হিসাব', 'হিসাবরক্ষক', 'hishab'],
  'accountant': ['হিসাবরক্ষক', 'accountant'],
  'computer': ['কম্পিউটার', 'computer'],
  'operator': ['অপারেটর', 'operator'],
  'guard': ['গার্ড', 'নিরাপত্তা', 'guard'],

  // Universities & Admission
  'admission': ['ভর্তি', 'admission'],
  'bhorti': ['ভর্তি', 'bhorti'],
  'guccho': ['গুচ্ছ', 'guccho'],
  'gst': ['গুচ্ছ', 'gst'],
  'university': ['বিশ্ববিদ্যালয়', 'বিশ্ববিদ্যালয়', 'university'],
  'varsity': ['বিশ্ববিদ্যালয়', 'varsity'],
  'college': ['কলেজ', 'college'],
  'dhaka': ['ঢাকা', 'dhaka'],
  'du': ['ঢাকা বিশ্ববিদ্যালয়', 'du'],
  'chittagong': ['চট্টগ্রাম', 'chittagong'],
  'ctg': ['চট্টগ্রাম', 'ctg'],
  'rajshahi': ['রাজশাহী', 'rajshahi'],
  'ru': ['রাজশাহী বিশ্ববিদ্যালয়', 'ru'],
  'khulna': ['খুলনা', 'khulna'],
  'ku': ['খুলনা বিশ্ববিদ্যালয়', 'ku'],
  'jahangirnagar': ['জাহাঙ্গীরনগর', 'jahangirnagar'],
  'ju': ['জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', 'ju'],
  'sylhet': ['সিলেট', 'sylhet'],
  'sust': ['শাহজালাল বিজ্ঞান ও প্রযুক্তি', 'sust'],
  'barishal': ['বরিশাল', 'barishal'],
  'bu': ['বরিশাল বিশ্ববিদ্যালয়', 'bu'],
  'comilla': ['কুমিল্লা', 'comilla'],
  'cou': ['কুমিল্লা বিশ্ববিদ্যালয়', 'cou'],
  'rangpur': ['রংপুর', 'rangpur'],
  'mymensingh': ['ময়মনসিংহ', 'mymensingh'],
  'jnu': ['জগন্নাথ বিশ্ববিদ্যালয়', 'jnu'],
  'jagannath': ['জগন্নাথ', 'jagannath'],
  'nu': ['জাতীয় বিশ্ববিদ্যালয়', 'জাতীয় বিশ্ববিদ্যালয়', 'nu'],
  'national': ['জাতীয়', 'জাতীয়', 'national'],
  'unit': ['ইউনিট', 'unit'],
  'science': ['বিজ্ঞান', 'science'],
  'biggiyan': ['বিজ্ঞান', 'biggiyan'],
  'commerce': ['ব্যবসায়', 'ব্যবসা', 'বাণিজ্য', 'commerce'],
  'business': ['ব্যবসা', 'ব্যবসায়', 'business'],
  'arts': ['মানবিক', 'কলা', 'arts'],
  'humanities': ['মানবিক', 'humanities'],

  // General & Subjects
  'somonnito': ['সমন্বিত', 'somonnito'],
  'combined': ['সমন্বিত', 'combined'],
  'special': ['স্পেশাল', 'বিশেষ', 'special'],
  'bishesh': ['বিশেষ', 'bishesh'],
  'bangla': ['বাংলা', 'bangla'],
  'english': ['ইংরেজি', 'english'],
  'math': ['গণিত', 'গণিত', 'math'],
  'gonit': ['গণিত', 'gonit'],
  'gk': ['সাধারণ জ্ঞান', 'gk'],
  'ict': ['তথ্য ও যোগাযোগ প্রযুক্তি', 'আইসিটি', 'ict'],
  'porikkha': ['পরীক্ষা', 'porikkha'],
  'exam': ['পরীক্ষা', 'exam'],
  'model': ['মডেল', 'model'],
  'test': ['টেস্ট', 'test'],
  'solution': ['সমাধান', 'solution'],
  'question': ['প্রশ্ন', 'question'],
  'prosno': ['প্রশ্ন', 'prosno'],
};

/**
 * Phonetic transliteration helper for English characters to Bangla characters
 */
export function simpleBanglishToBengali(word) {
  if (!word || typeof word !== 'string') return '';
  let str = word.toLowerCase().trim();

  // Common clusters
  str = str.replace(/sh/g, 'শ');
  str = str.replace(/ch/g, 'চ');
  str = str.replace(/kh/g, 'খ');
  str = str.replace(/gh/g, 'ঘ');
  str = str.replace(/th/g, 'থ');
  str = str.replace(/dh/g, 'ধ');
  str = str.replace(/bh/g, 'ভ');
  str = str.replace(/ph/g, 'ফ');
  str = str.replace(/ng/g, 'ঙ');

  // Single consonants
  str = str.replace(/k/g, 'ক');
  str = str.replace(/g/g, 'গ');
  str = str.replace(/j/g, 'জ');
  str = str.replace(/t/g, 'ত');
  str = str.replace(/d/g, 'দ');
  str = str.replace(/n/g, 'ন');
  str = str.replace(/p/g, 'প');
  str = str.replace(/f/g, 'ফ');
  str = str.replace(/b/g, 'ব');
  str = str.replace(/m/g, 'ম');
  str = str.replace(/r/g, 'র');
  str = str.replace(/l/g, 'ল');
  str = str.replace(/s/g, 'স');
  str = str.replace(/h/g, 'হ');

  // Vowels
  str = str.replace(/aa/g, 'া');
  str = str.replace(/ee/g, 'ী');
  str = str.replace(/oo/g, 'ূ');
  str = str.replace(/ou/g, 'ৌ');
  str = str.replace(/oi/g, 'ৈ');

  return str;
}

/**
 * Expand a single search token to all its search variants (English, Bengali, Digits, Dictionary)
 */
export function getTokenVariants(token) {
  if (!token) return [];
  const clean = token.toLowerCase().trim();
  const set = new Set();
  set.add(clean);

  // Digits conversion
  const bnDigits = convertDigitsToBengali(clean);
  const enDigits = convertDigitsToEnglish(clean);
  if (bnDigits) set.add(bnDigits);
  if (enDigits) set.add(enDigits);

  // Dictionary lookup (direct & prefix)
  if (BANGLISH_DICTIONARY[clean]) {
    BANGLISH_DICTIONARY[clean].forEach(term => set.add(term.toLowerCase()));
  } else {
    // Check partial key matches
    for (const [key, terms] of Object.entries(BANGLISH_DICTIONARY)) {
      if (clean.startsWith(key) || key.startsWith(clean)) {
        terms.forEach(term => set.add(term.toLowerCase()));
      }
    }
  }

  // Add simple phonetic candidate if English letters
  if (/^[a-z]+$/.test(clean) && clean.length >= 3) {
    const phonetic = simpleBanglishToBengali(clean);
    if (phonetic && phonetic !== clean) {
      set.add(phonetic);
    }
  }

  return Array.from(set);
}

/**
 * Check if an exam matches the user query (Supports English, Banglish, Bengali, Digits)
 */
export function matchesExamSearch(exam, rawQuery) {
  if (!rawQuery || !rawQuery.trim()) return true;
  if (!exam) return false;

  const tokens = rawQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  // Build complete searchable corpus for this exam
  const searchableText = [
    exam.title || '',
    exam.slug || '',
    exam.category_name || '',
    exam.clean_filename || '',
    exam.year ? String(exam.year) : '',
    exam.year ? convertDigitsToBengali(exam.year) : ''
  ].join(' ').toLowerCase();

  // ALL query tokens must match (AND condition)
  for (const token of tokens) {
    const variants = getTokenVariants(token);
    const hasMatch = variants.some(variant => searchableText.includes(variant));
    if (!hasMatch) {
      return false;
    }
  }

  return true;
}

/**
 * Returns translated Bengali suggestions for active English query to show in UI
 */
export function getQueryBengaliSuggestions(query) {
  if (!query || !query.trim()) return [];
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const suggestions = [];

  for (const token of tokens) {
    // Check dictionary
    if (BANGLISH_DICTIONARY[token]) {
      const bnWord = BANGLISH_DICTIONARY[token].find(w => /[ঀ-৿]/.test(w));
      if (bnWord && !suggestions.includes(bnWord)) {
        suggestions.push(bnWord);
      }
    } else {
      // Check partial matches
      for (const [key, terms] of Object.entries(BANGLISH_DICTIONARY)) {
        if (key === token || (token.length >= 3 && key.startsWith(token))) {
          const bnWord = terms.find(w => /[ঀ-৿]/.test(w));
          if (bnWord && !suggestions.includes(bnWord)) {
            suggestions.push(bnWord);
            break;
          }
        }
      }
    }

    // Number suggestions
    if (/^\d+$/.test(token)) {
      const bnNum = convertDigitsToBengali(token);
      if (bnNum && !suggestions.includes(bnNum)) {
        suggestions.push(bnNum);
      }
    }
  }

  return suggestions.slice(0, 5);
}

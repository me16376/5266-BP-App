with open('src/app/page.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
old_imp = '  Award,\n  Monitor\n} from \'lucide-react\';'
new_imp = '  Award,\n  Monitor,\n  Cpu\n} from \'lucide-react\';'
if old_imp in content:
    content = content.replace(old_imp, new_imp, 1)

# 2. Update Hero badges
old_hero_badges = '''            <Link href="/most-important-questions" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', textDecoration: 'none' }}>
              <Flame size={14} />
              <span>৪,৯০৪টি সর্বাধিক কমন প্রশ্ন</span>
            </Link>
          </div>'''

new_hero_badges = '''            <Link href="/most-important-questions" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', textDecoration: 'none' }}>
              <Flame size={14} />
              <span>৪,৯০৪টি সর্বাধিক কমন</span>
            </Link>
            <Link href="/ampibian-suggestion" className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.86rem', textDecoration: 'none' }}>
              <BookOpen size={14} />
              <span>৬,১৫৭টি অ্যাম্ফিবিয়ান সাজেশন</span>
            </Link>
            <Link href="/biddabari-ntrca" className="badge badge-cyan" style={{ padding: '6px 14px', fontSize: '0.86rem', textDecoration: 'none' }}>
              <GraduationCap size={14} />
              <span>৯,৯৭৪টি বিদ্যাবাড়ি NTRCA</span>
            </Link>
            <Link href="/smart-ai" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', textDecoration: 'none' }}>
              <Cpu size={14} />
              <span>১৭,১০০টি স্মার্ট AI প্রশ্ন</span>
            </Link>
          </div>'''

if old_hero_badges in content:
    content = content.replace(old_hero_badges, new_hero_badges, 1)

# 3. Add Special Modules Cards
target_card_end = '            {/* Most Important Questions Card */}\n            <div className="glass-panel" style={{'
additional_cards = """            {/* Ampibian Suggestion Card */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(16, 185, 129, 0.08)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={26} color="#059669" />
                  </div>
                  <span className="badge badge-emerald" style={{ padding: '6px 12px' }}>
                    ৮৪টি অধ্যায় • ৬,১৫৭টি প্রশ্ন
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#065f46', marginBottom: '8px' }}>
                  অ্যাম্ফিবিয়ান সাজেশন (Ampibian Suggestion)
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                  বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৮৪টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল সমাধান সংকলন।
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <Link
                    href="/ampibian-suggestion"
                    className="btn-primary"
                    style={{ background: '#059669', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    বক্স লেআউট (৮৪ অধ্যায়)
                  </Link>
                  <Link
                    href="/ampibian-suggestion-smart"
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.88rem', borderColor: '#a7f3d0', color: '#047857' }}
                  >
                    স্মার্ট লেআউট ভিউ
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/ampibian-suggestion-practice"
                    style={{ fontSize: '0.84rem', color: '#059669', fontWeight: 600, textDecoration: 'none' }}
                  >
                    অনুশীলন শুরু করুন →
                  </Link>
                </div>
              </div>
            </div>

            {/* Biddabari NTRCA Card */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(37, 99, 235, 0.08)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <GraduationCap size={26} color="#1d4ed8" />
                  </div>
                  <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 12px' }}>
                    ৬৭টি লেকচার • ৯,৯৭৪টি প্রশ্ন
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e40af', marginBottom: '8px' }}>
                  বিদ্যাবাড়ি শিক্ষক নিবন্ধন (Biddabari NTRCA)
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                  শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির বাংলা, ইংরেজি, গণিত ও জিকে লেকচার শিট ভিত্তিক পূর্ণাঙ্গ প্রশ্নব্যাংক।
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <Link
                    href="/biddabari-ntrca"
                    className="btn-primary"
                    style={{ background: '#2563eb', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    বক্স লেআউট (৬৭ লেকচার)
                  </Link>
                  <Link
                    href="/biddabari-ntrca-smart"
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.88rem', borderColor: '#bfdbfe', color: '#1d4ed8' }}
                  >
                    স্মার্ট লেআউট ভিউ
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/biddabari-ntrca-practice"
                    style={{ fontSize: '0.84rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                  >
                    অনুশীলন শুরু করুন →
                  </Link>
                </div>
              </div>
            </div>

            {/* Smart AI Card */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid rgba(124, 58, 237, 0.25)',
              background: 'linear-gradient(135deg, rgba(245, 243, 255, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(124, 58, 237, 0.08)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#ede9fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Cpu size={26} color="#7c3aed" />
                  </div>
                  <span className="badge" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', padding: '6px 12px' }}>
                    ৮৯টি বিষয় • ১৭,১০০টি প্রশ্ন
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#5b21b6', marginBottom: '8px' }}>
                  স্মার্ট AI (Smart AI) প্রশ্নব্যাংক
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                  BPSC টেকনিক্যাল ও নন-ক্যাডার এবং NTRCA প্রিলিমিনারি ও আইসিটি বিষয়ের এআই কিউরেটেড সমৃদ্ধ প্রশ্নব্যাংক।
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <Link
                    href="/smart-ai"
                    className="btn-primary"
                    style={{ background: '#7c3aed', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    বক্স লেআউট (৮৯ বিষয়)
                  </Link>
                  <Link
                    href="/smart-ai-smart"
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.88rem', borderColor: '#ddd6fe', color: '#7c3aed' }}
                  >
                    স্মার্ট লেআউট ভিউ
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/smart-ai-practice"
                    style={{ fontSize: '0.84rem', color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}
                  >
                    অনুশীলন শুরু করুন →
                  </Link>
                </div>
              </div>
            </div>
"""

# Insert additional cards before Most Important card
if target_card_end in content:
    content = content.replace(target_card_end, additional_cards + '\n' + target_card_end, 1)

with open('src/app/page.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated src/app/page.jsx!')

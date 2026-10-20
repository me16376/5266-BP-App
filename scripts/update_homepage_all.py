import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/app/page.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Hero Badges
old_hero_badges = """            <Link href="/smart-ai" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', textDecoration: 'none' }}>
              <Cpu size={14} />
              <span>১৭,১০০টি স্মার্ট AI প্রশ্ন</span>
            </Link>
          </div>"""

new_hero_badges = """            <Link href="/smart-ai" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', textDecoration: 'none' }}>
              <Cpu size={14} />
              <span>১৭,১০০টি স্মার্ট AI প্রশ্ন</span>
            </Link>
            <Link href="/buet-pattern-suggestion" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', textDecoration: 'none' }}>
              <Sparkles size={14} />
              <span>৫,৪৬০টি বুয়েট প্যাটার্ন</span>
            </Link>
            <Link href="/bpsc-non-tech-suggestion" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', textDecoration: 'none' }}>
              <Sparkles size={14} />
              <span>৫,৬৬৪টি BPSC সাজেশন</span>
            </Link>
            <Link href="/saif-ntrca-100-model" className="badge" style={{ padding: '6px 14px', fontSize: '0.86rem', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', textDecoration: 'none' }}>
              <GraduationCap size={14} />
              <span>৭,২২৫টি সাইফ স্যার মডেল</span>
            </Link>
          </div>"""

if old_hero_badges in content:
    content = content.replace(old_hero_badges, new_hero_badges, 1)
    print("Updated hero badges successfully.")
else:
    print("Warning: old_hero_badges not matched directly.")

# 2. Add 5 New Cards to Special Modules Section
target_before = "            {/* Most Important Questions Card */}"

new_5_cards = """            {/* BUET Pattern Suggestion Card */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              background: 'linear-gradient(135deg, rgba(250, 248, 255, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(139, 92, 246, 0.08)'
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
                    <Sparkles size={26} color="#7c3aed" />
                  </div>
                  <span className="badge" style={{ background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', padding: '6px 12px' }}>
                    ৫৭টি অধ্যায় • ৫,৪৬০টি প্রশ্ন
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#5b21b6', marginBottom: '8px' }}>
                  বুয়েট প্যাটার্ন সাজেশন (BUET Pattern)
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                  বুয়েট প্যাটার্ন নিয়োগ পরীক্ষার জন্য বাংলা, ইংরেজি, সাধারণ জ্ঞান ও গণিত বিষয়ের ৫৭টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও নির্ভুল সমাধান।
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <Link
                    href="/buet-pattern-suggestion"
                    className="btn-primary"
                    style={{ background: '#7c3aed', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    বক্স লেআউট (৫৭ অধ্যায়)
                  </Link>
                  <Link
                    href="/buet-pattern-suggestion-smart"
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.88rem', borderColor: '#ddd6fe', color: '#6d28d9' }}
                  >
                    স্মার্ট লেআউট ভিউ
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/buet-pattern-suggestion-practice"
                    style={{ fontSize: '0.84rem', color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}
                  >
                    অনুশীলন শুরু করুন →
                  </Link>
                </div>
              </div>
            </div>

            {/* BPSC Non Tech Questions Card */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              background: 'linear-gradient(135deg, rgba(255, 241, 242, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(244, 63, 94, 0.08)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#ffe4e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={26} color="#e11d48" />
                  </div>
                  <span className="badge" style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', padding: '6px 12px' }}>
                    ৭টি পূর্ণাঙ্গ বিষয় • ৫,৬৬৪টি প্রশ্ন
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#881337', marginBottom: '8px' }}>
                  BPSC নন-টেক প্রশ্নব্যাংক (Non Tech Questions)
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                  বিপিএসসি নন-ক্যাডার ও নন-টেক নিয়োগ পরীক্ষার বাংলা, ইংরেজি, গণিত, বাংলাদেশ, আন্তর্জাতিক, বিজ্ঞান ও আইসিটির পূর্ণাঙ্গ সংকলন।
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <Link
                    href="/bpsc-non-tech-questions"
                    className="btn-primary"
                    style={{ background: '#e11d48', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    বক্স লেআউট (৭ বিষয়)
                  </Link>
                  <Link
                    href="/bpsc-non-tech-questions-smart"
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.88rem', borderColor: '#fecdd3', color: '#be123c' }}
                  >
                    স্মার্ট লেআউট ভিউ
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/bpsc-non-tech-questions-practice"
                    style={{ fontSize: '0.84rem', color: '#e11d48', fontWeight: 600, textDecoration: 'none' }}
                  >
                    অনুশীলন শুরু করুন →
                  </Link>
                </div>
              </div>
            </div>

            {/* BPSC Non Tech Suggestion Card */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              background: 'linear-gradient(135deg, rgba(255, 253, 245, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.08)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles size={26} color="#d97706" />
                  </div>
                  <span className="badge" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '6px 12px' }}>
                    ৯১টি অধ্যায় • ৫,৬৬৪টি প্রশ্ন
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#78350f', marginBottom: '8px' }}>
                  BPSC নন-টেক সাজেশন (Non Tech Suggestion)
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                  বিপিএসসি নন-ক্যাডার ও নন-টেক পরীক্ষার ৮টি বিষয়ের ৯১টি অধ্যায়ভিত্তিক চূড়ান্ত সাজেশন ও বিস্তারিত সমাধান সংকলন।
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <Link
                    href="/bpsc-non-tech-suggestion"
                    className="btn-primary"
                    style={{ background: '#d97706', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    বক্স লেআউট (৯১ অধ্যায়)
                  </Link>
                  <Link
                    href="/bpsc-non-tech-suggestion-smart"
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.88rem', borderColor: '#fde68a', color: '#b45309' }}
                  >
                    স্মার্ট লেআউট ভিউ
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/bpsc-non-tech-suggestion-practice"
                    style={{ fontSize: '0.84rem', color: '#d97706', fontWeight: 600, textDecoration: 'none' }}
                  >
                    অনুশীলন শুরু করুন →
                  </Link>
                </div>
              </div>
            </div>

            {/* Saif Sir NTRCA 100 MCQ Model Card */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              background: 'linear-gradient(135deg, rgba(248, 249, 255, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(99, 102, 241, 0.08)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <GraduationCap size={26} color="#4f46e5" />
                  </div>
                  <span className="badge" style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', padding: '6px 12px' }}>
                    ৭৫টি ১০০ MCQ টেস্ট • ৭,২২৫টি প্রশ্ন
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#312e81', marginBottom: '8px' }}>
                  সাইফ স্যার NTRCA ১০০ MCQ মডেল টেস্ট
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                  সাইফ স্যারের শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির ৭৫টি পূর্ণাঙ্গ ১০০ নম্বরের স্পেশাল বুলেটিন মডেল টেস্ট ও নির্ভুল ব্যাখ্যা।
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <Link
                    href="/saif-ntrca-100-model"
                    className="btn-primary"
                    style={{ background: '#4f46e5', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    বক্স লেআউট (৭৫ টেস্ট)
                  </Link>
                  <Link
                    href="/saif-ntrca-100-model-smart"
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.88rem', borderColor: '#c7d2fe', color: '#4338ca' }}
                  >
                    স্মার্ট লেআউট ভিউ
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/saif-ntrca-100-model-practice"
                    style={{ fontSize: '0.84rem', color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}
                  >
                    অনুশীলন শুরু করুন →
                  </Link>
                </div>
              </div>
            </div>

            {/* Saif Sir NTRCA Suggestion Card */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              background: 'linear-gradient(135deg, rgba(242, 252, 249, 0.6) 0%, rgba(255, 255, 255, 0.95) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(20, 184, 166, 0.08)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: '#ccfbf1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={26} color="#0d9488" />
                  </div>
                  <span className="badge" style={{ background: '#f0fdfa', color: '#0f766e', border: '1px solid #99f6e4', padding: '6px 12px' }}>
                    ৩৩৮টি শর্ট বুলেটিন • ৭,২২৫টি প্রশ্ন
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#134e4a', marginBottom: '8px' }}>
                  সাইফ স্যার NTRCA এক্সক্লুসিভ সাজেশন
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                  শিক্ষক নিবন্ধন (NTRCA) প্রিলিমিনারি প্রস্তুতির ৩৩৮টি বিষয়ভিত্তিক শর্ট মডেল বুলেটিন ও চূড়ান্ত সাজেশন সংকলন।
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <Link
                    href="/saif-ntrca-suggestion"
                    className="btn-primary"
                    style={{ background: '#0d9488', justifyContent: 'center', padding: '10px', fontSize: '0.88rem' }}
                  >
                    বক্স লেআউট (৩৩৮ বুলেটিন)
                  </Link>
                  <Link
                    href="/saif-ntrca-suggestion-smart"
                    className="btn-secondary"
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '0.88rem', borderColor: '#99f6e4', color: '#0f766e' }}
                  >
                    স্মার্ট লেআউট ভিউ
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/saif-ntrca-suggestion-practice"
                    style={{ fontSize: '0.84rem', color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}
                  >
                    অনুশীলন শুরু করুন →
                  </Link>
                </div>
              </div>
            </div>

"""

if target_before in content:
    content = content.replace(target_before, new_5_cards + target_before, 1)
    print("Added 5 new cards to Homepage successfully.")
else:
    print("Warning: target_before not found in Homepage.")

with open('src/app/page.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated src/app/page.jsx completely!")

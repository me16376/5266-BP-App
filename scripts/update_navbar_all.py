import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/components/Navbar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update active states
old_active_block = """  const isAmpibianActive = pathname === '/ampibian-suggestion' || pathname.startsWith('/ampibian-suggestion');
  const isBiddabariActive = pathname === '/biddabari-ntrca' || pathname.startsWith('/biddabari-ntrca');
  const isSmartAiActive = pathname === '/smart-ai' || pathname.startsWith('/smart-ai');
  const isSpecialActive = isIctActive || isAmpibianActive || isBiddabariActive;"""

new_active_block = """  const isAmpibianActive = pathname === '/ampibian-suggestion' || pathname.startsWith('/ampibian-suggestion');
  const isBiddabariActive = pathname === '/biddabari-ntrca' || pathname.startsWith('/biddabari-ntrca');
  const isSmartAiActive = pathname === '/smart-ai' || pathname.startsWith('/smart-ai');
  const isBuetPatternActive = pathname === '/buet-pattern-suggestion' || pathname.startsWith('/buet-pattern-suggestion');
  const isBpscNonTechQuestionsActive = pathname === '/bpsc-non-tech-questions' || pathname.startsWith('/bpsc-non-tech-questions');
  const isBpscNonTechSuggestionActive = pathname === '/bpsc-non-tech-suggestion' || pathname.startsWith('/bpsc-non-tech-suggestion');
  const isSaif100Active = pathname === '/saif-ntrca-100-model' || pathname.startsWith('/saif-ntrca-100-model');
  const isSaifSuggestionActive = pathname === '/saif-ntrca-suggestion' || pathname.startsWith('/saif-ntrca-suggestion');
  const isSpecialActive = isIctActive || isAmpibianActive || isBiddabariActive || isBuetPatternActive || isBpscNonTechQuestionsActive || isBpscNonTechSuggestionActive || isSaif100Active || isSaifSuggestionActive;"""

assert old_active_block in content, "old_active_block not found"
content = content.replace(old_active_block, new_active_block, 1)

# 2. Desktop Mega Menu (8 Cards in 4-Column Grid)
desktop_mega_menu_full = """{/* Special Question Bank Mega Menu */}
            {specialDropdownOpen && (
              <div 
                className="mega-menu-container dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '-160px',
                  width: '960px',
                  maxWidth: '96vw',
                  background: '#ffffff',
                  borderRadius: '18px',
                  boxShadow: '0 24px 50px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(15, 23, 42, 0.06)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  zIndex: 1000
                }}
              >
                {/* Sleek Minimalist Top Strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 20px',
                  background: '#fafbfc',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                    }}>
                      <BookOpen size={13} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
                      স্পেশাল সাজেশন হাব
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 500 }}>
                      • ৮টি মাস্টার আর্কাইভ
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#047857',
                    background: '#ecfdf5',
                    padding: '2px 9px',
                    borderRadius: '12px',
                    border: '1px solid #a7f3d0'
                  }}>
                    মোট ৪৯,১২৭টি MCQ
                  </div>
                </div>

                {/* Body Grid: 8 Distinct Colored Cards in 4-Column Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  padding: '12px 14px'
                }}>
                  {/* Card 1: ICT (Mint / Green Theme) */}
                  <div style={{
                    background: '#f2faf5',
                    border: '1.5px solid #a7f3d0',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Laptop size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.2 }}>আইসিটি (ICT)</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>১৭টি অধ্যায়</div>
                        </div>
                      </div>
                      <span style={{ background: '#d1fae5', color: '#047857', padding: '2px 6px', borderRadius: '12px', fontSize: '0.66rem', fontWeight: 700 }}>
                        ১,৭৫৮
                      </span>
                    </div>

                    <Link
                      href="/ict"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname === '/ict' ? '#ecfdf5' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/ict' ? '1px solid #10b981' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname === '/ict' ? '#047857' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} color="var(--emerald-600)" />
                        <span>Layout box</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/ict-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname?.startsWith('/ict-smart') ? '#ecfdf5' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/ict-smart') ? '1px solid #10b981' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname?.startsWith('/ict-smart') ? '#047857' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color="#0284c7" />
                        <span>Layout smart</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>
                  </div>

                  {/* Card 2: Ampibian (Emerald Theme) */}
                  <div style={{
                    background: '#fcfbf7',
                    border: '1.5px solid #fde68a',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#fef3c7',
                          color: '#d97706',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.2 }}>অ্যাম্ফিবিয়ান</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>৮৪টি অধ্যায়</div>
                        </div>
                      </div>
                      <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '12px', fontSize: '0.66rem', fontWeight: 700 }}>
                        ৬,১৫৭
                      </span>
                    </div>

                    <Link
                      href="/ampibian-suggestion"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname === '/ampibian-suggestion' ? '#fef3c7' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/ampibian-suggestion' ? '1px solid #d97706' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname === '/ampibian-suggestion' ? '#b45309' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} color="#d97706" />
                        <span>Layout box</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/ampibian-suggestion-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname?.startsWith('/ampibian-suggestion-smart') ? '#fef3c7' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/ampibian-suggestion-smart') ? '1px solid #d97706' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname?.startsWith('/ampibian-suggestion-smart') ? '#b45309' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color="#d97706" />
                        <span>Layout smart</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>
                  </div>

                  {/* Card 3: Biddabari NTRCA (Blue Theme) */}
                  <div style={{
                    background: '#f8faff',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#dbeafe',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.2 }}>বিদ্যাবাড়ি NTRCA</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>৬৭টি লেকচার</div>
                        </div>
                      </div>
                      <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '12px', fontSize: '0.66rem', fontWeight: 700 }}>
                        ৯,৯৭৪
                      </span>
                    </div>

                    <Link
                      href="/biddabari-ntrca"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname === '/biddabari-ntrca' ? '#eff6ff' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/biddabari-ntrca' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname === '/biddabari-ntrca' ? '#1d4ed8' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} color="#2563eb" />
                        <span>Layout box</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/biddabari-ntrca-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname?.startsWith('/biddabari-ntrca-smart') ? '#eff6ff' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/biddabari-ntrca-smart') ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname?.startsWith('/biddabari-ntrca-smart') ? '#1d4ed8' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color="#2563eb" />
                        <span>Layout smart</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>
                  </div>

                  {/* Card 4: BUET Pattern (Violet Theme) */}
                  <div style={{
                    background: '#faf8ff',
                    border: '1.5px solid #ddd6fe',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#ede9fe',
                          color: '#7c3aed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.2 }}>বুয়েট প্যাটার্ন</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>৫৭টি অধ্যায়</div>
                        </div>
                      </div>
                      <span style={{ background: '#f5f3ff', color: '#6d28d9', padding: '2px 6px', borderRadius: '12px', fontSize: '0.66rem', fontWeight: 700 }}>
                        ৫,৪৬০
                      </span>
                    </div>

                    <Link
                      href="/buet-pattern-suggestion"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname === '/buet-pattern-suggestion' ? '#f5f3ff' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/buet-pattern-suggestion' ? '1px solid #8b5cf6' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname === '/buet-pattern-suggestion' ? '#6d28d9' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} color="#7c3aed" />
                        <span>Layout box</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/buet-pattern-suggestion-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname?.startsWith('/buet-pattern-suggestion-smart') ? '#f5f3ff' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/buet-pattern-suggestion-smart') ? '1px solid #8b5cf6' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname?.startsWith('/buet-pattern-suggestion-smart') ? '#6d28d9' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color="#7c3aed" />
                        <span>Layout smart</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>
                  </div>

                  {/* Card 5: BPSC Non Tech Questions (Rose Theme) */}
                  <div style={{
                    background: '#fff5f6',
                    border: '1.5px solid #fecdd3',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#ffe4e6',
                          color: '#e11d48',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.2 }}>BPSC প্রশ্নব্যাংক</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>৭টি পূর্ণাঙ্গ বিষয়</div>
                        </div>
                      </div>
                      <span style={{ background: '#fff1f2', color: '#be123c', padding: '2px 6px', borderRadius: '12px', fontSize: '0.66rem', fontWeight: 700 }}>
                        ৫,৬৬৪
                      </span>
                    </div>

                    <Link
                      href="/bpsc-non-tech-questions"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname === '/bpsc-non-tech-questions' ? '#fff1f2' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/bpsc-non-tech-questions' ? '1px solid #f43f5e' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname === '/bpsc-non-tech-questions' ? '#be123c' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} color="#e11d48" />
                        <span>Layout box</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/bpsc-non-tech-questions-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname?.startsWith('/bpsc-non-tech-questions-smart') ? '#fff1f2' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/bpsc-non-tech-questions-smart') ? '1px solid #f43f5e' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname?.startsWith('/bpsc-non-tech-questions-smart') ? '#be123c' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color="#e11d48" />
                        <span>Layout smart</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>
                  </div>

                  {/* Card 6: BPSC Non Tech Suggestion (Amber Theme) */}
                  <div style={{
                    background: '#fffdf5',
                    border: '1.5px solid #fde68a',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#fef3c7',
                          color: '#d97706',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.2 }}>BPSC সাজেশন</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>৯১টি অধ্যায়</div>
                        </div>
                      </div>
                      <span style={{ background: '#fffbeb', color: '#b45309', padding: '2px 6px', borderRadius: '12px', fontSize: '0.66rem', fontWeight: 700 }}>
                        ৫,৬৬৪
                      </span>
                    </div>

                    <Link
                      href="/bpsc-non-tech-suggestion"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname === '/bpsc-non-tech-suggestion' ? '#fffbeb' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/bpsc-non-tech-suggestion' ? '1px solid #d97706' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname === '/bpsc-non-tech-suggestion' ? '#b45309' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} color="#d97706" />
                        <span>Layout box</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/bpsc-non-tech-suggestion-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname?.startsWith('/bpsc-non-tech-suggestion-smart') ? '#fffbeb' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/bpsc-non-tech-suggestion-smart') ? '1px solid #d97706' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname?.startsWith('/bpsc-non-tech-suggestion-smart') ? '#b45309' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color="#d97706" />
                        <span>Layout smart</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>
                  </div>

                  {/* Card 7: Saif Sir NTRCA 100 MCQ (Indigo Theme) */}
                  <div style={{
                    background: '#f8f9ff',
                    border: '1.5px solid #c7d2fe',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#e0e7ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.2 }}>সাইফ স্যার ১০০ MCQ</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>৭৫টি পূর্ণাঙ্গ টেস্ট</div>
                        </div>
                      </div>
                      <span style={{ background: '#eef2ff', color: '#4338ca', padding: '2px 6px', borderRadius: '12px', fontSize: '0.66rem', fontWeight: 700 }}>
                        ৭,২২৫
                      </span>
                    </div>

                    <Link
                      href="/saif-ntrca-100-model"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname === '/saif-ntrca-100-model' ? '#eef2ff' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/saif-ntrca-100-model' ? '1px solid #6366f1' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname === '/saif-ntrca-100-model' ? '#4338ca' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} color="#4f46e5" />
                        <span>Layout box</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/saif-ntrca-100-model-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname?.startsWith('/saif-ntrca-100-model-smart') ? '#eef2ff' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/saif-ntrca-100-model-smart') ? '1px solid #6366f1' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname?.startsWith('/saif-ntrca-100-model-smart') ? '#4338ca' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color="#4f46e5" />
                        <span>Layout smart</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>
                  </div>

                  {/* Card 8: Saif Sir NTRCA Suggestion (Teal Theme) */}
                  <div style={{
                    background: '#f2fcf9',
                    border: '1.5px solid #99f6e4',
                    borderRadius: '14px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#ccfbf1',
                          color: '#0d9488',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <BookOpen size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', lineHeight: 1.2 }}>সাইফ স্যার বুলেটিন</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>৩৩৮টি শর্ট টেস্ট</div>
                        </div>
                      </div>
                      <span style={{ background: '#f0fdfa', color: '#0f766e', padding: '2px 6px', borderRadius: '12px', fontSize: '0.66rem', fontWeight: 700 }}>
                        ৭,২২৫
                      </span>
                    </div>

                    <Link
                      href="/saif-ntrca-suggestion"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname === '/saif-ntrca-suggestion' ? '#f0fdfa' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname === '/saif-ntrca-suggestion' ? '1px solid #14b8a6' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname === '/saif-ntrca-suggestion' ? '#0f766e' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={13} color="#0d9488" />
                        <span>Layout box</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>

                    <Link
                      href="/saif-ntrca-suggestion-smart/"
                      onClick={() => setSpecialDropdownOpen(false)}
                      style={{
                        background: pathname?.startsWith('/saif-ntrca-suggestion-smart') ? '#f0fdfa' : '#ffffff',
                        borderRadius: '8px',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        border: pathname?.startsWith('/saif-ntrca-suggestion-smart') ? '1px solid #14b8a6' : '1px solid #e2e8f0',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: pathname?.startsWith('/saif-ntrca-suggestion-smart') ? '#0f766e' : '#1e293b'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color="#0d9488" />
                        <span>Layout smart</span>
                      </div>
                      <ChevronRight size={12} color="#94a3b8" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          """

# Replace exact desktop block
start_marker_d = '{/* Special Question Bank Mega Menu */}'
end_marker_d = '{/* Most Important Questions Dropdown (Layout box & Layout smart) */}'

idx1_d = content.find(start_marker_d)
idx2_d = content.find(end_marker_d)
assert idx1_d != -1 and idx2_d != -1, "Desktop markers not found"

content = content[:idx1_d] + desktop_mega_menu_full + content[idx2_d:]
print("Desktop mega menu updated cleanly.")


# 3. Mobile Special Menu (All 8 Categories)
mobile_special_menu_full = """{/* 3. Special Question Bank Accordion (Mobile) */}
          <div style={{
            borderRadius: '10px',
            border: isSpecialActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isSpecialActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileSpecialOpen(!mobileSpecialOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                color: isSpecialActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={18} color={isSpecialActive ? '#047857' : '#059669'} />
                <span>স্পেশাল সাজেশন হাব</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileSpecialOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileSpecialOpen && (
              <div style={{
                padding: '8px 10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                {[
                  { title: 'আইসিটি (ICT)', badge: '১,৭৫৮ MCQ', boxUrl: '/ict', smartUrl: '/ict-smart/', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', icon: Laptop },
                  { title: 'অ্যাম্ফিবিয়ান সাজেশন', badge: '৬,১৫৭ MCQ', boxUrl: '/ampibian-suggestion', smartUrl: '/ampibian-suggestion-smart/', color: '#d97706', bg: '#fef3c7', border: '#fde68a', icon: BookOpen },
                  { title: 'বিদ্যাবাড়ি NTRCA', badge: '৯,৯৭৪ MCQ', boxUrl: '/biddabari-ntrca', smartUrl: '/biddabari-ntrca-smart/', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: GraduationCap },
                  { title: 'বুয়েট প্যাটার্ন সাজেশন', badge: '৫,৪৬০ MCQ', boxUrl: '/buet-pattern-suggestion', smartUrl: '/buet-pattern-suggestion-smart/', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', icon: Sparkles },
                  { title: 'BPSC প্রশ্নব্যাংক', badge: '৫,৬৬৪ MCQ', boxUrl: '/bpsc-non-tech-questions', smartUrl: '/bpsc-non-tech-questions-smart/', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', icon: BookOpen },
                  { title: 'BPSC সাজেশন', badge: '৫,৬৬৪ MCQ', boxUrl: '/bpsc-non-tech-suggestion', smartUrl: '/bpsc-non-tech-suggestion-smart/', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: Sparkles },
                  { title: 'সাইফ স্যার ১০০ MCQ মডেল', badge: '৭,২২৫ MCQ', boxUrl: '/saif-ntrca-100-model', smartUrl: '/saif-ntrca-100-model-smart/', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', icon: GraduationCap },
                  { title: 'সাইফ স্যার NTRCA সাজেশন', badge: '৭,২২৫ MCQ', boxUrl: '/saif-ntrca-suggestion', smartUrl: '/saif-ntrca-suggestion-smart/', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4', icon: BookOpen }
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  const isBox = pathname === item.boxUrl;
                  const isSmart = pathname?.startsWith(item.smartUrl);
                  return (
                    <div key={idx} style={{
                      background: '#ffffff',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 5px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <IconComp size={14} color={item.color} />
                          <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#0f172a' }}>{item.title}</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: item.color, background: item.bg, padding: '2px 6px', borderRadius: '10px', border: `1px solid ${item.border}` }}>
                          {item.badge}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <Link
                          href={item.boxUrl}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: isBox ? '#047857' : '#334155',
                            background: isBox ? '#ecfdf5' : '#f8fafc',
                            border: isBox ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                            textDecoration: 'none'
                          }}
                        >
                          <Layers size={13} color={isBox ? '#047857' : '#64748b'} />
                          <span>Layout box</span>
                        </Link>
                        <Link
                          href={item.smartUrl}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: isSmart ? '#047857' : '#334155',
                            background: isSmart ? '#ecfdf5' : '#f8fafc',
                            border: isSmart ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                            textDecoration: 'none'
                          }}
                        >
                          <Sparkles size={13} color={isSmart ? '#047857' : '#0284c7'} />
                          <span>Layout smart</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          """

# Replace exact mobile block
start_marker_m = '{/* 3. Special Question Bank Accordion (Mobile) */}'
end_marker_m = '{/* 4. Most Important Accordion (Mobile) */}'

idx1_m = content.find(start_marker_m)
idx2_m = content.find(end_marker_m)
assert idx1_m != -1 and idx2_m != -1, "Mobile markers not found"

content = content[:idx1_m] + mobile_special_menu_full + content[idx2_m:]
print("Mobile special menu updated cleanly.")

with open('src/components/Navbar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Navbar.jsx successfully updated!")

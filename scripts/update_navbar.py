with open('src/components/Navbar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Desktop Dropdowns
desktop_dropdowns = """
          {/* Ampibian Suggestion Dropdown */}
          <div 
            style={{ position: 'relative' }} 
            ref={ampibianDropdownRef}
            onMouseEnter={handleMouseEnterAmpibian}
            onMouseLeave={handleMouseLeaveAmpibian}
          >
            <button
              onClick={() => setAmpibianDropdownOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                color: isAmpibianActive ? '#047857' : '#475569',
                background: isAmpibianActive ? '#ecfdf5' : ampibianDropdownOpen ? '#f8fafc' : 'transparent',
                border: isAmpibianActive ? '1px solid #a7f3d0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-expanded={ampibianDropdownOpen}
              aria-haspopup="true"
            >
              <BookOpen size={15} color={isAmpibianActive ? '#047857' : '#059669'} />
              <span>অ্যাম্ফিবিয়ান</span>
              <ChevronDown 
                size={14} 
                style={{
                  transform: ampibianDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }}
              />
            </button>

            {ampibianDropdownOpen && (
              <div 
                className="dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '240px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                <Link
                  href="/ampibian-suggestion"
                  onClick={() => setAmpibianDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname === '/ampibian-suggestion' ? '#047857' : '#1e293b',
                    background: pathname === '/ampibian-suggestion' ? '#ecfdf5' : 'transparent',
                    border: pathname === '/ampibian-suggestion' ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={16} color={pathname === '/ampibian-suggestion' ? '#047857' : '#059669'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout box</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      অধ্যায়ভিত্তিক অ্যাম্ফিবিয়ান সাজেশন
                    </span>
                  </div>
                </Link>

                <Link
                  href="/ampibian-suggestion-smart/"
                  onClick={() => setAmpibianDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/ampibian-suggestion-smart') ? '#047857' : '#1e293b',
                    background: pathname?.startsWith('/ampibian-suggestion-smart') ? '#ecfdf5' : 'transparent',
                    border: pathname?.startsWith('/ampibian-suggestion-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={16} color={pathname?.startsWith('/ampibian-suggestion-smart') ? '#047857' : '#0284c7'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout smart</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      স্মার্ট সাজেশন ও প্র্যাকটিস
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Biddabari NTRCA Dropdown */}
          <div 
            style={{ position: 'relative' }} 
            ref={biddabariDropdownRef}
            onMouseEnter={handleMouseEnterBiddabari}
            onMouseLeave={handleMouseLeaveBiddabari}
          >
            <button
              onClick={() => setBiddabariDropdownOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                color: isBiddabariActive ? '#047857' : '#475569',
                background: isBiddabariActive ? '#ecfdf5' : biddabariDropdownOpen ? '#f8fafc' : 'transparent',
                border: isBiddabariActive ? '1px solid #a7f3d0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-expanded={biddabariDropdownOpen}
              aria-haspopup="true"
            >
              <GraduationCap size={15} color={isBiddabariActive ? '#047857' : '#2563eb'} />
              <span>বিদ্যাবাড়ি NTRCA</span>
              <ChevronDown 
                size={14} 
                style={{
                  transform: biddabariDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }}
              />
            </button>

            {biddabariDropdownOpen && (
              <div 
                className="dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '240px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                <Link
                  href="/biddabari-ntrca"
                  onClick={() => setBiddabariDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname === '/biddabari-ntrca' ? '#047857' : '#1e293b',
                    background: pathname === '/biddabari-ntrca' ? '#ecfdf5' : 'transparent',
                    border: pathname === '/biddabari-ntrca' ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={16} color={pathname === '/biddabari-ntrca' ? '#047857' : '#059669'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout box</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      লেকচারভিত্তিক প্রশ্নব্যাংক
                    </span>
                  </div>
                </Link>

                <Link
                  href="/biddabari-ntrca-smart/"
                  onClick={() => setBiddabariDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/biddabari-ntrca-smart') ? '#047857' : '#1e293b',
                    background: pathname?.startsWith('/biddabari-ntrca-smart') ? '#ecfdf5' : 'transparent',
                    border: pathname?.startsWith('/biddabari-ntrca-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={16} color={pathname?.startsWith('/biddabari-ntrca-smart') ? '#047857' : '#0284c7'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout smart</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      স্মার্ট লেকচার অনুশীলন
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Smart AI Dropdown */}
          <div 
            style={{ position: 'relative' }} 
            ref={smartAiDropdownRef}
            onMouseEnter={handleMouseEnterSmartAi}
            onMouseLeave={handleMouseLeaveSmartAi}
          >
            <button
              onClick={() => setSmartAiDropdownOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
                color: isSmartAiActive ? '#047857' : '#475569',
                background: isSmartAiActive ? '#ecfdf5' : smartAiDropdownOpen ? '#f8fafc' : 'transparent',
                border: isSmartAiActive ? '1px solid #a7f3d0' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              aria-expanded={smartAiDropdownOpen}
              aria-haspopup="true"
            >
              <Cpu size={15} color={isSmartAiActive ? '#047857' : '#7c3aed'} />
              <span>স্মার্ট AI</span>
              <ChevronDown 
                size={14} 
                style={{
                  transform: smartAiDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }}
              />
            </button>

            {smartAiDropdownOpen && (
              <div 
                className="dropdown-menu-anim"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '240px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  zIndex: 100
                }}
              >
                <Link
                  href="/smart-ai"
                  onClick={() => setSmartAiDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname === '/smart-ai' ? '#047857' : '#1e293b',
                    background: pathname === '/smart-ai' ? '#ecfdf5' : 'transparent',
                    border: pathname === '/smart-ai' ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Layers size={16} color={pathname === '/smart-ai' ? '#047857' : '#059669'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout box</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      বিপিএসসি ও শিক্ষক নিবন্ধন AI
                    </span>
                  </div>
                </Link>

                <Link
                  href="/smart-ai-smart/"
                  onClick={() => setSmartAiDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/smart-ai-smart') ? '#047857' : '#1e293b',
                    background: pathname?.startsWith('/smart-ai-smart') ? '#ecfdf5' : 'transparent',
                    border: pathname?.startsWith('/smart-ai-smart') ? '1px solid #a7f3d0' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={16} color={pathname?.startsWith('/smart-ai-smart') ? '#047857' : '#0284c7'} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Layout smart</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '1px' }}>
                      এআই স্পেশাল প্রস্তুতি রুম
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
"""

target_desktop = '          {/* File Tools Dropdown */}'
if target_desktop in content:
    content = content.replace(target_desktop, desktop_dropdowns + '\n          {/* File Tools Dropdown */}', 1)

# Mobile Accordions
mobile_accordions = """
          {/* Ampibian Suggestion Accordion (Mobile) */}
          <div style={{
            borderRadius: '10px',
            border: isAmpibianActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isAmpibianActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileAmpibianOpen(!mobileAmpibianOpen)}
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
                color: isAmpibianActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={18} color={isAmpibianActive ? '#047857' : '#059669'} />
                <span>অ্যাম্ফিবিয়ান সাজেশন</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileAmpibianOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileAmpibianOpen && (
              <div style={{
                padding: '4px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                <Link
                  href="/ampibian-suggestion"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname === '/ampibian-suggestion' ? '#047857' : '#334155',
                    background: pathname === '/ampibian-suggestion' ? '#ecfdf5' : '#ffffff',
                    border: pathname === '/ampibian-suggestion' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={16} color={pathname === '/ampibian-suggestion' ? '#047857' : '#64748b'} />
                    <span>Layout box (অধ্যায়ভিত্তিক)</span>
                  </div>
                </Link>

                <Link
                  href="/ampibian-suggestion-smart/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/ampibian-suggestion-smart') ? '#047857' : '#334155',
                    background: pathname?.startsWith('/ampibian-suggestion-smart') ? '#ecfdf5' : '#ffffff',
                    border: pathname?.startsWith('/ampibian-suggestion-smart') ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={16} color={pathname?.startsWith('/ampibian-suggestion-smart') ? '#047857' : '#0284c7'} />
                    <span>Layout smart (স্মার্ট প্রশ্নভাণ্ডার)</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Biddabari NTRCA Accordion (Mobile) */}
          <div style={{
            borderRadius: '10px',
            border: isBiddabariActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isBiddabariActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileBiddabariOpen(!mobileBiddabariOpen)}
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
                color: isBiddabariActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <GraduationCap size={18} color={isBiddabariActive ? '#047857' : '#2563eb'} />
                <span>বিদ্যাবাড়ি NTRCA</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileBiddabariOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileBiddabariOpen && (
              <div style={{
                padding: '4px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                <Link
                  href="/biddabari-ntrca"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname === '/biddabari-ntrca' ? '#047857' : '#334155',
                    background: pathname === '/biddabari-ntrca' ? '#ecfdf5' : '#ffffff',
                    border: pathname === '/biddabari-ntrca' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={16} color={pathname === '/biddabari-ntrca' ? '#047857' : '#64748b'} />
                    <span>Layout box (লেকচারভিত্তিক)</span>
                  </div>
                </Link>

                <Link
                  href="/biddabari-ntrca-smart/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/biddabari-ntrca-smart') ? '#047857' : '#334155',
                    background: pathname?.startsWith('/biddabari-ntrca-smart') ? '#ecfdf5' : '#ffffff',
                    border: pathname?.startsWith('/biddabari-ntrca-smart') ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={16} color={pathname?.startsWith('/biddabari-ntrca-smart') ? '#047857' : '#0284c7'} />
                    <span>Layout smart (স্মার্ট প্রশ্নভাণ্ডার)</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Smart AI Accordion (Mobile) */}
          <div style={{
            borderRadius: '10px',
            border: isSmartAiActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            background: isSmartAiActive ? '#f0fdf4' : '#f8fafc',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setMobileSmartAiOpen(!mobileSmartAiOpen)}
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
                color: isSmartAiActive ? '#047857' : '#1e293b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Cpu size={18} color={isSmartAiActive ? '#047857' : '#7c3aed'} />
                <span>স্মার্ট AI (Smart AI)</span>
              </div>
              <ChevronDown 
                size={16} 
                style={{
                  transform: mobileSmartAiOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  opacity: 0.75
                }} 
              />
            </button>

            {mobileSmartAiOpen && (
              <div style={{
                padding: '4px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid rgba(0,0,0,0.06)'
              }}>
                <Link
                  href="/smart-ai"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname === '/smart-ai' ? '#047857' : '#334155',
                    background: pathname === '/smart-ai' ? '#ecfdf5' : '#ffffff',
                    border: pathname === '/smart-ai' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={16} color={pathname === '/smart-ai' ? '#047857' : '#64748b'} />
                    <span>Layout box (বিষয়ভিত্তিক AI)</span>
                  </div>
                </Link>

                <Link
                  href="/smart-ai-smart/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: pathname?.startsWith('/smart-ai-smart') ? '#047857' : '#334155',
                    background: pathname?.startsWith('/smart-ai-smart') ? '#ecfdf5' : '#ffffff',
                    border: pathname?.startsWith('/smart-ai-smart') ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={16} color={pathname?.startsWith('/smart-ai-smart') ? '#047857' : '#0284c7'} />
                    <span>Layout smart (স্মার্ট প্রশ্নভাণ্ডার)</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
"""

target_mobile = '          {/* 3. File Tools Accordion */}'
if target_mobile in content:
    content = content.replace(target_mobile, mobile_accordions + '\n          {/* 3. File Tools Accordion */}', 1)

with open('src/components/Navbar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Navbar.jsx updated successfully!')

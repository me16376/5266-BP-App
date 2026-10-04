import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = os.path.join('src', 'app', 'graph-images', 'vectorData.jsx')
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# Item 7: 137519 cipher
old_item_7 = """<div className="p-3 bg-white rounded border border-slate-200 inline-block text-slate-800 font-mono select-none">
        <div className="flex gap-4 text-sm font-bold tracking-widest text-slate-900 border-b pb-1">
          <span>R O S E</span>
          <span className="text-slate-300">|</span>
          <span>C H A I R</span>
          <span className="text-slate-300">|</span>
          <span>P R E A C H</span>
          <span className="text-slate-300">|</span>
          <span className="text-indigo-600">S E A R C H</span>
        </div>
        <div className="flex gap-4 text-xs tracking-widest text-slate-600 pt-1">
          <span>6 8 2 1</span>
          <span className="text-slate-300">|</span>
          <span>7 3 4 5 6</span>
          <span className="text-slate-300">|</span>
          <span>9 6 1 4 7 3</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-indigo-700 bg-indigo-50 px-1 rounded">2 1 4 6 7 3</span>
        </div>
      </div>"""

new_item_7 = """<div style={{ padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'inline-block', color: '#1e293b', fontFamily: 'monospace', userSelect: 'none' }}>
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
          <span>R O S E</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span>C H A I R</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span>P R E A C H</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ color: '#4338ca' }}>S E A R C H</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', letterSpacing: '2px', color: '#475569', paddingTop: '6px' }}>
          <span>6 8 2 1</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span>7 3 4 5 6</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span>9 6 1 4 7 3</span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span style={{ fontWeight: 'bold', color: '#065f46', background: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>2 1 4 6 7 3</span>
        </div>
      </div>"""

code = code.replace(old_item_7, new_item_7)

# Replace memory items classes
code = re.sub(
    r'<div className="text-xl tracking-wider font-serif font-semibold select-none text-slate-900 text-center py-2">',
    r'<div style={{ fontSize: "22px", letterSpacing: "3px", fontFamily: "serif", fontWeight: 700, userSelect: "none", color: "#0f172a", textAlign: "center", padding: "8px 0" }}>',
    code
)
code = re.sub(
    r'<div className="text-2xl tracking-widest font-serif font-bold select-none text-emerald-800 text-center py-2">',
    r'<div style={{ fontSize: "24px", letterSpacing: "4px", fontFamily: "serif", fontWeight: 800, userSelect: "none", color: "#065f46", textAlign: "center", padding: "8px 0" }}>',
    code
)
code = re.sub(
    r'<div className="text-2xl tracking-widest font-serif font-bold select-none text-slate-800 text-center py-2">',
    r'<div style={{ fontSize: "24px", letterSpacing: "4px", fontFamily: "serif", fontWeight: 700, userSelect: "none", color: "#1e293b", textAlign: "center", padding: "8px 0" }}>',
    code
)

# Replace table 16 classes (260953)
code = re.sub(
    r'<div className="overflow-x-auto my-2">\s*<table className="border-collapse border border-slate-700 text-center text-sm font-sans mx-auto shadow-sm">',
    r'<div style={{ overflowX: "auto", margin: "8px 0" }}>\n        <table style={{ borderCollapse: "collapse", border: "2px solid #334155", textAlign: "center", fontSize: "14px", fontFamily: "sans-serif", margin: "0 auto" }}>',
    code
)
code = re.sub(
    r'<th className="border border-slate-700 bg-slate-50 px-3 py-1.5 font-bold text-slate-800 text-xs">',
    r'<th style={{ border: "1px solid #334155", background: "#f1f5f9", padding: "6px 12px", fontWeight: "bold", color: "#0f172a", fontSize: "13px" }}>',
    code
)
code = re.sub(
    r'<td key=\{i\} className="border border-slate-700 px-3 py-1.5 font-medium text-slate-900">',
    r'<td key={i} style={{ border: "1px solid #334155", padding: "6px 12px", fontWeight: 600, color: "#0f172a" }}>',
    code
)
code = re.sub(
    r'<td key=\{i\} className="border border-slate-700 px-3 py-1.5 font-semibold text-slate-900">',
    r'<td key={i} style={{ border: "1px solid #334155", padding: "6px 12px", fontWeight: 700, color: "#0f172a" }}>',
    code
)

# Replace 315235, 315243, 315245 text classes
code = re.sub(
    r'<div className="text-center">',
    r'<div style={{ textAlign: "center" }}>',
    code
)
code = re.sub(
    r'<p className="text-xs font-serif text-slate-800 mb-2">',
    r'<p style={{ fontSize: "13px", fontFamily: "serif", color: "#0f172a", margin: "0 0 8px" }}>',
    code
)
code = re.sub(
    r'<p className="text-xs font-serif text-slate-800 mb-1">',
    r'<p style={{ fontSize: "13px", fontFamily: "serif", color: "#0f172a", margin: "0 0 4px" }}>',
    code
)
code = re.sub(
    r'<span className="font-semibold">',
    r'<span style={{ fontWeight: "bold" }}>',
    code
)
code = re.sub(
    r'<div className="mt-1 font-serif text-sm font-semibold text-slate-900">',
    r'<div style={{ marginTop: "4px", fontFamily: "serif", fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>',
    code
)
code = re.sub(
    r'<span className="inline-block border-b border-slate-900 px-1">',
    r'<span style={{ display: "inline-block", borderBottom: "1px solid #0f172a", padding: "0 4px" }}>',
    code
)
code = re.sub(
    r'<span className="inline-block px-1">',
    r'<span style={{ display: "inline-block", padding: "0 4px" }}>',
    code
)

# Replace 330374 4x4 matrix
code = re.sub(
    r'<div className="overflow-x-auto my-1">\s*<table className="border-collapse border-2 border-slate-800 text-center font-bold text-base mx-auto bg-white shadow-sm">',
    r'<div style={{ overflowX: "auto", margin: "4px 0" }}>\n        <table style={{ borderCollapse: "collapse", border: "2px solid #0f172a", textAlign: "center", fontWeight: "bold", fontSize: "16px", margin: "0 auto", background: "#ffffff" }}>',
    code
)
code = re.sub(
    r'<td key=\{c\} className=\{`border border-slate-800 px-4 py-2 w-14 h-12 text-slate-900 \$\{val === \'\?\' \? \'text-red-600 bg-red-50 text-xl font-extrabold\' : \'\'\}`\}>',
    r'<td key={c} style={{ border: "1px solid #0f172a", padding: "8px 14px", width: "50px", height: "42px", color: val === "?" ? "#dc2626" : "#0f172a", background: val === "?" ? "#fef2f2" : "#ffffff", fontSize: val === "?" ? "20px" : "16px", fontWeight: "bold" }}>',
    code
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("Finished cleaning all className instances in vectorData.jsx!")

# GitHub ও Cloudflare Pages-এ Next.js অ্যাপ ডেপ্লয়মেন্ট গাইড

এই ডকুমেন্টে আপনার **JobSolutions BD (UJS) Next.js Web App** গিটহাবের মাধ্যমে **Cloudflare Pages**-এ বিনামূল্যে এবং হাই-স্পিড এজ সিডিএন (0ms latency)-এ ডেপ্লয় করার ধাপে ধাপে নির্দেশিকা দেওয়া হলো।

---

## ১. গিটহাব ও ক্লাউডফ্লেয়ার পেজেস রেডি
 
> [!NOTE]
> প্রজেক্ট থেকে সমস্ত অপ্রয়োজনীয় ভারী বাইনারি ডেটা বাদ দিয়ে সম্পূর্ণ ক্লিন একটি Next.js স্ট্যাটিক আর্কিটেকচার তৈরি করা হয়েছে।
> এর ফলে আপনার গিট রিপোজিটরি সাইজ হবে মাত্র **~২৫ MB**, যা কয়েক সেকেন্ডের মধ্যে GitHub-এ পুশ হবে এবং Cloudflare Pages-এ কোনো সমস্যা ছাড়াই ইনস্ট্যান্ট বিল্ড হবে!

---

## ২. গিট ইনিশিয়ালাইজ ও GitHub-এ কোড পুশ করার নিয়ম

আপনার টার্মিনালে নিচের কমান্ডগুলো ক্রমানুসারে চালান:

### ধাপ ১: গিট ইনিশিয়ালাইজ করুন (যদি পূর্বে না করা থাকে)
```powershell
git init
git add .
git commit -m "feat: complete Next.js Job Solutions & File Studio app for Cloudflare Pages"
```

### ধাপ ২: GitHub-এ একটি নতুন রিপোজিটরি তৈরি করুন
1. [github.com/new](https://github.com/new) লিংকে যান।
2. রিপোজিটরির নাম দিন, যেমন: `jobsolutions-mcq-web`.
3. এটি `Public` বা `Private` রাখতে পারেন।
4. **"Create repository"** বাটনে ক্লিক করুন।

### ধাপ ৩: গিটহাবে পুশ করুন
GitHub পেজে যে কমান্ডগুলো দেখাবে, তা টার্মিনালে রান করুন:
```powershell
git branch -M main
git remote add origin https://github.com/<your-username>/jobsolutions-mcq-web.git
git push -u origin main
```

---

## ৩. Cloudflare Pages-এ ডেপ্লয় করার নিয়ম

### ধাপ ১: Cloudflare ড্যাশবোর্ডে লগইন করুন
1. [dash.cloudflare.com](https://dash.cloudflare.com/) এ যান।
2. বাম পাশের মেনু থেকে **Workers & Pages** এ ক্লিক করুন।
3. **"Create application"** বাটনে ক্লিক করে **Pages** ট্যাব নির্বাচন করুন।
4. **"Connect to Git"** বাটনে ক্লিক করুন।

### ধাপ ২: GitHub রিপোজিটরি সিলেক্ট করুন
1. আপনার GitHub অ্যাকাউন্ট কানেক্ট করে `jobsolutions-mcq-web` রিপোজিটরিটি সিলেক্ট করুন।
2. **"Begin setup"** বাটনে ক্লিক করুন।

### ধাপ ৩: বিল্ড সেটিংস কনফিগার করুন (Build Settings)
নিচের সেটিংসগুলো প্রদান করুন:

| ফিল্ডের নাম | কী লিখবেন / সিলেক্ট করবেন |
| :--- | :--- |
| **Project Name** | `jobsolutions-bd` (বা আপনার পছন্দের নাম) |
| **Production Branch** | `main` |
| **Framework preset** | `Next.js (Static Export)` অথবা `None` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |

> [!NOTE]
> Environment Variables এ কোনো স্পেশাল ভ্যারিয়েবল প্রয়োজন নেই, কারণ সমস্ত ক্লায়েন্ট-সাইড এক্সাম ইনডেক্স, কিউরেটেড ডাটা ও WebAssembly প্যাকেজ বিল্ট-ইন রয়েছে।

### ধাপ ৪: "Save and Deploy" বাটনে ক্লিক করুন
- ক্লাউডফ্লেয়ার স্বয়ংক্রিয়ভাবে প্রজেক্টটি বিল্ড করবে।
- ১-২ মিনিটের মধ্যে আপনার ওয়েবসাইটটি লাইভ হয়ে যাবে এবং একটি ফ্রি ডোমেইন পাবেন (যেমন: `https://jobsolutions-bd.pages.dev`)!

---

## ৪. পরবর্তী সময়ে আপডেট দেওয়ার নিয়ম (Continuous Deployment)
ভবিষ্যতে আপনি লোকাল কোডে যেকোনো পরিবর্তন করে শুধু গিট পুশ করলেই হবে:
```powershell
git add .
git commit -m "Update exams or features"
git push
```
Cloudflare Pages স্বয়ংক্রিয়ভাবে নতুন কোড পেয়ে প্রতিবার অটোমেটিক বিল্ড ও রি-ডেপ্লয় সম্পন্ন করবে!

---

## ৫. সাইটে অফলাইন ফাইল পড়ার সুবিধা
ডেপ্লয় হওয়া ওয়েবসাইটে গিয়ে ব্যবহারকারীরা:
1. **বিসিএস, ব্যাংক, শিক্ষক নিয়োগ ও মন্ত্রণালয়ের** ২,১৫৪টি পরীক্ষা ও ২.৫ লক্ষ প্রশ্ন সরাসরি পড়তে ও প্র্যাকটিস করতে পারবেন।
2. **ইউনিভার্সাল ফাইল স্টুডিও (`/file-studio`):** নিজের যেকোনো `.xapk` ফাইল বা SQLite `.db` ফাইল ড্রপ করলেই ব্রাউজারের ভেতর মেমোরিতে ওপেন হয়ে সাথে সাথে পরীক্ষা দেওয়া যাবে!

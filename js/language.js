// 3言語切り替え機能（日本語、英語、中国語）

const translations = {
    ja: {
        // ナビゲーション
        'nav.seminars': 'セミナー',
        'nav.events': 'イベント',
        'nav.consultations': '個別相談',
        'nav.jobs': '求人検索',
        'nav.knowledge': '就職知識',
        'nav.login': 'ログイン',
        'nav.register': '会員登録',
        'nav.mypage': 'マイページ',
        'nav.logout': 'ログアウト',
        
        // トップページ
        'home.hero.title': '日本の大学から、未来へ',
        'home.hero.subtitle': '留学生の「日本で働く」を一番近くで支える。',
        'home.hero.description': '日本語村は、日本の大学から誕生した留学生専用の就職支援ポータルです。大学と密着した手厚いサポートで、知識ゼロから内定まで、あなたの挑戦を完全に無料でバックアップします。',
        'home.hero.cta': '今すぐ無料登録',
        
        // 認証ページ
        'auth.title': 'ログイン・会員登録',
        'auth.login.tab': 'ログイン',
        'auth.register.tab': '新規登録',
        'auth.email': 'メールアドレス',
        'auth.password': 'パスワード',
        'auth.name': '氏名',
        'auth.birthdate': '生年月日',
        'auth.nationality': '国籍',
        'auth.japanese_level': '日本語レベル',
        'auth.university': '大学名',
        'auth.degree_level': '学位レベル',
        'auth.major': '専攻',
        'auth.graduation_date': '卒業予定日',
        'auth.phone': '電話番号',
        'auth.login.button': 'ログイン',
        'auth.register.button': '新規登録',
        'auth.forgot_password': 'パスワードを忘れた方',
        
        // 共通
        'common.select': '選択してください',
        'common.all': 'すべて',
        'common.required': '*',
    },
    en: {
        // Navigation
        'nav.seminars': 'Seminars',
        'nav.events': 'Events',
        'nav.consultations': 'Consultations',
        'nav.jobs': 'Job Search',
        'nav.knowledge': 'Career Knowledge',
        'nav.login': 'Login',
        'nav.register': 'Sign Up',
        'nav.mypage': 'My Page',
        'nav.logout': 'Logout',
        
        // Home Page
        'home.hero.title': 'From Japanese Universities to Your Future',
        'home.hero.subtitle': 'Supporting international students\' careers in Japan.',
        'home.hero.description': 'Nihongo Mura is a job support portal for international students, born from Japanese universities. With close university collaboration and comprehensive support, we back your journey from zero knowledge to job offer, completely free.',
        'home.hero.cta': 'Register Now for Free',
        
        // Auth Page
        'auth.title': 'Login / Sign Up',
        'auth.login.tab': 'Login',
        'auth.register.tab': 'Sign Up',
        'auth.email': 'Email Address',
        'auth.password': 'Password',
        'auth.name': 'Full Name',
        'auth.birthdate': 'Date of Birth',
        'auth.nationality': 'Nationality',
        'auth.japanese_level': 'Japanese Level',
        'auth.university': 'University',
        'auth.degree_level': 'Degree Level',
        'auth.major': 'Major',
        'auth.graduation_date': 'Expected Graduation',
        'auth.phone': 'Phone Number',
        'auth.login.button': 'Login',
        'auth.register.button': 'Sign Up',
        'auth.forgot_password': 'Forgot Password?',
        
        // Common
        'common.select': 'Please select',
        'common.all': 'All',
        'common.required': '*',
    },
    zh: {
        // 导航
        'nav.seminars': '讲座',
        'nav.events': '活动',
        'nav.consultations': '个别咨询',
        'nav.jobs': '职位搜索',
        'nav.knowledge': '就业知识',
        'nav.login': '登录',
        'nav.register': '注册会员',
        'nav.mypage': '我的页面',
        'nav.logout': '退出登录',
        
        // 首页
        'home.hero.title': '从日本大学走向未来',
        'home.hero.subtitle': '最贴近留学生的"在日本工作"支持。',
        'home.hero.description': '日本语村是从日本大学诞生的留学生专用就业支援门户网站。通过与大学紧密合作的全面支持，从零知识到获得内定，完全免费支持您的挑战。',
        'home.hero.cta': '立即免费注册',
        
        // 认证页面
        'auth.title': '登录・注册会员',
        'auth.login.tab': '登录',
        'auth.register.tab': '新注册',
        'auth.email': '电子邮箱',
        'auth.password': '密码',
        'auth.name': '姓名',
        'auth.birthdate': '出生日期',
        'auth.nationality': '国籍',
        'auth.japanese_level': '日语水平',
        'auth.university': '大学名称',
        'auth.degree_level': '学位等级',
        'auth.major': '专业',
        'auth.graduation_date': '预计毕业日期',
        'auth.phone': '电话号码',
        'auth.login.button': '登录',
        'auth.register.button': '注册',
        'auth.forgot_password': '忘记密码？',
        
        // 通用
        'common.select': '请选择',
        'common.all': '全部',
        'common.required': '*',
    }
};

// 現在の言語を取得（デフォルトは日本語）
let currentLang = localStorage.getItem('language') || 'ja';

// 言語を設定
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updatePageContent();
    updateLanguageButtons();
}

// ページコンテンツを更新
function updatePageContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

// 言語ボタンの表示を更新
function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    // 言語切り替えボタンのイベントリスナーを設定
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
    
    // 初期表示
    updatePageContent();
    updateLanguageButtons();
});

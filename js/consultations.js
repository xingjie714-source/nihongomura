// 個別相談ページのJavaScript

// LocalStorageから利用可能な相談枠データを取得
function getAvailableSlots() {
    const publicSlots = localStorage.getItem('public_consultation_slots');
    if (publicSlots) {
        return JSON.parse(publicSlots);
    }
    
    // フォールバック：サンプルデータ
    return [
        {
            id: 1,
            title: '個別相談',
            start: '2026-02-15T10:00:00',
            end: '2026-02-15T11:00:00',
            available: true
        },
        {
            id: 2,
            title: '個別相談',
            start: '2026-02-15T14:00:00',
            end: '2026-02-15T15:00:00',
            available: true
        },
        {
            id: 3,
            title: '個別相談',
            start: '2026-02-16T10:00:00',
            end: '2026-02-16T11:00:00',
            available: true
        },
        {
            id: 4,
            title: '個別相談',
            start: '2026-02-17T13:00:00',
            end: '2026-02-17T14:00:00',
            available: true
        },
        {
            id: 5,
            title: '個別相談',
            start: '2026-02-18T15:00:00',
            end: '2026-02-18T16:00:00',
            available: true
        },
        {
            id: 6,
            title: '個別相談',
            start: '2026-02-19T10:00:00',
            end: '2026-02-19T11:00:00',
            available: true
        },
        {
            id: 7,
            title: '個別相談',
            start: '2026-02-20T14:00:00',
            end: '2026-02-20T15:00:00',
            available: true
        },
        {
            id: 8,
            title: '個別相談',
            start: '2026-02-21T10:00:00',
            end: '2026-02-21T11:00:00',
            available: true
        }
    ];
}

// 現在の言語を取得
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ja';
}

// カレンダーを初期化
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    if (!calendarEl) return;

    const lang = getCurrentLanguage();
    const locale = lang === 'ja' ? 'ja' : lang === 'zh' ? 'zh-cn' : 'en';

    const availableSlots = getAvailableSlots();

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: locale,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
        },
        slotMinTime: '09:00:00',
        slotMaxTime: '18:00:00',
        allDaySlot: false,
        events: availableSlots.map(slot => ({
            id: slot.id,
            title: getSlotTitle(lang),
            start: slot.start,
            end: slot.end,
            backgroundColor: '#FF6B35',
            borderColor: '#FF6B35',
            textColor: '#FFFFFF'
        })),
        eventClick: function(info) {
            // カレンダーの枠をクリックしたら予約ページへ遷移
            const slotId = info.event.id;
            window.location.href = `consultation-booking.html?slot=${slotId}`;
        },
        eventMouseEnter: function(info) {
            info.el.style.cursor = 'pointer';
        }
    });

    calendar.render();

    // 言語切り替え時にカレンダーを再レンダリング
    window.addEventListener('languageChanged', function() {
        const newLang = getCurrentLanguage();
        const newLocale = newLang === 'ja' ? 'ja' : newLang === 'zh' ? 'zh-cn' : 'en';
        calendar.setOption('locale', newLocale);
        
        // イベントのタイトルを更新
        const events = calendar.getEvents();
        events.forEach(event => {
            event.setProp('title', getSlotTitle(newLang));
        });
    });
});

// スロットタイトルを取得
function getSlotTitle(lang) {
    const titles = {
        ja: '個別相談（空き）',
        en: 'Consultation (Available)',
        zh: '个别咨询（空闲）'
    };
    return titles[lang] || titles['ja'];
}

// 利用可能な相談枠をグローバルに公開（予約ページで使用）
window.getAvailableSlots = getAvailableSlots;

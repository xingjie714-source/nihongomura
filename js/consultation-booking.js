// 個別相談予約ページのJavaScript

// 現在の言語を取得
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ja';
}

// ログイン状態を確認（仮実装）
function checkLoginStatus() {
    // 実際の実装では、サーバーサイドでセッションを確認
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return isLoggedIn;
}

// 利用可能な相談枠を取得
function getAvailableSlots() {
    // LocalStorageから取得
    const publicSlots = localStorage.getItem('public_consultation_slots');
    if (publicSlots) {
        return JSON.parse(publicSlots);
    }
    
    // フォールバック：サンプルデータ
    return [
        {
            id: 1,
            start: '2026-02-15T10:00:00',
            end: '2026-02-15T11:00:00',
            available: true
        },
        {
            id: 2,
            start: '2026-02-15T14:00:00',
            end: '2026-02-15T15:00:00',
            available: true
        },
        {
            id: 3,
            start: '2026-02-16T10:00:00',
            end: '2026-02-16T11:00:00',
            available: true
        },
        {
            id: 4,
            start: '2026-02-17T13:00:00',
            end: '2026-02-17T14:00:00',
            available: true
        },
        {
            id: 5,
            start: '2026-02-18T15:00:00',
            end: '2026-02-18T16:00:00',
            available: true
        },
        {
            id: 6,
            start: '2026-02-19T10:00:00',
            end: '2026-02-19T11:00:00',
            available: true
        },
        {
            id: 7,
            start: '2026-02-20T14:00:00',
            end: '2026-02-20T15:00:00',
            available: true
        },
        {
            id: 8,
            start: '2026-02-21T10:00:00',
            end: '2026-02-21T11:00:00',
            available: true
        }
    ];
}

// 日時をフォーマット
function formatDateTime(dateTimeStr, lang) {
    const date = new Date(dateTimeStr);
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const weekdays = {
        ja: ['日', '月', '火', '水', '木', '金', '土'],
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        zh: ['日', '一', '二', '三', '四', '五', '六']
    };
    
    const weekday = weekdays[lang][date.getDay()];
    
    if (lang === 'ja') {
        return `${year}年${month}月${day}日（${weekday}） ${hours}:${minutes.toString().padStart(2, '0')}`;
    } else if (lang === 'en') {
        return `${month}/${day}/${year} (${weekday}) ${hours}:${minutes.toString().padStart(2, '0')}`;
    } else if (lang === 'zh') {
        return `${year}年${month}月${day}日（周${weekday}） ${hours}:${minutes.toString().padStart(2, '0')}`;
    }
}

// ページ初期化
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = checkLoginStatus();
    const loginRequired = document.getElementById('login-required');
    const bookingFormContainer = document.getElementById('booking-form-container');
    
    if (isLoggedIn) {
        // ログイン済み：予約フォームを表示
        loginRequired.style.display = 'none';
        bookingFormContainer.style.display = 'block';
        
        // 利用可能な相談枠を読み込む
        loadAvailableSlots();
        
        // URLパラメータから選択されたスロットを取得
        const urlParams = new URLSearchParams(window.location.search);
        const selectedSlotId = urlParams.get('slot');
        if (selectedSlotId) {
            document.getElementById('consultation-slot').value = selectedSlotId;
        }
    } else {
        // 未ログイン：ログイン要求メッセージを表示
        loginRequired.style.display = 'block';
        bookingFormContainer.style.display = 'none';
    }
    
    // フォーム送信処理
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
    }
});

// 利用可能な相談枠を読み込む
function loadAvailableSlots() {
    const lang = getCurrentLanguage();
    const slots = getAvailableSlots();
    const selectElement = document.getElementById('consultation-slot');
    
    if (!selectElement) return;
    
    // 既存のオプションをクリア（最初の「選択してください」以外）
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }
    
    // 利用可能な枠を追加
    slots.forEach(slot => {
        if (slot.available) {
            const option = document.createElement('option');
            option.value = slot.id;
            option.textContent = formatDateTime(slot.start, lang);
            selectElement.appendChild(option);
        }
    });
}

// 予約を保存
function saveBooking(bookingData) {
    const bookings = JSON.parse(localStorage.getItem('nihongomura_consultation_bookings') || '[]');
    const newBooking = {
        id: Date.now(),
        slotId: parseInt(bookingData.slot),
        studentName: 'テストユーザー', // 実際はログインユーザー名
        consultationType: getConsultationTypeName(bookingData.type),
        details: bookingData.details,
        documents: bookingData.documents,
        otherDocuments: bookingData.otherDocuments,
        email: bookingData.email,
        phone: bookingData.phone,
        status: 'booked',
        createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    localStorage.setItem('nihongomura_consultation_bookings', JSON.stringify(bookings));
    
    // 相談枠のステータスを更新
    const slots = JSON.parse(localStorage.getItem('nihongomura_consultation_slots') || '[]');
    const slot = slots.find(s => s.id === parseInt(bookingData.slot));
    if (slot) {
        slot.status = 'booked';
        slot.bookingId = newBooking.id;
        localStorage.setItem('nihongomura_consultation_slots', JSON.stringify(slots));
        
        // 公開用データを更新
        updatePublicSlots(slots);
    }
    
    return newBooking;
}

// 相談タイプ名を取得
function getConsultationTypeName(type) {
    const types = {
        career: '進路相談',
        resume: 'ES/履歴書添削',
        interview: '面接練習',
        'self-analysis': '自己分析',
        industry: '業界研究',
        visa: 'ビザ・在留資格の基本案内'
    };
    return types[type] || type;
}

// 公開用の相談枠データを更新
function updatePublicSlots(slots) {
    const publicSlots = slots
        .filter(s => s.status === 'available')
        .map(s => ({
            id: s.id,
            title: '個別相談',
            start: `${s.date}T${s.startTime}:00`,
            end: `${s.date}T${s.endTime}:00`,
            available: true
        }));
    
    localStorage.setItem('public_consultation_slots', JSON.stringify(publicSlots));
}

// フォーム送信処理
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        slot: formData.get('slot'),
        type: formData.get('type'),
        details: formData.get('details'),
        documents: formData.getAll('documents'),
        otherDocuments: formData.get('other-documents'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };
    
    console.log('予約データ:', data);
    
    // 予約を保存
    const booking = saveBooking(data);
    
    // 成功メッセージを表示
    const lang = getCurrentLanguage();
    const messages = {
        ja: '予約が完了しました！\n確認メールをお送りしました。\n\n予約ID: ' + booking.id,
        en: 'Booking completed!\nA confirmation email has been sent.\n\nBooking ID: ' + booking.id,
        zh: '预约完成！\n已发送确认邮件。\n\n预约ID: ' + booking.id
    };
    
    alert(messages[lang]);
    
    // 個別相談ページへリダイレクト
    window.location.href = 'consultations-public.html';
}

// 言語切り替え時に相談枠を再読み込み
window.addEventListener('languageChanged', function() {
    loadAvailableSlots();
});

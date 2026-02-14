// 個別相談管理のJavaScript

// LocalStorageキー
const SLOTS_STORAGE_KEY = 'nihongomura_consultation_slots';
const BOOKINGS_STORAGE_KEY = 'nihongomura_consultation_bookings';

// 相談枠データを取得
function getSlots() {
    const data = localStorage.getItem(SLOTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// 相談枠データを保存
function saveSlots(slots) {
    localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(slots));
}

// 予約データを取得
function getBookings() {
    const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// 予約データを保存
function saveBookings(bookings) {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

// 相談枠を追加
function addSlot(slotData) {
    const slots = getSlots();
    const newSlot = {
        id: Date.now(),
        date: slotData.date,
        startTime: slotData.startTime,
        endTime: slotData.endTime,
        status: slotData.status || 'available',
        bookingId: null,
        createdAt: new Date().toISOString()
    };
    slots.push(newSlot);
    saveSlots(slots);
    return newSlot;
}

// 相談枠を更新
function updateSlot(id, slotData) {
    const slots = getSlots();
    const index = slots.findIndex(s => s.id === id);
    if (index !== -1) {
        slots[index] = {
            ...slots[index],
            date: slotData.date,
            startTime: slotData.startTime,
            endTime: slotData.endTime,
            status: slotData.status,
            updatedAt: new Date().toISOString()
        };
        saveSlots(slots);
        return slots[index];
    }
    return null;
}

// 相談枠を削除
function deleteSlot(id) {
    const slots = getSlots();
    const filteredSlots = slots.filter(s => s.id !== id);
    saveSlots(filteredSlots);
}

// 日時をフォーマット
function formatSlotDateTime(date, startTime, endTime) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[d.getDay()];
    
    return `${year}年${month}月${day}日（${weekday}） ${startTime} - ${endTime}`;
}

// ステータスバッジを生成
function getStatusBadge(status) {
    const badges = {
        available: '<span style="background: #4CAF50; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">空き</span>',
        booked: '<span style="background: #FF9800; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">予約済み</span>',
        unavailable: '<span style="background: #9E9E9E; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">利用不可</span>'
    };
    return badges[status] || status;
}

// 相談枠テーブルを表示
function renderSlotsTable() {
    const slots = getSlots();
    const bookings = getBookings();
    const tbody = document.getElementById('slotsTableBody');
    
    if (!tbody) return;
    
    // 日付順にソート
    slots.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA - dateB;
    });
    
    tbody.innerHTML = '';
    
    if (slots.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--medium-gray);">相談枠がありません</td></tr>';
        return;
    }
    
    slots.forEach(slot => {
        const booking = bookings.find(b => b.slotId === slot.id);
        const bookerName = booking ? booking.studentName : '-';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${slot.id}</td>
            <td>${formatSlotDateTime(slot.date, slot.startTime, slot.endTime)}</td>
            <td>${slot.startTime} - ${slot.endTime}</td>
            <td>${getStatusBadge(slot.status)}</td>
            <td>${bookerName}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editSlot(${slot.id})">
                        <i class="fas fa-edit"></i> 編集
                    </button>
                    <button class="btn-delete" onclick="deleteSlotConfirm(${slot.id})">
                        <i class="fas fa-trash"></i> 削除
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 予約テーブルを表示
function renderBookingsTable() {
    const bookings = getBookings();
    const slots = getSlots();
    const tbody = document.getElementById('bookingsTableBody');
    
    if (!tbody) return;
    
    // 日付順にソート
    bookings.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
    });
    
    tbody.innerHTML = '';
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--medium-gray);">予約がありません</td></tr>';
        return;
    }
    
    bookings.forEach(booking => {
        const slot = slots.find(s => s.id === booking.slotId);
        const dateTime = slot ? formatSlotDateTime(slot.date, slot.startTime, slot.endTime) : '不明';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.studentName}</td>
            <td>${booking.consultationType}</td>
            <td>${dateTime}</td>
            <td>${getStatusBadge(booking.status)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="viewBookingDetails(${booking.id})">
                        <i class="fas fa-eye"></i> 詳細
                    </button>
                    <button class="btn-delete" onclick="cancelBookingConfirm(${booking.id})">
                        <i class="fas fa-times"></i> キャンセル
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// 相談枠追加モーダルを開く
function openAddSlotModal() {
    document.getElementById('slotModalTitle').textContent = '相談枠を追加';
    document.getElementById('slotForm').reset();
    document.getElementById('slotId').value = '';
    document.getElementById('slotStatus').value = 'available';
    document.getElementById('slotModal').style.display = 'flex';
}

// 相談枠編集モーダルを開く
function editSlot(id) {
    const slots = getSlots();
    const slot = slots.find(s => s.id === id);
    
    if (!slot) return;
    
    document.getElementById('slotModalTitle').textContent = '相談枠を編集';
    document.getElementById('slotId').value = slot.id;
    document.getElementById('slotDate').value = slot.date;
    document.getElementById('slotStartTime').value = slot.startTime;
    document.getElementById('slotEndTime').value = slot.endTime;
    document.getElementById('slotStatus').value = slot.status;
    document.getElementById('slotModal').style.display = 'flex';
}

// 相談枠モーダルを閉じる
function closeSlotModal() {
    document.getElementById('slotModal').style.display = 'none';
}

// 相談枠フォーム送信
document.addEventListener('DOMContentLoaded', function() {
    const slotForm = document.getElementById('slotForm');
    if (slotForm) {
        slotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const slotData = {
                date: formData.get('date'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                status: formData.get('status')
            };
            
            const slotId = document.getElementById('slotId').value;
            
            if (slotId) {
                // 編集
                updateSlot(parseInt(slotId), slotData);
                alert('相談枠を更新しました');
            } else {
                // 新規追加
                addSlot(slotData);
                alert('相談枠を追加しました');
            }
            
            closeSlotModal();
            renderSlotsTable();
            
            // consultations.jsの相談枠データも更新
            updatePublicSlots();
        });
    }
    
    // 初期表示
    renderSlotsTable();
    renderBookingsTable();
});

// 相談枠削除確認
function deleteSlotConfirm(id) {
    if (confirm('この相談枠を削除してもよろしいですか？')) {
        deleteSlot(id);
        alert('相談枠を削除しました');
        renderSlotsTable();
        updatePublicSlots();
    }
}

// 公開用の相談枠データを更新
function updatePublicSlots() {
    const slots = getSlots();
    const publicSlots = slots
        .filter(s => s.status === 'available')
        .map(s => ({
            id: s.id,
            title: '個別相談',
            start: `${s.date}T${s.startTime}:00`,
            end: `${s.date}T${s.endTime}:00`,
            available: true
        }));
    
    // consultations.jsで使用するデータを更新
    localStorage.setItem('public_consultation_slots', JSON.stringify(publicSlots));
}

// 予約詳細を表示
function viewBookingDetails(id) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) return;
    
    const slots = getSlots();
    const slot = slots.find(s => s.id === booking.slotId);
    const dateTime = slot ? formatSlotDateTime(slot.date, slot.startTime, slot.endTime) : '不明';
    
    const detailsHtml = `
        <div style="line-height: 1.8;">
            <p><strong>予約ID:</strong> ${booking.id}</p>
            <p><strong>学生名:</strong> ${booking.studentName}</p>
            <p><strong>メールアドレス:</strong> ${booking.email}</p>
            <p><strong>電話番号:</strong> ${booking.phone || '未登録'}</p>
            <p><strong>相談タイプ:</strong> ${booking.consultationType}</p>
            <p><strong>日時:</strong> ${dateTime}</p>
            <p><strong>相談内容:</strong></p>
            <p style="background: #F5F5F5; padding: 1rem; border-radius: 6px; white-space: pre-wrap;">${booking.details}</p>
            <p><strong>持参資料:</strong> ${booking.documents ? booking.documents.join(', ') : 'なし'}</p>
            <p><strong>その他の準備物:</strong> ${booking.otherDocuments || 'なし'}</p>
            <p><strong>予約日時:</strong> ${new Date(booking.createdAt).toLocaleString('ja-JP')}</p>
            <p><strong>ステータス:</strong> ${getStatusBadge(booking.status)}</p>
        </div>
    `;
    
    document.getElementById('bookingDetails').innerHTML = detailsHtml;
    document.getElementById('bookingModal').style.display = 'flex';
    
    // 現在の予約IDを保存
    window.currentBookingId = id;
}

// 予約モーダルを閉じる
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
    window.currentBookingId = null;
}

// 予約をキャンセル
function cancelBooking() {
    if (!window.currentBookingId) return;
    
    if (confirm('この予約をキャンセルしてもよろしいですか？')) {
        const bookings = getBookings();
        const booking = bookings.find(b => b.id === window.currentBookingId);
        
        if (booking) {
            // 予約ステータスを更新
            booking.status = 'cancelled';
            saveBookings(bookings);
            
            // 相談枠のステータスを更新
            const slots = getSlots();
            const slot = slots.find(s => s.id === booking.slotId);
            if (slot) {
                slot.status = 'available';
                slot.bookingId = null;
                saveSlots(slots);
            }
            
            alert('予約をキャンセルしました');
            closeBookingModal();
            renderSlotsTable();
            renderBookingsTable();
            updatePublicSlots();
        }
    }
}

// 予約キャンセル確認
function cancelBookingConfirm(id) {
    if (confirm('この予約をキャンセルしてもよろしいですか？')) {
        const bookings = getBookings();
        const booking = bookings.find(b => b.id === id);
        
        if (booking) {
            booking.status = 'cancelled';
            saveBookings(bookings);
            
            // 相談枠のステータスを更新
            const slots = getSlots();
            const slot = slots.find(s => s.id === booking.slotId);
            if (slot) {
                slot.status = 'available';
                slot.bookingId = null;
                saveSlots(slots);
            }
            
            alert('予約をキャンセルしました');
            renderSlotsTable();
            renderBookingsTable();
            updatePublicSlots();
        }
    }
}

// モーダルの外側をクリックしたら閉じる
window.addEventListener('click', function(e) {
    if (e.target.id === 'slotModal') {
        closeSlotModal();
    }
    if (e.target.id === 'bookingModal') {
        closeBookingModal();
    }
});

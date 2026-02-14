// セミナーページのJavaScript

// Supabaseクライアントの初期化
const supabaseDb = window.supabaseClient;

// カレンダーのインスタンス
let calendar;

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', async function() {
    // カレンダーを初期化
    initializeCalendar();
    
    // セミナーデータを読み込み
    await loadSeminars();
});

// カレンダーを初期化
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ja',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        buttonText: {
            today: '今日',
            month: '月',
            week: '週',
            list: 'リスト'
        },
        events: [],
        eventClick: function(info) {
            // イベントクリック時の処理
            showSeminarDetails(info.event.extendedProps.seminarId);
        },
        height: 'auto'
    });
    
    calendar.render();
}

// セミナーデータを読み込み
async function loadSeminars() {
    try {
        const { data: seminars, error } = await supabaseDb
            .from('seminars')
            .select('*')
            .order('date', { ascending: true });
        
        if (error) throw error;
        
        if (seminars && seminars.length > 0) {
            // カレンダーにイベントを追加
            const events = seminars.map(seminar => ({
                id: seminar.id,
                title: seminar.title,
                start: seminar.date,
                extendedProps: {
                    seminarId: seminar.id,
                    description: seminar.description,
                    level: seminar.level,
                    language: seminar.language,
                    capacity: seminar.capacity,
                    registered: seminar.registered_count || 0
                }
            }));
            
            calendar.addEventSource(events);
            
            // セミナー一覧を表示
            displaySeminarsList(seminars);
        } else {
            // セミナーがない場合のメッセージ
            document.getElementById('seminars-list').innerHTML = `
                <div class="no-seminars">
                    <i class="fas fa-calendar-times"></i>
                    <p>現在、開催予定のセミナーはありません。</p>
                    <p>新しいセミナーが追加されるまでお待ちください。</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('セミナー読み込みエラー:', error);
        document.getElementById('seminars-list').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>セミナー情報の読み込みに失敗しました。</p>
                <p>ページを再読み込みしてください。</p>
            </div>
        `;
    }
}

// セミナー一覧を表示
function displaySeminarsList(seminars) {
    const seminarsList = document.getElementById('seminars-list');
    
    if (!seminars || seminars.length === 0) {
        seminarsList.innerHTML = `
            <div class="no-seminars">
                <i class="fas fa-calendar-times"></i>
                <p>現在、開催予定のセミナーはありません。</p>
            </div>
        `;
        return;
    }
    
    seminarsList.innerHTML = seminars.map(seminar => {
        const date = new Date(seminar.date);
        const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        const timeStr = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        const levelClass = getLevelClass(seminar.level);
        const levelText = getLevelText(seminar.level);
        
        const isFull = seminar.registered_count >= seminar.capacity;
        const statusClass = isFull ? 'full' : 'available';
        const statusText = isFull ? '満席' : '申込可能';
        
        return `
            <div class="seminar-card">
                <div class="seminar-header">
                    <span class="seminar-level ${levelClass}">${levelText}</span>
                    <span class="seminar-status ${statusClass}">${statusText}</span>
                </div>
                <h3 class="seminar-title">${seminar.title}</h3>
                <p class="seminar-description">${seminar.description || ''}</p>
                <div class="seminar-info">
                    <div class="info-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${dateStr}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${timeStr}〜</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-language"></i>
                        <span>${seminar.language || '日本語'}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-users"></i>
                        <span>${seminar.registered_count || 0}/${seminar.capacity}名</span>
                    </div>
                </div>
                <button class="btn-apply" onclick="applySeminar('${seminar.id}')" ${isFull ? 'disabled' : ''}>
                    ${isFull ? '満席' : '申し込む'}
                </button>
            </div>
        `;
    }).join('');
}

// レベルのクラスを取得
function getLevelClass(level) {
    const levelMap = {
        '初心者': 'beginner',
        '中級': 'intermediate',
        '上級': 'advanced'
    };
    return levelMap[level] || 'beginner';
}

// レベルのテキストを取得
function getLevelText(level) {
    return level || '初心者';
}

// セミナーに申し込む
async function applySeminar(seminarId) {
    // ログイン状態を確認
    const { data: { user } } = await supabaseDb.auth.getUser();
    
    if (!user) {
        alert('セミナーに申し込むにはログインが必要です。');
        window.location.href = 'auth.html';
        return;
    }
    
    try {
        // 既に申し込み済みかチェック
        const { data: existingApplication, error: checkError } = await supabaseDb
            .from('seminar_applications')
            .select('*')
            .eq('user_id', user.id)
            .eq('seminar_id', seminarId)
            .single();
        
        if (existingApplication) {
            alert('既にこのセミナーに申し込み済みです。');
            return;
        }
        
        // 申し込みを登録
        const { error: insertError } = await supabaseDb
            .from('seminar_applications')
            .insert({
                user_id: user.id,
                seminar_id: seminarId,
                status: 'pending'
            });
        
        if (insertError) throw insertError;
        
        alert('セミナーへの申し込みが完了しました！');
        
        // ページを再読み込み
        await loadSeminars();
    } catch (error) {
        console.error('申し込みエラー:', error);
        alert('申し込みに失敗しました。もう一度お試しください。');
    }
}

// セミナー詳細を表示
function showSeminarDetails(seminarId) {
    // セミナー詳細ページに遷移
    window.location.href = `seminar-detail.html?id=${seminarId}`;
}

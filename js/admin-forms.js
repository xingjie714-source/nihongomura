// 管理者フォーム関連の機能

// セミナー追加フォームの処理
async function handleSeminarForm(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('seminarTitle').value,
        description: document.getElementById('seminarDescription').value,
        date: document.getElementById('seminarDate').value,
        time: document.getElementById('seminarTime').value,
        level: document.getElementById('seminarLevel').value,
        language: document.getElementById('seminarLanguage').value,
        capacity: parseInt(document.getElementById('seminarCapacity').value),
        registered_count: 0
    };

    try {
        const { error } = await supabase
            .from('seminars')
            .insert([formData]);

        if (error) throw error;

        alert('セミナーを追加しました');
        event.target.reset();
        // セミナー一覧を再読み込み
        if (typeof loadSeminars === 'function') {
            loadSeminars();
        }
    } catch (error) {
        console.error('セミナー追加エラー:', error);
        alert('セミナーの追加に失敗しました: ' + error.message);
    }
}

// イベント追加フォームの処理
async function handleEventForm(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        capacity: parseInt(document.getElementById('eventCapacity').value),
        registered_count: 0
    };

    try {
        const { error } = await supabase
            .from('events')
            .insert([formData]);

        if (error) throw error;

        alert('イベントを追加しました');
        event.target.reset();
        // イベント一覧を再読み込み
        if (typeof loadEvents === 'function') {
            loadEvents();
        }
    } catch (error) {
        console.error('イベント追加エラー:', error);
        alert('イベントの追加に失敗しました: ' + error.message);
    }
}

// 求人追加フォームの処理
async function handleJobForm(event) {
    event.preventDefault();
    
    const formData = {
        company_name: document.getElementById('jobCompany').value,
        title: document.getElementById('jobTitle').value,
        description: document.getElementById('jobDescription').value,
        location: document.getElementById('jobLocation').value,
        salary: document.getElementById('jobSalary').value,
        employment_type: document.getElementById('jobType').value,
        visa_support: document.getElementById('jobVisa').checked,
        japanese_level: document.getElementById('jobJapanese').value,
        requirements: document.getElementById('jobRequirements').value
    };

    try {
        const { error } = await supabase
            .from('jobs')
            .insert([formData]);

        if (error) throw error;

        alert('求人を追加しました');
        event.target.reset();
        // 求人一覧を再読み込み
        if (typeof loadJobs === 'function') {
            loadJobs();
        }
    } catch (error) {
        console.error('求人追加エラー:', error);
        alert('求人の追加に失敗しました: ' + error.message);
    }
}

// フォームのバリデーション
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });

    return isValid;
}

// 画像アップロード機能
// Supabase Storageを使用して画像をアップロード

async function uploadImage(file, bucket = 'images') {
    if (!file) {
        throw new Error('ファイルが選択されていません');
    }

    // ファイルサイズチェック (5MB以下)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('ファイルサイズは5MB以下にしてください');
    }

    // ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error('JPG、PNG、GIF、WebP形式の画像のみアップロード可能です');
    }

    try {
        // ファイル名を生成 (タイムスタンプ + ランダム文字列)
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}_${randomString}.${fileExt}`;

        // Supabase Storageにアップロード
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // 公開URLを取得
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return {
            success: true,
            url: publicUrl,
            fileName: fileName
        };
    } catch (error) {
        console.error('画像アップロードエラー:', error);
        throw error;
    }
}

// 画像を削除
async function deleteImage(fileName, bucket = 'images') {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('画像削除エラー:', error);
        throw error;
    }
}

// 画像プレビュー
function previewImage(input, previewElementId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewElement = document.getElementById(previewElementId);
            if (previewElement) {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block';
            }
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

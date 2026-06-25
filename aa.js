// دالة بناء المعرض برمجياً بناءً على مصفوفة المنتجات المتواجدة في images.js
function renderGallery(categoryFilter = 'all') {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    
    container.innerHTML = '';

    // التحقق من وجود مصفوفة المنتجات المحملة من ملف images.js
    if (typeof dressImages === 'undefined' || !Array.isArray(dressImages)) {
        console.error("المصفوفة dressImages غير معرفة أو ليست مصفوفة صحيحة في ملف images.js");
        return;
    }

    // تصفية العناصر بناءً على الفئة المحددة
    const filteredData = categoryFilter === 'all' 
        ? dressImages 
        : dressImages.filter(item => item.category === categoryFilter);

    // إنشاء الكروت وإضافتها للمعرض
    filteredData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gallery-item';
        itemDiv.onclick = () => openLightbox(item);

        itemDiv.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="item-info">
                <span class="item-title">${item.title}</span>
                <span class="item-price">${item.price}</span>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

// دالة تصفية التصنيفات عند الضغط على الكروت في قسم التصنيفات
function filterCategory(catName) {
    renderGallery(catName);
    // الانتقال السلس إلى قسم المعرض لرؤية النتيجة
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
}

// دالة فتح الـ Lightbox وعرض بيانات الفستان
function openLightbox(item) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxPrice = document.getElementById('lightboxPrice');
    const lightboxOrderBtn = document.getElementById('lightboxOrderBtn');

    if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxPrice || !lightboxOrderBtn) return;

    lightboxImg.src = item.src;
    lightboxTitle.textContent = item.title;
    lightboxPrice.textContent = item.price;

    // تجهيز نص رسالة الواتساب المخصصة باسم الفستان وسعره للطلب المباشر
    const whatsappBase = "https://wa.me/966551523499";
    const messageText = `مرحباً بنتي تالين، أود الاستفسار عن فستان: (${item.title}) المعروض بسعر (${item.price})، هل هو متوفر حالياً؟`;
    lightboxOrderBtn.href = `${whatsappBase}?text=${encodeURIComponent(messageText)}`;

    lightbox.style.display = 'flex';
}

// دالة إغلاق الـ Lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}

// دالة التحكم في فتح وإغلاق قائمة الأسئلة الشائعة (Accordion)
function toggleFaq(element) {
    const item = element.parentElement;
    if (!item) return;

    // إذا كان العنصر مفتوحاً بالفعل، نقوم بإغلاقه
    if (item.classList.contains('active')) {
        item.classList.remove('active');
    } else {
        // إغلاق أي سؤال آخر مفتوح أولاً للحفاظ على المظهر المنظم
        const allItems = document.querySelectorAll('.faq-item');
        allItems.forEach(i => i.classList.remove('active'));
        
        // فتح السؤال الذي تم الضغط عليه
        item.classList.add('active');
    }
}

// تشغيل بناء المعرض تلقائياً عند تحميل الصفحة لأول مرة لعرض التشكيلة كاملة
document.addEventListener('DOMContentLoaded', () => {
    renderGallery('all');

    // إغلاق الـ Lightbox عند الضغط في أي مكان خارج محتوى نافذة العرض
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});

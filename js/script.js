/* ==========================================================================
   Mobile Wedding Invitation - Interactive Logic & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCalendar();
  initPetalAnimation();
  initBgm();
  initContactModal();
  initAccountAccordion();
  initGalleryLightbox();
  initGuestbook();
  initShareAndCalendar();
  initScrollAnimations();
});

/* ==========================================================================
   1. Real-time Countdown Animation
   ========================================================================== */
function initCountdown() {
  // 결혼식 일시: 2026년 12월 26일 오후 12:00:00 (KST)
  const targetDate = new Date('2026-12-26T12:00:00+09:00').getTime();

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');
  const ddayBadgeEl = document.getElementById('ddayBadge');
  const countdownTextEl = document.getElementById('countdownText');

  let prevValues = { days: '', hours: '', minutes: '', seconds: '' };

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (ddayBadgeEl) ddayBadgeEl.innerHTML = '💍 TODAY';
      if (countdownTextEl) {
        countdownTextEl.innerHTML = '<strong>드미트리 ♥ 로렐라이</strong>의 행복한 결혼식이 시작되었습니다!';
      }
      setNumber(daysEl, '00', 'days');
      setNumber(hoursEl, '00', 'hours');
      setNumber(minutesEl, '00', 'minutes');
      setNumber(secondsEl, '00', 'seconds');
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const sDays = String(d).padStart(2, '0');
    const sHours = String(h).padStart(2, '0');
    const sMinutes = String(m).padStart(2, '0');
    const sSeconds = String(s).padStart(2, '0');

    setNumber(daysEl, sDays, 'days');
    setNumber(hoursEl, sHours, 'hours');
    setNumber(minutesEl, sMinutes, 'minutes');
    setNumber(secondsEl, sSeconds, 'seconds');

    if (ddayBadgeEl) {
      ddayBadgeEl.innerHTML = `D-${d}`;
    }

    if (countdownTextEl) {
      countdownTextEl.innerHTML = `드미트리 ♥ 로렐라이의 결혼식이 <strong>${d}일 ${h}시간 ${m}분 ${s}초</strong> 남았습니다.`;
    }
  }

  function setNumber(el, val, key) {
    if (!el) return;
    if (prevValues[key] !== val) {
      el.textContent = val;
      el.classList.remove('flip');
      void el.offsetWidth; // 트리거 리플로우
      el.classList.add('flip');
      prevValues[key] = val;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. 2026년 12월 캘린더 생성
   ========================================================================== */
function initCalendar() {
  const tbody = document.getElementById('calendarBody');
  if (!tbody) return;

  // 2026년 12월 1일은 화요일(요일 인덱스 2: 0=일, 1=월, 2=화...)
  // 12월은 31일까지 있음.
  const firstDayIndex = 2; // 화요일
  const daysInMonth = 31;
  const weddingDay = 26;

  let html = '<tr>';
  let dayCounter = 1;

  // 첫째 주 빈칸
  for (let i = 0; i < firstDayIndex; i++) {
    html += '<td></td>';
  }

  // 첫째 주 날짜 채우기
  for (let i = firstDayIndex; i < 7; i++) {
    html += formatDayCell(dayCounter, weddingDay);
    dayCounter++;
  }
  html += '</tr>';

  // 둘째 주 이후
  while (dayCounter <= daysInMonth) {
    html += '<tr>';
    for (let i = 0; i < 7; i++) {
      if (dayCounter <= daysInMonth) {
        html += formatDayCell(dayCounter, weddingDay);
        dayCounter++;
      } else {
        html += '<td></td>';
      }
    }
    html += '</tr>';
  }

  tbody.innerHTML = html;
}

function formatDayCell(day, targetDay) {
  if (day === targetDay) {
    return `<td class="wedding-day"><div class="day-circle">${day}</div></td>`;
  }
  return `<td>${day}</td>`;
}

/* ==========================================================================
   3. 벚꽃/꽃잎 떨어지는 애니메이션 (Canvas)
   ========================================================================== */
function initPetalAnimation() {
  const canvas = document.getElementById('petalCanvas');
  const toggleBtn = document.getElementById('btnTogglePetal');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const maxPetals = 35;
  let isRunning = true;

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedX = Math.random() * 1.5 - 0.5;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      this.opacity = Math.random() * 0.45 + 0.35;
      this.color = Math.random() > 0.4 ? '#f7cfd8' : '#fae1dd';
    }

    update() {
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.6;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20 || this.x > width + 20 || this.x < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // 꽃잎 모양 타원
      ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxPetals; i++) {
    petals.push(new Petal());
  }

  function loop() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);
    for (const petal of petals) {
      petal.update();
      petal.draw();
    }
    requestAnimationFrame(loop);
  }

  loop();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isRunning = !isRunning;
      if (isRunning) {
        toggleBtn.style.opacity = '1';
        showToast('꽃잎 효과가 켜졌습니다');
        loop();
      } else {
        toggleBtn.style.opacity = '0.5';
        ctx.clearRect(0, 0, width, height);
        showToast('꽃잎 효과가 꺼졌습니다');
      }
    });
  }
}

/* ==========================================================================
   4. BGM 피아노 신디사이저 (Web Audio API 기반 무음악 자동재생 대응)
   ========================================================================== */
function initBgm() {
  const btnBgm = document.getElementById('btnToggleBgm');
  if (!btnBgm) return;

  let audioCtx = null;
  let isPlaying = false;
  let timerId = null;

  // 캐논 / 로맨틱 웨딩 선율 주파수 노트 목록
  const notes = [
    // D4, F#4, A4, D5, A3, C#4, E4, A4, B3, D4, F#4, B4, F#3, A3, C#4, F#4
    293.66, 369.99, 440.00, 587.33,
    220.00, 277.18, 329.63, 440.00,
    246.94, 293.66, 369.99, 493.88,
    185.00, 220.00, 277.18, 369.99,
    // G3, B3, D4, G4, D3, F#3, A3, D4, G3, B3, D4, G4, A3, C#4, E4, A4
    196.00, 246.94, 293.66, 392.00,
    146.83, 185.00, 220.00, 293.66,
    196.00, 246.94, 293.66, 392.00,
    220.00, 277.18, 329.63, 440.00
  ];

  let currentNoteIndex = 0;

  function playPianoTone(freq) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // 부드러운 사인파 + 삼각파 혼합 느낌
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // 피아노/오르골 특유의 어택 & 서서히 감쇠하는 엔벨로프
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  function startMusic() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    btnBgm.classList.add('playing');
    showToast('배경음악이 재생됩니다 🎵');

    function step() {
      if (!isPlaying) return;
      playPianoTone(notes[currentNoteIndex]);
      currentNoteIndex = (currentNoteIndex + 1) % notes.length;
      timerId = setTimeout(step, 450);
    }
    step();
  }

  function stopMusic() {
    isPlaying = false;
    btnBgm.classList.remove('playing');
    clearTimeout(timerId);
    showToast('배경음악이 정지되었습니다');
  }

  btnBgm.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

/* ==========================================================================
   5. 신랑/신부 연락하기 모달
   ========================================================================== */
function initContactModal() {
  const modal = document.getElementById('contactModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalCall = document.getElementById('modalBtnCall');
  const modalSms = document.getElementById('modalBtnSms');
  const modalCopy = document.getElementById('modalBtnCopy');

  const btnGroom = document.getElementById('btnContactGroom');
  const btnBride = document.getElementById('btnContactBride');

  // 연락처 기본 데이터 (실제 사용자 번호로 쉽게 연동 가능)
  const contacts = {
    groom: {
      title: '신랑 드미트리에게 연락하기',
      subtitle: '축하와 응원의 메시지를 전해보세요',
      phone: '010-2026-1226'
    },
    bride: {
      title: '신부 로렐라이에게 연락하기',
      subtitle: '축하와 응원의 메시지를 전해보세요',
      phone: '010-1226-2026'
    }
  };

  let currentTarget = null;

  function openModal(type) {
    const data = contacts[type];
    currentTarget = data;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;

    modalCall.href = `tel:${data.phone}`;
    modalSms.href = `sms:${data.phone}`;

    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  if (btnGroom) {
    btnGroom.addEventListener('click', () => openModal('groom'));
  }
  if (btnBride) {
    btnBride.addEventListener('click', () => openModal('bride'));
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (modalCopy) {
    modalCopy.addEventListener('click', () => {
      if (currentTarget) {
        copyToClipboard(currentTarget.phone, `${currentTarget.phone} 번호가 복사되었습니다`);
      }
    });
  }
}

/* ==========================================================================
   6. 마음 전하시는 곳 (계좌번호 아코디언 & 복사)
   ========================================================================== */
function initAccountAccordion() {
  const accCards = document.querySelectorAll('.acc-card');

  accCards.forEach((card) => {
    const header = card.querySelector('.acc-header');
    header.addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });

  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const accountNum = btn.getAttribute('data-account');
      const bankName = btn.getAttribute('data-bank');
      const holder = btn.getAttribute('data-holder');
      const fullText = `${bankName} ${accountNum} (예금주: ${holder})`;

      copyToClipboard(accountNum, `${bankName} ${accountNum} 계좌번호가 복사되었습니다!`);
    });
  });
}

/* ==========================================================================
   7. 갤러리 이미지 라이트박스 & 터치 스와이프
   ========================================================================== */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const counterEl = document.getElementById('lightboxCounter');

  if (!lightbox) return;

  const imageSrcs = Array.from(items).map((item) => {
    return item.querySelector('img').getAttribute('src');
  });

  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = imageSrcs.length - 1;
    if (index >= imageSrcs.length) index = 0;
    currentIndex = index;

    lightboxImg.src = imageSrcs[currentIndex];
    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${imageSrcs.length}`;
    }
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      showImage(index);
      lightbox.classList.add('active');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrapper')) {
      closeLightbox();
    }
  });

  // 모바일 터치 스와이프 제스처 지원
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        showImage(currentIndex - 1); // 오른쪽 스와이프 -> 이전
      } else {
        showImage(currentIndex + 1); // 왼쪽 스와이프 -> 다음
      }
    }
  }

  // 키보드 방향키 지원
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

/* ==========================================================================
   8. 방명록 (LocalStorage 기반 축하 메시지)
   ========================================================================== */
function initGuestbook() {
  const form = document.getElementById('guestbookForm');
  const nameInput = document.getElementById('guestName');
  const msgInput = document.getElementById('guestMessage');
  const listEl = document.getElementById('guestbookList');

  if (!form || !listEl) return;

  const STORAGE_KEY = 'kane_wedding_guestbook';

  const defaultMessages = [
    {
      name: '루크사트',
      message: '새로운 시작을 진심으로 축하한다! 항상 서로 아끼고 행복하길.',
      date: '2026.10.12'
    },
    {
      name: '페르시카',
      message: '둘이 함께 걷는 길이 언제나 꽃길이기를 진심으로 축복해요 ♥',
      date: '2026.10.13'
    }
  ];

  let messages = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    messages = saved ? JSON.parse(saved) : defaultMessages;
  } catch (e) {
    messages = defaultMessages;
  }

  function renderMessages() {
    listEl.innerHTML = messages
      .map(
        (item) => `
      <div class="guestbook-item">
        <div class="guestbook-meta">
          <span class="guestbook-author">${escapeHtml(item.name)}</span>
          <span class="guestbook-date">${escapeHtml(item.date)}</span>
        </div>
        <p class="guestbook-message">${escapeHtml(item.message)}</p>
      </div>
    `
      )
      .join('');
  }

  renderMessages();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();

    if (!name || !message) {
      showToast('이름과 축하 메시지를 모두 입력해주세요');
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    messages.unshift({ name, message, date: dateStr });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn(e);
    }

    renderMessages();
    nameInput.value = '';
    msgInput.value = '';
    showToast('따뜻한 축하 메시지가 등록되었습니다! ✨');
  });
}

/* ==========================================================================
   9. 공유하기 & 캘린더 등록
   ========================================================================== */
function initShareAndCalendar() {
  const btnShare = document.getElementById('btnShare');
  const btnCalendar = document.getElementById('btnCalendar');

  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const shareData = {
        title: '드미트리 ♥ 로렐라이 결혼식에 초대합니다',
        text: '2026년 12월 26일 (토) 오후 12시, 나나컨벤션센터 2층 플로렌스홀',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        copyToClipboard(window.location.href, '청첩장 링크가 복사되었습니다!');
      }
    });
  }

  if (btnCalendar) {
    btnCalendar.addEventListener('click', () => {
      // 구글 캘린더 등록 링크
      // 2026-12-26 12:00:00 KST = 2026-12-26 03:00:00 UTC
      // 2시간 소요: 2026-12-26 05:00:00 UTC
      const title = encodeURIComponent('드미트리 ♥ 로렐라이 결혼식');
      const details = encodeURIComponent('Always be with you\n나나컨벤션센터 2층 플로렌스홀\n소중한 걸음으로 축복해 주시기 바랍니다.');
      const location = encodeURIComponent('나나컨벤션센터 2층 플로렌스홀');
      const dates = '20261226T030000Z/20261226T050000Z';

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank');
      showToast('구글 캘린더 등록 페이지로 이동합니다');
    });
  }
}

/* ==========================================================================
   10. 스크롤 인터랙션 및 유틸리티
   ========================================================================== */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in-section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(successMsg);
      })
      .catch(() => {
        fallbackCopy(text, successMsg);
      });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('복사에 실패했습니다');
  }
  document.body.removeChild(ta);
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2300);
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, (s) => entityMap[s]);
}

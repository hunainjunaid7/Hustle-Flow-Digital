      function scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                document.getElementById('mobileNav').classList.remove('active');
            }
        }

        function toggleMenu() {
            const mobileNav = document.getElementById('mobileNav');
            mobileNav.classList.toggle('active');
        }

        function toggleFaq(element) {
            element.classList.toggle('active');
        }

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
            animatedElements.forEach(el => observer.observe(el));
        });

        // Contact Form Handler
        async function handleSubmit(event) {
            event.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const formStatus = document.getElementById('formStatus');
            const form = event.target;
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !message) {
                formStatus.innerHTML = '<p class="form-error">Please fill in all required fields.</p>';
                return;
            }
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.innerHTML = '';
            
            try {
                // Using EmailJS to send email
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    phone: phone || 'Not provided',
                    service: service || 'Not specified',
                    message: message,
                    to_email: 'info.hustleflowdigital@gmail.com'
                };
                
                // Send email using EmailJS
                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS credentials
                const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
                
                if (response.status === 200) {
                    formStatus.innerHTML = '<p class="form-success">✓ Message sent successfully! We\'ll get back to you within 24 hours.</p>';
                    form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                formStatus.innerHTML = '<p class="form-error">Failed to send message. Please try emailing us directly at info.hustleflowdigital@gmail.com</p>';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }
        (function(){
  const videoId = '0x5mf8BUJZY';
  const startAt = 5;
  const endAt = 13;

  // Load YT IFrame API
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  // Create player when API ready
  let player;
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        modestbranding: 1,
        start: startAt,
        // don't set 'end' here — we'll manage loop precisely in code
        loop: 1,
        playsinline: 1,
        fs: 0
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function onPlayerReady(event) {
    try {
      event.target.mute();                      // must be muted for autoplay on mobile
      event.target.playVideo();
    } catch(e) { /* ignore */ }

    // ensure sizing right away
    resizePlayerFrame();
  }

  function onPlayerStateChange(e) {
    // When video starts playing, start an interval to check time and loop precisely at endAt
    if (e.data === YT.PlayerState.PLAYING) {
      // start monitoring
      if (window.__ytLoopInterval) clearInterval(window.__ytLoopInterval);
      window.__ytLoopInterval = setInterval(() => {
        try {
          const t = player.getCurrentTime();
          if (t >= endAt - 0.15) { // small tolerance
            player.seekTo(startAt, true);
          }
        } catch(err) {}
      }, 150);
    } else {
      // clear monitor when paused or ended
      if (window.__ytLoopInterval) {
        clearInterval(window.__ytLoopInterval);
        window.__ytLoopInterval = null;
      }
      // if ended state appears, force seek
      if (e.data === YT.PlayerState.ENDED) {
        try { player.seekTo(startAt, true); player.playVideo(); } catch(e){}
      }
    }
  }

  // RESPONSIVE resize logic: make iframe cover full viewport (no black bars)
  function resizePlayerFrame() {
    const wrapper = document.querySelector('.video-background');
    const iframe = wrapper.querySelector('iframe') || document.getElementById('yt-player');
    if (!iframe) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const windowRatio = vw / vh;

    // assume video ratio 16:9
    const videoRatio = 16/9;

    let newWidth, newHeight;
    if (windowRatio < videoRatio) {
      // viewport narrower than video -> expand width based on height
      newHeight = vh;
      newWidth = vh * videoRatio;
    } else {
      // viewport wider than video -> expand height based on width
      newWidth = vw;
      newHeight = vw / videoRatio;
    }

    // apply sizes (use px to be precise)
    iframe.style.width = Math.ceil(newWidth) + 'px';
    iframe.style.height = Math.ceil(newHeight) + 'px';
    iframe.style.top = '50%';
    iframe.style.left = '50%';
    iframe.style.transform = 'translate(-50%, -50%)';
  }

  // run on load + resize + orientation change
  window.addEventListener('resize', resizePlayerFrame);
  window.addEventListener('orientationchange', () => { setTimeout(resizePlayerFrame, 200); });

  // call periodically early to ensure accurate layout once iframe inserted
  const bootResizeAttempts = setInterval(() => {
    resizePlayerFrame();
  }, 200);
  setTimeout(() => { clearInterval(bootResizeAttempts); resizePlayerFrame(); }, 3000);

  // Optional: pause video when user scrolls down away from hero to save CPU/battery
  let lastScrollY = window.scrollY;
  const hero = document.getElementById('hero');
  if (hero) {
    const heroBottom = () => hero.getBoundingClientRect().bottom;
    window.addEventListener('scroll', () => {
      if (!player || !player.getPlayerState) return;
      const bottom = heroBottom();
      // if hero is mostly out of view, pause
      if (bottom < window.innerHeight * 0.2) {
        if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
      } else {
        // resume if visible and player is paused
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
          try { player.playVideo(); } catch(e){}
        }
      }
    }, { passive: true });
  }
})();
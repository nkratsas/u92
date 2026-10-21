---
title: Home
topper:
  _bookshop_name: design-system/topper/hero
  label:
  background_image: https://ccdam.wvu.edu/wvu-u92/on-air-edit-1762x594.jpg
  alt_text: Radio Station door
  heading: Music. News. Sports. A Little Mayhem.
  subheading: Student-powered college radio at WVU since 1982 — live, imperfect, and human.
  markdown:
  ctas:
    - text: Get Involved
      icon:
      url: /about-us/work-for-u92/
    - text: Full Schedule
      icon:
      url: /schedule/
    - text: Donate
      icon:
      url: https://give.wvu.edu/campaign/wwvu-fm-u92-radio/c431270
  postscript:
    markdown: ''
    ctas: []
  settings:
    styles:
      audience: prospective_students
      tone: loud
      color_palette: option-1
      enable_blend: false
      tint_opacity: '0.7'
      heading_size: display-5
    layout:
      buffer:
      text_placement: me-auto text-start
      background_position: object-position-top
    config:
      name: hero
      edit_mode_only: false
content_blocks:
  - _bookshop_name: html
    code: >-
      <!-- dead air -->

      <section id="dead-air-1" aria-label="About U92" class="antenna">
        <div class="container wvu-z-index-content">
        <div class="row align-items-center py-4 d-flex align-items-center" style="min-height: 200px;">
          <div class="col-md-12 col-sm-24 deadair">

            <div class="neobox">
              <h2>Without you, it's just dead air...</h2>
              <p>
            Since 1982, U92 The Moose, WWVU-FM is the source of new music and broadcaster development at West Virginia University.</p>

            <a class="btn u92-btn mb-1" href="/about-us">About Us</a>
            </div>

          </div>

          <div class="col-md-12 col-sm-24">
           

            <video width="100%" id="U92 Logos"  loop muted playsinline controls poster="https://thedaonline.com/app/images/U92/boltimage.png">
        <source src="https://thedaonline.com/app/images/U92/u92logomix.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
           

         

            
          </div>
        </div>
        </div>
      </section>
    settings:
      config:
        edit_mode_only: false
    is_dynamic: false
    is_nested: false
    use_common_wrapper: false
  - _bookshop_name: design-system/section/sitewide-section
    sitewide_section: 6170e793-dff9-40b9-899a-2e3e734c828d
    is_sitewide: true
  - _bookshop_name: design-system/section/sitewide-section
    sitewide_section: 9f07ab94-0285-4f26-a08e-6c17b62b2d8b
    is_sitewide: true
  - _bookshop_name: design-system/section/article-collection
    heading: Latest on the Moose
    subheading:
    aria_label:
    tags:
      - homepage
    settings:
      styles:
        audience: prospective_students
        tone: loud
        color_palette: option-6
        bg_subtle: true
      layout:
        buffer:
        margin:
        padding: py-6 py-xxl-7
        max_cols:
      config:
        name: article-collection
        edit_mode_only: false
        include_heading_postscript: true
        limit: 4
        show_content: false
        hide_thumbnails: false
    is_dynamic: true
    is_nested: false
    use_common_wrapper: true
  - _bookshop_name: html
    code: >
      <!-- Upcoming Shows -->

      <style>
        .moose-main-wrapper { padding-top: 50px; width: 90%; max-width: 1275px; padding-left: 5px; padding-right: 5px; padding-bottom: 50px; }
        .moose-full-card { background-image: url('https://ccdam.wvu.edu/wvu-u92/sticker door.png'); background-size: cover; background-position: center; background-repeat: no-repeat; }
        .moose-24hr-card { border: 4px solid #002855; overflow: hidden; background: white; margin-bottom: 30px; }
        .moose-header { background: #002855; color: white; padding: 15px; font-size: 1.2rem; text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
        .moose-row { display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #eee; gap: 20px; transition: background-color 0.2s ease; }
        .moose-live { border-left: 6px solid #eaaa00; background-color: #fffdf5; }
        .moose-logo { width: 60px; height: 60px; border-radius: 6px; object-fit: cover; background: #f0f0f0; border: 1px solid #eee; flex-shrink: 0; }
        .moose-live .moose-logo { width: 85px; height: 85px; border: 2px solid #eaaa00; }
        .moose-time-box { min-width: 100px; text-align: right; line-height: 1.2; }
        .moose-day-label { display: block; font-size: 0.75rem; color: #bf0d3e; font-weight: 800; text-transform: uppercase; margin-bottom: 2px; }
        .moose-time { font-weight: 800; color: #111; font-size: 1rem; }
        .moose-title { font-weight: 800; color: #002855; flex-grow: 1; font-size: 1.2rem; }

        /* Schedule Button Styling */
        .btn-full-schedule {
          background: #002855;
          border: none;
          font-weight: bold;
          border-radius: 50px;
          padding: 10px 30px;
          text-decoration: none;
          color: white;
          display: inline-block;
        }

        /* KEYBOARD FOCUS ACCESSIBILITY STYLING */
        .moose-row:focus-visible {
          outline: 3px solid #002855;
          outline-offset: -3px;
          background-color: #e6f0fa;
        }

        .btn-full-schedule:focus-visible {
          outline: 3px solid #002855;
          outline-offset: 3px;
        }
      </style>


      <section id="upcoming-shows" aria-label="Upcoming Show Schedule"
      class="antenna">
        <div class="moose-full-card">
          <div class="container-fluid moose-main-wrapper">

            <div class="moose-24hr-card">
              <h2 class="moose-header">Upcoming Show Schedule</h2>
              <div id="moose-24hr-target" role="list" aria-label="Upcoming show list">
              </div>    
            </div>
             
            <div style="text-align:center;">
              <a href="/schedule" target="_blank" class="btn btn-primary btn-full-schedule">See the Full Schedule</a>
            </div>

          </div>
        </div>
      </section>


      <script>

      (function() {
        const stationId = "7934";
        const defaultLogo = "https://ccdam.wvu.edu/wvu-u92/cds.jpg?w=400&h=400&c=true";

        async function updatePage() {
          try {
            const response = await fetch(`https://api.broadcast.radio/api/nowplaying/${stationId}?scheduleLength=true`);
            const data = await response.json();
            if (!data.success) return;

            const body = data.body;
            const now = new Date();
            const cutoff = new Date(now.getTime() + (6 * 60 * 60 * 1000));

            // 1. Schedule Rendering
            const scheduleItems = body.schedule.filter(i => {
              const start = new Date(i.start_tza_string.replace('Z', ''));
              return i.current || (start >= now && start < cutoff);
            }).sort((a,b) => new Date(a.start_tza_string.replace('Z', '')) - new Date(b.start_tza_string.replace('Z', '')));

            const scheduleTarget = document.getElementById('moose-24hr-target');
            if (scheduleTarget) {
              scheduleTarget.innerHTML = scheduleItems.map(i => {
                const start = new Date(i.start_tza_string.replace('Z', ''));
                const time = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                const dayLabel = start.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                const show = i.content.find(c => c.contentType.slug === "show") || { display_title: "U92 Program" };
                const imgObj = i.content.find(c => c.contentType.slug === "featuredImage");
                let url = defaultLogo;
                if (imgObj && imgObj.body) url = `https://brusercontent.broadcast.radio/api/image/${imgObj.body.split(':')[1]}.png?w=150&h=150&c=true`;

                const showAlt = show.display_title ? `${show.display_title} logo` : 'Show logo';
                const ariaLabel = `${i.current ? 'Currently playing live: ' : ''}${show.display_title}, ${i.current ? 'NOW' : dayLabel} at ${time}`;

                return `
                  <div class="moose-row ${i.current ? 'moose-live' : ''}" tabindex="0" role="listitem" aria-label="${ariaLabel}">
                    <img src="${url}" alt="${showAlt}" class="moose-logo" onerror="this.src='${defaultLogo}'">
                    <div class="moose-time-box">
                      <span class="moose-day-label">${i.current ? 'NOW' : dayLabel}</span>
                      <span class="moose-time">${time}</span>
                    </div>
                    <span class="moose-title">${show.display_title}</span>
                    ${i.current ? '<span style="color:#bf0d3e; font-weight:900; font-size:0.8rem; margin-right:10px;">● LIVE</span>' : ''}
                  </div>`;
              }).join('');
            }

          } catch (e) { console.error("Update Error:", e); }
        }

        updatePage();
        setInterval(updatePage, 30000);
      })();

      </script>
    settings:
      config:
        edit_mode_only: false
    is_dynamic: false
    is_nested: false
    use_common_wrapper: false
  - _bookshop_name: design-system/section/cards
    heading: More from the Moose
    subheading:
    aria_label:
    items:
      - title: Meet Zeus the Moose
        image: https://ccdam.wvu.edu/wvu-u92/moose.png
        alt_text: 'Moose '
        text: Zeus is U92's moose mascot, but do you really know his story? Learn more
          here.
        ctas:
          - text: Meet Zeus
            icon: arrow-right
            url: /about-us/meet-zeus/
      - title: Join U92
        image: https://ccdam.wvu.edu/wvu-u92/Screenshot+2026-01-12+at+2.55.49%E2%80%AFPM.png
        alt_text: U92 Staff
        text: We're always looking for new DJ's, sports broadcasters, newscasters,
          podcasters and more to keep your college radio independent.
        ctas:
          - text: Apply Here
            icon: arrow-right
            url: /about-us/work-for-u92/
      - title: Check Out Our Podcasts
        image: https://ccdam.wvu.edu/wvu-u92/Screenshot 2025-02-14 at 9.27.30 AM.png
        alt_text: Podcast Image
        text: U92 produces high quality podcasts, including sports, news, current
          events, and much more.
        ctas:
          - text: Listen Here
            icon: arrow-right
            url: https://u92.transistor.fm/
    postscript:
      copy:
    settings:
      styles:
        audience: prospective_students
        tone: loud
        color_palette: option-6
        bg_subtle:
      layout:
        buffer:
        margin:
        padding: py-6 py-xxl-7
      config:
        name: cards
        edit_mode_only: false
        include_heading_postscript: true
    is_dynamic: false
    is_nested: false
    use_common_wrapper: true
  - _bookshop_name: design-system/section/sitewide-section
    sitewide_section: 81e66627-f849-4188-ad6b-bc0b72ee256b
    is_sitewide: true
  - _bookshop_name: design-system/section/sitewide-section
    sitewide_section: 1df404ba-98e5-4a1c-ab30-ceff62f170e6
    is_sitewide: true
  - _bookshop_name: design-system/section/sitewide-section
    sitewide_section: 59223c90-c057-4188-83c7-7f57a6dcd8ac
    is_sitewide: true
  - _bookshop_name: design-system/section/html
    code: >-
      <!-- <video 
        id="hover-video" 
        width="640" 
        height="360" 
        muted 
        playsinline 
        poster="https://thedaonline.com/app/images/U92/boltimage.png"
        onmouseover="this.play()" 
        onmouseout="this.pause(); this.currentTime = 0;">
        
        <source src="https://thedaonline.com/app/images/U92/u92logomix.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video> -->
    is_dynamic: false
    is_nested: false
    use_common_wrapper: false
properties:
  exclude_from_search_engines: false
  include_in_search_results: true
  meta_description: U92 The Moose is a 24/7, student-powered radio station at West
    Virginia University. Since 1982, we’ve filled the airwaves with new and
    alternative music, news, sports, talk, and specialty programming — all
    created live by students. We’re a creative outlet, a training ground, and a
    reflection of campus life, built on real voices, real people, and a little
    mayhem — because without you, it’s just dead air.
  social_image: https://ccdam.wvu.edu/wvu-u92/on-air-edit-1762x594.jpg
uuid:
type: guide
---

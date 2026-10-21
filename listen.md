---
_schema: guide_page
title: Listen
draft:
horizontal_subnav:
topper:
  _bookshop_name: design-system/topper/hero
  label:
  background_image: https://ccdam.wvu.edu/wvu-u92/unrecognizable-girl-putting-cassette-into-boombox-2026-01-07-23-58-20-utc.png
  alt_text: boom box
  heading: LISTEN
  subheading:
  markdown:
  ctas: []
  postscript: {}
  settings:
    styles:
      audience: prospective_students
      tone: loud
      color_palette: option-7
      enable_blend: false
      tint_opacity: '0.7'
      heading_size: display-2
    layout:
      text_placement: me-auto text-start
      background_position: object-position-center
    config:
      name: topper-hero
      edit_mode_only: false
content_blocks:
  - _bookshop_name: design-system/section/sitewide-section
    sitewide_section: 6170e793-dff9-40b9-899a-2e3e734c828d
    is_sitewide: true
  - _bookshop_name: html
    code: >-
      <!-- Player -->

      <section style="background-color: #111;" aria-labelledby="player-label">
        <div class="container">
      <div style="width: 100%; padding: 0; margin: 0; background-color: #111;"
      align="center">
        <h2 id="player-label" class="visually-hidden">Now Playing on U92 the Moose</h2>
        <iframe src="https://player.broadcast.radio/wvu?mode=embed&autoplay=1" style="width:100%; max-height:100px; max-width:800px; border:none;" title="Stream Player"></iframe>
      </div></div>

      </section>
    settings:
      config:
        edit_mode_only: false
    is_dynamic: false
    is_nested: false
    use_common_wrapper: false
  - _bookshop_name: design-system/section/columns-2-1
    heading:
    subheading:
    aria_label: 'Player '
    column_a:
      _bookshop_name: player-fluid
      title: Listen Live
      settings:
        layout:
          height: 600
        config:
          name: player-fluid
          edit_mode_only: false
          include_heading_postscript: false
          show_content: false
      is_dynamic: false
      is_nested: false
      use_common_wrapper: true
    column_aa:
      _bookshop_name: design-system/column_sm/cards-simple-vertical
      heading:
      items:
        - title: Request Line
          text: '* **304-293-3692**'
          url: tel:3042934141
        - title: On the Radio
          text: '* **91\.7FM WWVU**'
          url: https://radio-locator.com/info/WWVU-FM
        - title: Listen Online
          text: >-
            * **U92 Live Stream**

            * <a href="https://tunein.com/radio/U92-the-Moose-917-s23884/"
            title="TuneIn" target="_blank"
            rel="noopener"><strong>TuneIn</strong></a>
          url: https://tunein.com/radio/U92-the-Moose-917-s23884/
        - title: Watch on Twitch
          text: '* <a href="https://www.twitch.tv/u92fm" title="Twitch Stream"
            target="_blank" rel="noopener"><strong>Twitch
            Livestream</strong></a>'
          url: https://www.twitch.tv/u92fm
      is_dynamic: false
    settings:
      styles:
        audience: prospective_students
        tone: lets-go
        color_palette: option-5
        bg_subtle: true
      layout:
        buffer:
        margin:
        padding: py-6 py-xxl-7
      config:
        name: columns-2-1
        edit_mode_only: false
        include_heading_postscript: false
    is_dynamic: false
    is_nested: true
    use_common_wrapper: true
  - _bookshop_name: design-system/section/sitewide-section
    sitewide_section: 1df404ba-98e5-4a1c-ab30-ceff62f170e6
    is_sitewide: true
  - _bookshop_name: design-system/section/sitewide-section
    sitewide_section: 59223c90-c057-4188-83c7-7f57a6dcd8ac
    is_sitewide: true
properties:
  exclude_from_search_engines: false
  include_in_search_results: true
  meta_description: 'Listen to U92 LIVE online! Learn all the ways you can hear the Moose. '
  social_image: https://ccdam.wvu.edu/wvu-u92/cds.jpg
uuid: 8ab36824-3af6-445b-98ce-ad072b6a652a
type: guide
---

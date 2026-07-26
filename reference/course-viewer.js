// ============================================
// COURSE VIEWER (smooth navigation + MathJax CDN)
// ============================================

document.addEventListener('DOMContentLoaded', function(){
    if(typeof COURSE_MAP === 'undefined') return;

    var sidebar = document.getElementById('sidebarList');
    var viewer = document.getElementById('lessonView');
    var sidebarEl = document.querySelector('.sidebar');
    var toggle = document.getElementById('sidebarToggle');
    var cache = {};

    // ---- Session unlock tracking ----
    function isUnlocked(modIndex){
        return sessionStorage.getItem('mod_unlocked_' + modIndex) === '1';
    }
    function setUnlocked(modIndex){
        sessionStorage.setItem('mod_unlocked_' + modIndex, '1');
    }

    // ---- Build lookup ----
    var lessonLookup = {};
    var counter = 0;

    COURSE_MAP.forEach(function(mod, modIndex){
        var locked = mod.locked || false;
        mod.lessons.forEach(function(lesson){
            counter++;
            lessonLookup[lesson.id] = {
                lesson: lesson,
                module: mod.module,
                modIndex: modIndex,
                num: lesson.num !== undefined ? lesson.num : String(counter).padStart(2,'0'),
                locked: locked
            };
        });
    });

    // ---- Module collapse tracking (all collapsed by default) ----
    var modCollapsed = {};
    COURSE_MAP.forEach(function(_, i){ modCollapsed[i] = true; });

    // ---- Build sidebar ----
    function renderSidebar(activeId){
        var html = '';
        var num = 0;

        COURSE_MAP.forEach(function(mod, modIndex){
            var locked = mod.locked && !isUnlocked(modIndex);
            var lockIcon = locked ? ' <span class="lock-icon">&#128274;</span>' : '';

            // Phase divider — injected before the module if it carries a phase label
            if(mod.phase){
                var colorAttr = mod.phaseColor ? ' data-phase-color="' + mod.phaseColor + '"' : '';
                html += '<li class="phase-divider" aria-hidden="true"' + colorAttr + '>'
                      + '<span class="phase-label">' + mod.phase + '</span>'
                      + '</li>';
            }

            // Check if this module contains the active lesson — auto-expand if so
            var containsActive = mod.lessons.some(function(l){ return l.id === activeId; });
            if(containsActive) modCollapsed[modIndex] = false;

            var isCollapsed = modCollapsed[modIndex] === true;
            var collapsedClass = isCollapsed ? ' collapsed' : '';

            html += '<li class="mod-heading' + collapsedClass + '" data-mod-index="' + modIndex + '">'
                  + '<span class="mod-arrow">&#9660;</span>'
                  + '<span class="mod-label">' + mod.module + lockIcon + '</span>'
                  + '</li>';

            html += '<li class="mod-lessons' + collapsedClass + '" data-mod-group="' + modIndex + '">';

            mod.lessons.forEach(function(lesson){
                num++;
                var label = lesson.num !== undefined ? lesson.num : String(num).padStart(2,'0');
                var lockedClass = locked ? ' locked' : '';
                var activeClass = (lesson.id === activeId) ? ' active' : '';

                html += '<a href="#' + lesson.id + '" data-id="' + lesson.id + '" data-file="' + (lesson.file || '') + '" class="' + lockedClass + activeClass + '">'
                    + '<span class="lesson-num">' + label + '</span>'
                    + '<span class="lesson-title-text">' + lesson.title + '</span>'
                    + (locked ? '<span class="lock-badge">&#128274;</span>' : '')
                    + '</a>';
            });

            html += '</li>';
        });

        sidebar.innerHTML = html;

        // Wire module heading click for collapse/expand
        sidebar.querySelectorAll('.mod-heading[data-mod-index]').forEach(function(heading){
            heading.addEventListener('click', function(){
                var idx = heading.getAttribute('data-mod-index');
                var group = sidebar.querySelector('.mod-lessons[data-mod-group="' + idx + '"]');
                var collapsed = heading.classList.toggle('collapsed');
                if(group) group.classList.toggle('collapsed', collapsed);
                modCollapsed[idx] = collapsed;
            });
        });
    }

    // ---- Find first unlocked lesson ----
    function getFirstAccessibleId(){
        for(var i = 0; i < COURSE_MAP.length; i++){
            var mod = COURSE_MAP[i];
            var locked = mod.locked && !isUnlocked(i);
            if(!locked && mod.lessons.length > 0){
                return mod.lessons[0].id;
            }
        }
        if(COURSE_MAP[0] && COURSE_MAP[0].lessons[0]) return COURSE_MAP[0].lessons[0].id;
        return null;
    }

    // ---- Build lesson header HTML ----
    function buildHeader(id){
        var info = lessonLookup[id];
        var creator = info.lesson.creator == null ? "" : 'Created by: ' + info.lesson.creator + '&nbsp;&nbsp;·&nbsp;&nbsp;';
        var date = info.lesson.date == null? "" : 'Last Edited on: ' + info.lesson.date + '&nbsp;&nbsp;·&nbsp;&nbsp;';
        var desc = info.lesson.desc == null? "" : info.lesson.desc;

        if(!info) return '';
        return '<div class="tag">' + info.module + '</div>'
             + '<h1>' + info.lesson.title + '</h1>'
             + '<div class="meta">' + creator + date + desc + '</div>';
    }

    // ---- MathJax typeset ----
    // MathJax CDN loads async, so it may not be ready yet.
    // MathJax.startup.promise resolves when MathJax is fully loaded.
    function typesetViewer(){
        if(!window.MathJax) return;

        function doTypeset(){
            // Clear previous typeset state for the viewer element
            if(MathJax.startup && MathJax.startup.document){
                MathJax.startup.document.clear();
                MathJax.startup.document.updateDocument();
            }
            return MathJax.typesetPromise([viewer]);
        }

        // If MathJax is still loading, wait for it
        if(MathJax.startup && MathJax.startup.promise){
            MathJax.startup.promise.then(doTypeset).catch(function(err){
                console.warn('MathJax error:', err);
            });
        } else if(MathJax.typesetPromise){
            doTypeset().catch(function(err){
                console.warn('MathJax error:', err);
            });
        }
    }

    // ---- Highlight.js syntax highlighting ----
    // Runs after lesson HTML is injected into the viewer.
    function highlightCode(){
        if(!window.hljs) return;
        viewer.querySelectorAll('pre code[class*="language-"]').forEach(function(block){
            // Reset any previous highlighting so re-highlight works
            block.removeAttribute('data-highlighted');
            hljs.highlightElement(block);
        });
    }

    // ---- Copy-to-clipboard for terminal code blocks ----
    // Finds every .code-block inside the viewer, injects a Copy
    // button into the .code-header-right (creates it if missing),
    // and wires the click handler. Runs after each lesson load.
    function initCopyButtons(){
        viewer.querySelectorAll('.code-block').forEach(function(block){
            // Skip if already wired
            if(block.querySelector('.copy-btn')) return;

            var header = block.querySelector('.code-header');
            if(!header) return;

            // Ensure .code-header-right wrapper exists
            var right = header.querySelector('.code-header-right');
            if(!right){
                var lang = header.querySelector('.code-lang');
                right = document.createElement('div');
                right.className = 'code-header-right';
                if(lang){
                    header.removeChild(lang);
                    right.appendChild(lang);
                }
                header.appendChild(right);
            }

            // Create button
            var btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.textContent = 'Copy';
            right.appendChild(btn);

            btn.addEventListener('click', function(){
                var code = block.querySelector('pre code');
                if(!code) return;
                var text = code.textContent;

                navigator.clipboard.writeText(text).then(function(){
                    btn.textContent = 'Copied';
                    btn.classList.add('copied');
                    setTimeout(function(){
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                }).catch(function(){
                    // Fallback for older browsers / non-HTTPS
                    var ta = document.createElement('textarea');
                    ta.value = text;
                    ta.style.position = 'fixed';
                    ta.style.opacity = '0';
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    btn.textContent = 'Copied';
                    btn.classList.add('copied');
                    setTimeout(function(){
                        btn.textContent = 'Copy';
                        btn.classList.remove('copied');
                    }, 2000);
                });
            });
        });
    }

    // ---- Collapsible sections ----
    function initCollapsibleSections(){
        viewer.querySelectorAll('.section-block').forEach(function(block){
            if(block.dataset.wired) return;
            block.dataset.wired = '1';

            var label = block.querySelector('.section-label');
            if(!label) return;

            // Strip any inline onclick to avoid double-firing
            label.removeAttribute('onclick');

            label.addEventListener('click', function(){
                block.classList.toggle('open');
                syncExpandAllBtn();
            });
        });
        syncExpandAllBtn();
    }

    // ---- Expand / Collapse All ----
    var expandAllBtn = document.getElementById('expandAllBtn');

    function syncExpandAllBtn(){
        if(!expandAllBtn) return;
        var blocks = viewer.querySelectorAll('.section-block');
        if(!blocks.length){
            expandAllBtn.style.display = 'none';
            return;
        }
        expandAllBtn.style.display = '';
        var allOpen = Array.from(blocks).every(function(b){ return b.classList.contains('open'); });
        expandAllBtn.classList.toggle('all-open', allOpen);
        expandAllBtn.textContent = allOpen ? '[ collapse all ]' : '[ expand all ]';
    }

    if(expandAllBtn){
        expandAllBtn.addEventListener('click', function(){
            var blocks = viewer.querySelectorAll('.section-block');
            var allOpen = Array.from(blocks).every(function(b){ return b.classList.contains('open'); });
            blocks.forEach(function(b){ b.classList.toggle('open', !allOpen); });
            syncExpandAllBtn();
        });
    }

    // ---- Submission checklist ----
    function initChecklist(){
        viewer.querySelectorAll('.checklist-card').forEach(function(card){
            if(card.dataset.wired) return;
            card.dataset.wired = '1';

            var fill  = card.querySelector('.progress-bar-fill');
            var label = card.querySelector('.progress-label');

            function updateProgress(){
                var items   = card.querySelectorAll('.checklist-item');
                var checked = card.querySelectorAll('.checklist-item.checked').length;
                var total   = items.length;
                if(fill)  fill.style.width = (total ? Math.round((checked / total) * 100) : 0) + '%';
                if(label) label.textContent = checked + ' / ' + total + ' completed';
            }

            card.querySelectorAll('.checklist-item').forEach(function(item){
                item.addEventListener('click', function(){
                    item.classList.toggle('checked');
                    updateProgress();
                });
            });

            updateProgress();
        });
    }

    // ---- Show password prompt ----
    function showLockScreen(id){
        var info = lessonLookup[id];
        if(!info) return;

        viewer.innerHTML = ''
            + '<div class="lock-screen">'
            +   '<div class="lock-screen-icon">&#128274;</div>'
            +   '<h2>Module Locked</h2>'
            +   '<p class="lock-screen-module">' + info.module + '</p>'
            +   '<p>This module is password-protected. Enter the password provided by your instructor to access the lessons.</p>'
            +   '<div class="lock-screen-form">'
            +     '<input type="password" id="lockPassword" class="lock-input" placeholder="Enter password" autocomplete="off" />'
            +     '<button id="lockSubmit" class="lock-submit">Unlock</button>'
            +   '</div>'
            +   '<p id="lockError" class="lock-error"></p>'
            + '</div>';

        var input = document.getElementById('lockPassword');
        var btn = document.getElementById('lockSubmit');
        var err = document.getElementById('lockError');

        function tryUnlock(){
            var pw = input.value.trim();
            if(pw === info.locked){
                setUnlocked(info.modIndex);
                loadLesson(id);
            } else {
                err.textContent = 'Incorrect password. Please try again.';
                input.value = '';
                input.focus();
                input.classList.add('shake');
                setTimeout(function(){ input.classList.remove('shake'); }, 500);
            }
        }

        btn.addEventListener('click', tryUnlock);
        input.addEventListener('keydown', function(e){
            if(e.key === 'Enter') tryUnlock();
        });

        setTimeout(function(){ input.focus(); }, 100);
    }

    // ---- Load a lesson ----
    function loadLesson(id){
        if(!id || !lessonLookup[id]) return;

        var info = lessonLookup[id];

        // Update sidebar
        renderSidebar(id);

        // Update hash
        history.replaceState(null, '', '#' + id);

        // Close mobile sidebar
        if(sidebarEl) sidebarEl.classList.remove('open');

        // Check if module is locked
        if(info.locked && !isUnlocked(info.modIndex)){
            showLockScreen(id);
            return;
        }

        // Handle redirect lessons (no local file — opens external URL in new tab)
        if(info.lesson.redirect){
            window.open(info.lesson.redirect, '_blank');
            viewer.innerHTML = buildHeader(id)
                + '<div class="callout tip" style="margin-top:32px">'
                + '<strong>Opened in New Tab</strong>'
                + '<p>Your instructor\'s website has been opened in a new tab.</p>'
                + '<p><a href="' + info.lesson.redirect + '" target="_blank" rel="noopener">'
                + info.lesson.redirect + '</a></p>'
                + '</div>';
            window.scrollTo({top:0});
            return;
        }

        var file = info.lesson.file;
        var header = buildHeader(id);

        // Check cache
        if(cache[file]){
            viewer.innerHTML = header + cache[file];
            window.scrollTo({top:0});
            typesetViewer();
            highlightCode();
            initCopyButtons();
            initCollapsibleSections();
            initChecklist();
            return;
        }

        // Fetch
        viewer.innerHTML = '<p class="loading">Loading lesson&hellip;</p>';

        fetch(file)
            .then(function(res){
                if(!res.ok) throw new Error(res.status);
                return res.text();
            })
            .then(function(html){
                cache[file] = html;
                viewer.innerHTML = header + html;
                window.scrollTo({top:0});
                typesetViewer();
                highlightCode();
                initCopyButtons();
                initCollapsibleSections();
                initChecklist();
            })
            .catch(function(err){
                viewer.innerHTML = '<p class="error">Could not load lesson. (' + err.message + ')</p>';
            });
    }

    // ---- Sidebar click handler ----
    sidebar.addEventListener('click', function(e){
        var link = e.target.closest('a[data-id]');
        if(!link) return;
        e.preventDefault();
        loadLesson(link.dataset.id);
    });

    // ---- Mobile sidebar toggle ----
    if(toggle && sidebarEl){
        toggle.addEventListener('click', function(){ sidebarEl.classList.toggle('open'); });
    }

    // ---- Desktop sidebar collapse ----
    var collapseBtn = document.getElementById('collapseToggle');
    var layout = document.querySelector('.course-layout');

    if(collapseBtn && layout){
        if(sessionStorage.getItem('sidebar_collapsed') === '1'){
            layout.classList.add('collapsed');
        }

        collapseBtn.addEventListener('click', function(){
            layout.classList.toggle('collapsed');
            sessionStorage.setItem('sidebar_collapsed', layout.classList.contains('collapsed') ? '1' : '0');
        });
    }

    // ---- Embed mode detection ----
    // Activate via ?embed=1 query param or when loaded inside an iframe
    var params = new URLSearchParams(window.location.search);
    var isEmbed = params.get('embed') === '1';
    if(!isEmbed){
        try { isEmbed = window.self !== window.top; } catch(e){ isEmbed = true; }
    }
    if(isEmbed){
        document.body.classList.add('embed-mode');
    }

    // ---- Init ----
    var hash = window.location.hash.replace('#','');
    loadLesson(hash || getFirstAccessibleId());
});
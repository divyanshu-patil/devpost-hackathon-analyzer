(() => {
  // Evidence distilled from the 145 hackathons / 707 winners in this report, embedded so the prompts work standalone.
  const PATTERNS = `WINNER PATTERNS (from 707 top-placed winners of the 145 largest Devpost hackathons, 2025–2026)
1. Generic criteria (creativity, technical, impact, design, presentation) appear in 94–121 of 145 rubrics, so they are table stakes. The deciding line is the hackathon-specific one: "xStocks Relevance 30%", "Audience Fit 30%", "how well the idea leverages Kiro", "Autonomy 20%", "real revenue in 90 days".
2. Winners open with a cited statistic and a named user, e.g. "insurers denied 19% of in-network claims; fewer than 1% were appealed (KFF)".
3. Domain insiders and lived experience won repeatedly: a vet built vet phone triage, a cardiologist built a cardiac-arrest co-pilot, an ex-clinician built anxiety-detection hardware.
4. A repeatable "X for Y" line: "Duolingo for endangered languages", "TaskRabbit for Nigeria", "Cursor for surgery", "Cluely for seniors".
5. Sponsor hackathons: the sponsor's unique or newest feature is the spine. Swap test: if a competitor's product could replace it without changing the demo, the project is under-using it. Technical implementation is often weighted 40–50%.
6. Accessibility, health and safety took a disproportionate share of overall prizes (all 3 ShellHacks 2026 Best Overall; both Chrome Built-in AI "Most Helpful"; OpenAI Build Week 1st place).
7. In-person university hackathons: teams of about 3 (only 18% solo), hardware plus AI (13% of in-person winners had hardware vs 3% online), human story, sponsor prizes stacked deliberately.
8. Online contests: 61% of winners were solo builders. In must-deploy contests 69% were solo and 74% linked a live demo. Polish beats novelty. Growth contests judged real metrics (MRR, users, downloads).
9. 93% of winners had a demo video (median length 2:56). 67% had a public repo. Most stacked 2–4 sponsor or bonus prizes from one project.
10. Crowded categories that rarely win unless sharply differentiated: generic AI study buddy, chatbot wrapper, resume helper, to-do app.
11. Web3: be "the first X on chain Y" and make the sponsor's asset the core primitive. Games: a proven genre loop executed with polish and social or shareable hooks.`;

  const READ_RULES = `STEP 1: Read the rules. Use web access and do not guess.
Open the hackathon page, its /rules page and its /project-gallery. Produce a table with:
a) every judging criterion and its weight (quote the wording);
b) the ONE criterion unique to this hackathon;
c) hard disqualifiers: required tech, required files/folders/badges, deploy target, video length and visibility, new-code-only rules, team size;
d) every prize, including sponsor and bonus prizes, with eligibility;
e) a classification: must-deploy vs submit-only, and type (sponsor-online / in-person university / growth-platform / web3 / games-creative / student social-good).
If this hackathon has run before, open the previous edition's winners and summarise what won and why.`;

  const PROMPTS = {
    idea: {
      title: 'Generate a winning idea',
      desc: 'Give it the hackathon link and your team. It reads the rules, then generates, stress-tests and ranks ideas against the judges\' rubric and the winner patterns.',
      fields: ['url', 'team', 'time', 'interests'],
      cmdName: 'hack-idea',
      cmdHint: '<hackathon-url> <team & skills> <hours available> <interests>',
      body: v => `You are a hackathon strategist. Produce project ideas for the hackathon below that are designed to win against its actual rubric, then recommend one.

INPUTS
- Hackathon URL: ${v.url}
- Team and skills: ${v.team}
- Time available: ${v.time}
- Interests / constraints: ${v.interests}

${READ_RULES}

STEP 2: Generate and filter ideas.
Brainstorm 10 raw ideas, then keep the 5 that best fit the unique criterion, the team's skills and the patterns below. Discard any idea in a crowded category unless it has a hard differentiator (hardware, a narrow underserved user, an unusual public dataset, on-device/offline).

${PATTERNS}

STEP 3: For each of the 5 ideas, give:
- an "X for Y" tagline (max 12 words) and one specific named user (a role, not a market);
- one real statistic for the problem, with a source URL you have opened and verified (no invented numbers);
- the team's personal or domain link to the problem, or the one real user to interview during the event;
- which judging criterion it maximises and exactly how the demo proves it in the first 30 seconds;
- the sponsor feature it is built around, and whether it passes the swap test;
- every extra prize it qualifies for without changing the idea;
- the nearest 3 existing projects (search devpost.com/software and the web) and how this one differs;
- a scope that fits the time available: the ONE end-to-end flow to build first, and the cut list;
- a 3-minute video storyboard: 0:00–0:20 problem plus statistic, 0:20–2:00 live flow, 2:00–2:40 architecture and sponsor tech, 2:40–3:00 impact and next step;
- the top 3 risks (technical, API limits, data access) and the fallback for each.

STEP 4: Score and decide.
Score each idea 1–5 on every official criterion and apply the official weights. Add two unweighted columns: "feasible in the time available" and "demo wow". Show a table with weighted totals. Recommend one idea and explain in 3 sentences why it beats the runner-up for THIS rubric.

RULES FOR YOUR ANSWER
- Tie every claim to the rules text, a winner example or a source you opened.
- Do not give generic advice such as "be unique" or "focus on UX".
- If the hackathon page cannot be read, stop and say so rather than guessing.`
    },
    validate: {
      title: 'Validate my idea or project',
      desc: 'Paste your idea (or links to what you built). It acts as this hackathon\'s judging panel: checks hard gates, scores against the rubric, audits against the winner patterns and gives ranked fixes.',
      fields: ['url', 'idea', 'stage', 'links', 'time'],
      cmdName: 'hack-validate',
      cmdHint: '<hackathon-url> <your idea in 2-3 sentences> <links: repo/demo/video>',
      body: v => `You are the judging panel for the hackathon below. Evaluate my idea or project exactly as these judges would. Be blunt: no praise, no softening.

INPUTS
- Hackathon URL: ${v.url}
- My idea / project: ${v.idea}
- Stage: ${v.stage}
- Links (repo / live demo / video / Devpost draft): ${v.links}
- Time left: ${v.time}

${READ_RULES}

STEP 2: Hard gates. Mark each disqualifier from step 1 PASS / FAIL / UNKNOWN, with evidence. Any FAIL goes to the top of the final answer.

STEP 3: Panel scoring. Score every official criterion 1–10 as three personas:
- the sponsor's product manager (does it showcase our product, and our newest features?);
- a senior engineer (is it real, end-to-end and technically non-trivial?);
- an impact or business judge (does it solve a real problem for a specific user?).
Give one sentence per score that quotes the rubric wording, then the weighted total.

STEP 4: Audit against winner patterns. Mark each line PASS / WEAK / FAIL and give a concrete fix:
1. The problem has a real, cited statistic (verify the source exists).
2. One specific named user, not a market.
3. A personal or domain link, or a real user quote.
4. A repeatable "X for Y" tagline.
5. Sponsor swap test.
6. Crowdedness: search devpost.com/software and the web, list the 3 nearest existing projects, and say whether mine is clearly different.
7. One end-to-end flow that can be shown working in under 3 minutes.
8. A live URL with a demo mode that needs no sign-up (online hackathons), or a working physical demo (in-person).
9. A public repo with README, setup steps, architecture diagram, where each sponsor tool is used, and no secrets.
10. AI output is grounded and verifiable (citations, refusals, confidence) where AI is used.
11. Video plan follows 0:20 problem / 1:40 live flow / 0:40 architecture / 0:20 impact, and stays at or under 3:00.
12. Extra sponsor or bonus prizes not yet claimed.

${PATTERNS}

STEP 5: If links are provided, actually open them. Check that the repo is public, the README is complete, the sponsor SDK/API is really called in the code (search for it), the demo loads logged out, and the video is public and under 3:00. Report what you found, not what you assume.

STEP 6: Verdict.
- Tier: Long shot / Contender / Favourite, with the 2 reasons that decide it.
- The 5 highest-leverage changes, ranked by expected score gain per hour of work, given the time left.
- A rewritten tagline and a rewritten 0:00–0:20 video opener.
- If the idea is weak, propose 2 pivots that reuse most of the existing work and fit the rubric better.`
    }
  };

  const FIELDS = {
    url: { label: 'Hackathon URL', ph: 'https://example.devpost.com', type: 'input' },
    team: { label: 'Team & skills', ph: 'e.g. 2 people: full-stack TS/React, one ML (PyTorch); no hardware', type: 'input' },
    time: { label: 'Time available', ph: 'e.g. 36 hours in person, or 4 weekends', type: 'input' },
    interests: { label: 'Interests / constraints', ph: 'e.g. health, accessibility; must use Gemini; no paid APIs', type: 'input' },
    idea: { label: 'Your idea / project', ph: 'What it does, for whom, and how — 2–4 sentences', type: 'textarea' },
    stage: { label: 'Stage', type: 'select', opts: ['Idea only', 'Prototype in progress', 'Built — ready to submit'] },
    links: { label: 'Links (optional)', ph: 'repo, live demo, video, Devpost draft', type: 'input' },
  };

  const root = document.getElementById('view-agent');
  const val = {};
  let fmt = 'chat';
  try { Object.assign(val, JSON.parse(localStorage.getItem('hk-agent-v1') || '{}')); } catch {}
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const build = key => {
    const p = PROMPTS[key];
    if (fmt === 'cmd') {
      const v = Object.fromEntries(p.fields.map(f => [f, f === 'url' ? '$1' : `(from $ARGUMENTS; ask me if missing)`]));
      return `---\ndescription: ${p.title} for a Devpost hackathon\nargument-hint: ${p.cmdHint}\n---\n\nArguments: $ARGUMENTS\n\n` + p.body(v);
    }
    const v = Object.fromEntries(p.fields.map(f => [f, (val[f] || '').trim() || `[fill in: ${FIELDS[f].label.toLowerCase()}]`]));
    return p.body(v);
  };

  const fieldHtml = f => {
    const d = FIELDS[f], v = esc(val[f] || '');
    const input = d.type === 'textarea' ? `<textarea data-f="${f}" rows="3" placeholder="${esc(d.ph)}">${v}</textarea>`
      : d.type === 'select' ? `<select data-f="${f}"><option value="">Choose…</option>${d.opts.map(o => `<option ${val[f] === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`
      : `<input data-f="${f}" placeholder="${esc(d.ph)}" value="${v}">`;
    return `<label class="ag-field"><span>${d.label}</span>${input}</label>`;
  };

  function render() {
    root.innerHTML = `
      <p class="ag-intro">Two copy-paste prompts for any agent with web access (Claude Code, Claude, ChatGPT, Cursor). Fill in the fields and the prompts update live. Both prompts include the winner patterns from this report, so the agent scores your idea against what actually won, not generic advice.</p>
      <div class="seg ag-fmt" role="group" aria-label="Prompt format">
        <button data-fmt="chat" class="${fmt === 'chat' ? 'on' : ''}">Chat prompt</button>
        <button data-fmt="cmd" class="${fmt === 'cmd' ? 'on' : ''}">Claude Code slash command</button>
      </div>
      ${fmt === 'cmd' ? `<p class="org ag-note">Save each one as a file in your project, e.g. <code>.claude/commands/hack-idea.md</code> and <code>.claude/commands/hack-validate.md</code>. Then run <code>/hack-idea https://x.devpost.com "2 devs, TS + ML" "36h" "health"</code> in Claude Code.</p>` : ''}
      <div class="ag-grid">
        ${Object.entries(PROMPTS).map(([k, p], i) => `
          <article class="ag-card">
            <p class="ag-num">Command ${i + 1}</p>
            <h3>${p.title}</h3>
            <p class="ag-desc">${p.desc}</p>
            ${fmt === 'chat' ? `<div class="ag-fields">${p.fields.map(fieldHtml).join('')}</div>` : `<p class="org">File: <code>.claude/commands/${p.cmdName}.md</code></p>`}
            <div class="ag-actions">
              <button class="ck-btn" data-copy="${k}">Copy prompt</button>
              <button class="ck-btn" data-dl="${k}">Download .md</button>
              <span class="ag-status" id="st-${k}" aria-live="polite"></span>
            </div>
            <pre class="ag-pre" id="pre-${k}" tabindex="0">${esc(build(k))}</pre>
          </article>`).join('')}
      </div>`;
  }

  const refresh = () => Object.keys(PROMPTS).forEach(k => { const el = document.getElementById('pre-' + k); if (el) el.textContent = build(k); });
  root.addEventListener('input', e => {
    const f = e.target.dataset.f; if (!f) return;
    val[f] = e.target.value;
    root.querySelectorAll(`[data-f="${f}"]`).forEach(x => { if (x !== e.target) x.value = e.target.value; });
    try { localStorage.setItem('hk-agent-v1', JSON.stringify(val)); } catch {}
    refresh();
  });
  root.addEventListener('click', async e => {
    const fb = e.target.closest('[data-fmt]'); if (fb) { fmt = fb.dataset.fmt; render(); return; }
    const c = e.target.closest('[data-copy]');
    if (c) {
      const k = c.dataset.copy, text = build(k), st = document.getElementById('st-' + k);
      try { await navigator.clipboard.writeText(text); st.textContent = 'Copied ✓'; }
      catch { // file:// or blocked clipboard: select the text so Cmd/Ctrl+C works
        const r = document.createRange(); r.selectNodeContents(document.getElementById('pre-' + k));
        getSelection().removeAllRanges(); getSelection().addRange(r); st.textContent = 'Selected — press Cmd/Ctrl+C';
      }
      setTimeout(() => { st.textContent = ''; }, 2500);
    }
    const d = e.target.closest('[data-dl]');
    if (d) {
      const k = d.dataset.dl, a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([build(k)], { type: 'text/markdown' }));
      a.download = `${PROMPTS[k].cmdName}.md`; a.click(); URL.revokeObjectURL(a.href);
    }
  });
  render();
})();
